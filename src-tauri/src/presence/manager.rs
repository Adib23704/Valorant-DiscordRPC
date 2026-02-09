use parking_lot::RwLock;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::Notify;

use crate::commands::status::ConnectionStatus;
use crate::config::{AppSettings, SettingsStore};
use crate::content::{constants::get_queue_name, ContentData, ContentLoader};
use crate::discord::DiscordClient;
use crate::error::{AppError, AppResult};
use crate::events::GameStatePayload;
use crate::presence::states::*;
use crate::riot::{RiotClient, SessionLoopState};

pub struct PresenceManager {
  running: Arc<AtomicBool>,
  stop_signal: Arc<Notify>,
  current_state: Arc<RwLock<Option<GameStatePayload>>>,
  connection_status: Arc<RwLock<ConnectionStatus>>,
  discord: Arc<DiscordClient>,
  content: Arc<RwLock<Option<ContentData>>>,
}

impl PresenceManager {
  pub fn new() -> Self {
    Self {
      running: Arc::new(AtomicBool::new(false)),
      stop_signal: Arc::new(Notify::new()),
      current_state: Arc::new(RwLock::new(None)),
      connection_status: Arc::new(RwLock::new(ConnectionStatus {
        discord_connected: false,
        riot_api_connected: false,
      })),
      discord: Arc::new(DiscordClient::new()),
      content: Arc::new(RwLock::new(None)),
    }
  }

  pub async fn start(&self, settings_store: Arc<SettingsStore>) -> AppResult<()> {
    if self.running.load(Ordering::SeqCst) {
      return Ok(());
    }

    self.discord.connect()?;
    self.connection_status.write().discord_connected = true;

    self.running.store(true, Ordering::SeqCst);
    tracing::info!("Presence manager started");

    let running = self.running.clone();
    let stop_signal = self.stop_signal.clone();
    let current_state = self.current_state.clone();
    let connection_status = self.connection_status.clone();
    let discord = self.discord.clone();
    let content_store = self.content.clone();

    tokio::spawn(async move {
      Self::presence_loop(
        running,
        stop_signal,
        current_state,
        connection_status,
        discord,
        content_store,
        settings_store,
      )
      .await;
    });

    Ok(())
  }

  async fn presence_loop(
    running: Arc<AtomicBool>,
    stop_signal: Arc<Notify>,
    current_state: Arc<RwLock<Option<GameStatePayload>>>,
    connection_status: Arc<RwLock<ConnectionStatus>>,
    discord: Arc<DiscordClient>,
    content_store: Arc<RwLock<Option<ContentData>>>,
    settings_store: Arc<SettingsStore>,
  ) {
    let mut riot_client: Option<RiotClient> = None;
    let mut last_state: Option<String> = None;
    let mut activity_start_time: Option<i64> = None;
    let mut content_loaded = false;
    let mut waiting_for_riot_client = false;
    let mut waiting_for_presence = false;

    loop {
      if !running.load(Ordering::SeqCst) {
        break;
      }

      const POLL_INTERVAL_MS: u64 = 3000;

      let poll_result = tokio::select! {
          _ = stop_signal.notified() => {
              tracing::info!("Received stop signal");
              break;
          }
          _ = tokio::time::sleep(Duration::from_millis(POLL_INTERVAL_MS)) => {
              true
          }
      };

      if !poll_result {
        continue;
      }

      if !content_loaded {
        let loader = ContentLoader::new();
        match loader.load_all().await {
          Ok(content) => {
            *content_store.write() = Some(content);
            content_loaded = true;
            tracing::info!("Loaded content data from valorant-api.com");
          }
          Err(e) => {
            tracing::warn!("Failed to load content: {}", e);
          }
        }
      }

      if riot_client.is_none() {
        match RiotClient::new() {
          Ok(client) => {
            riot_client = Some(client);
            connection_status.write().riot_api_connected = true;
            waiting_for_riot_client = false;
            tracing::info!("Connected to Riot API");
          }
          Err(e) => {
            if !waiting_for_riot_client {
              tracing::debug!("Waiting for Riot Client: {}", e);
              waiting_for_riot_client = true;
            }
            connection_status.write().riot_api_connected = false;
            continue;
          }
        }
      }

      let client = match riot_client.as_mut() {
        Some(c) => c,
        None => continue,
      };

      let settings: AppSettings = settings_store.get_settings().await.unwrap_or_default();

      let presence = match client.fetch_presence().await {
        Ok(p) => {
          if waiting_for_presence {
            tracing::info!("Player presence found");
            waiting_for_presence = false;
          }
          p
        }
        Err(AppError::RiotApi(ref msg))
          if msg.contains("presence not found") || msg.contains("API returned status") =>
        {
          if !waiting_for_presence {
            tracing::debug!("Waiting for VALORANT to start: {}", msg);
            waiting_for_presence = true;
          }
          continue;
        }
        Err(e) => {
          tracing::debug!("Lost connection to Riot Client: {}", e);
          riot_client = None;
          waiting_for_presence = false;
          connection_status.write().riot_api_connected = false;
          continue;
        }
      };

      let content = match content_store.read().clone() {
        Some(c) => c,
        None => {
          tracing::debug!("Content not loaded yet");
          continue;
        }
      };

      let puuid: String = client.get_puuid().await.unwrap_or_default();

      let session_state = Self::determine_session_state(
        presence.session_loop_state.as_deref(),
        presence.provisioning_flow.as_deref(),
      );

      let is_in_queue = presence.party_state.as_deref() == Some("MATCHMAKING");

      let state_key = format!(
        "{:?}-{}-{}",
        session_state,
        presence.queue_id.as_deref().unwrap_or(""),
        is_in_queue
      );
      if last_state.as_ref() != Some(&state_key) {
        activity_start_time = Some(chrono::Utc::now().timestamp());
        last_state = Some(state_key);
      }

      let activity = match session_state {
        SessionLoopState::Menus => {
          if presence.is_idle {
            build_away_presence(&presence)
          } else if presence.provisioning_flow.as_deref() == Some("CustomGame") {
            build_custom_setup_presence(&presence, &content)
          } else if is_in_queue {
            build_queue_presence(&presence, &content, &settings)
          } else {
            build_menu_presence(&presence, &content, &settings)
          }
        }
        SessionLoopState::Pregame => match client.fetch_pregame_player().await {
          Ok(pregame_player) => match client.fetch_pregame_match(&pregame_player.match_id).await {
            Ok(pregame_match) => {
              let player_info = pregame_match
                .ally_team
                .as_ref()
                .and_then(|team| team.players.iter().find(|p| p.subject == puuid));

              build_pregame_presence(&presence, &pregame_match, player_info, &content, &settings)
            }
            Err(_) => build_menu_presence(&presence, &content, &settings),
          },
          Err(_) => build_menu_presence(&presence, &content, &settings),
        },
        SessionLoopState::Ingame => {
          if presence.provisioning_flow.as_deref() == Some("ShootingRange") {
            build_range_presence(&presence, &content, &settings, activity_start_time)
          } else {
            match client.fetch_coregame_player().await {
              Ok(coregame_player) => {
                match client.fetch_coregame_match(&coregame_player.match_id).await {
                  Ok(coregame_match) => {
                    let player_info = coregame_match.players.iter().find(|p| p.subject == puuid);

                    build_ingame_presence(
                      &presence,
                      &coregame_match,
                      player_info,
                      &content,
                      &settings,
                      activity_start_time,
                    )
                  }
                  Err(_) => build_menu_presence(&presence, &content, &settings),
                }
              }
              Err(_) => build_menu_presence(&presence, &content, &settings),
            }
          }
        }
      };

      {
        let is_range = presence.provisioning_flow.as_deref() == Some("ShootingRange");

        let queue_name = if is_range {
          Some("The Range".to_string())
        } else {
          presence
            .queue_id
            .as_deref()
            .map(|id| get_queue_name(id).to_string())
        };

        let map_name = presence
          .match_map
          .as_deref()
          .and_then(|path| content.get_map_by_path(path))
          .map(|m| m.display_name.clone());

        let rank_name = presence
          .competitive_tier
          .filter(|&tier| tier > 0)
          .map(|tier| content.get_rank_name(tier));

        let score = if is_range {
          None
        } else {
          match session_state {
            SessionLoopState::Ingame => match (
              presence.party_owner_match_score_ally_team,
              presence.party_owner_match_score_enemy_team,
            ) {
              (Some(ally), Some(enemy)) => Some((ally, enemy)),
              _ => None,
            },
            _ => None,
          }
        };

        let game_state = GameStatePayload {
          valorant_running: true,
          riot_client_running: true,
          session_state,
          queue_name,
          map_name,
          agent_name: None,
          rank_name,
          account_level: presence.account_level,
          party_size: Some((presence.party_size, presence.max_party_size)),
          score,
          is_idle: presence.is_idle,
        };
        *current_state.write() = Some(game_state);
      }

      if let Err(e) = discord.update_activity(&activity) {
        tracing::warn!("Failed to update Discord activity: {}", e);

        if discord.reconnect().is_err() {
          connection_status.write().discord_connected = false;
        }
      }
    }

    tracing::info!("Presence loop ended");
  }

  pub async fn stop(&self) -> AppResult<()> {
    self.running.store(false, Ordering::SeqCst);
    self.stop_signal.notify_one();

    let _ = self.discord.clear_activity();
    let _ = self.discord.disconnect();

    self.connection_status.write().discord_connected = false;
    self.connection_status.write().riot_api_connected = false;
    *self.current_state.write() = None;

    tracing::info!("Presence manager stopped");
    Ok(())
  }

  pub async fn is_running(&self) -> bool {
    self.running.load(Ordering::SeqCst)
  }

  pub async fn get_current_state(&self) -> Option<GameStatePayload> {
    self.current_state.read().clone()
  }

  pub async fn get_connection_status(&self) -> ConnectionStatus {
    self.connection_status.read().clone()
  }

  fn determine_session_state(
    session_loop_state: Option<&str>,
    provisioning_flow: Option<&str>,
  ) -> SessionLoopState {
    if provisioning_flow == Some("ShootingRange") {
      return SessionLoopState::Ingame;
    }

    match session_loop_state {
      Some(state) => SessionLoopState::from_string(state),
      None => SessionLoopState::Menus,
    }
  }
}

impl Default for PresenceManager {
  fn default() -> Self {
    Self::new()
  }
}
