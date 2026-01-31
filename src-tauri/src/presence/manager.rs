use parking_lot::RwLock;
use std::sync::Arc;
use tokio::sync::mpsc;

use crate::commands::status::ConnectionStatus;
use crate::config::AppSettings;
use crate::content::ContentData;
use crate::discord::DiscordClient;
use crate::error::AppResult;
use crate::events::GameStatePayload;
use crate::process::ProcessDetector;
use crate::riot::SessionLoopState;

enum PresenceCommand {
    Start,
    Stop,
    UpdateSettings(AppSettings),
}

pub struct PresenceManager {
    running: Arc<RwLock<bool>>,

    current_state: Arc<RwLock<Option<GameStatePayload>>>,

    connection_status: Arc<RwLock<ConnectionStatus>>,

    discord: Arc<DiscordClient>,

    content: Arc<RwLock<Option<ContentData>>>,

    command_tx: Option<mpsc::Sender<PresenceCommand>>,
}

impl PresenceManager {
    pub fn new() -> Self {
        Self {
            running: Arc::new(RwLock::new(false)),
            current_state: Arc::new(RwLock::new(None)),
            connection_status: Arc::new(RwLock::new(ConnectionStatus {
                discord_connected: false,
                riot_api_connected: false,
            })),
            discord: Arc::new(DiscordClient::new()),
            content: Arc::new(RwLock::new(None)),
            command_tx: None,
        }
    }

    pub async fn start(&self) -> AppResult<()> {
        if *self.running.read() {
            return Ok(());
        }

        self.discord.connect()?;
        self.connection_status.write().discord_connected = true;

        *self.running.write() = true;
        tracing::info!("Presence manager started");

        Ok(())
    }

    pub async fn stop(&self) -> AppResult<()> {
        *self.running.write() = false;

        let _ = self.discord.clear_activity();
        let _ = self.discord.disconnect();

        self.connection_status.write().discord_connected = false;
        self.connection_status.write().riot_api_connected = false;

        tracing::info!("Presence manager stopped");
        Ok(())
    }

    pub async fn is_running(&self) -> bool {
        *self.running.read()
    }

    pub async fn get_current_state(&self) -> Option<GameStatePayload> {
        self.current_state.read().clone()
    }

    pub async fn get_connection_status(&self) -> ConnectionStatus {
        self.connection_status.read().clone()
    }

    pub fn update_state(&self, state: GameStatePayload) {
        *self.current_state.write() = Some(state);
    }

    pub fn set_content(&self, content: ContentData) {
        *self.content.write() = Some(content);
    }

    pub fn get_content(&self) -> Option<ContentData> {
        self.content.read().clone()
    }

    pub fn discord(&self) -> &DiscordClient {
        &self.discord
    }

    pub fn detect_processes(&self) -> (bool, bool) {
        let detector = ProcessDetector::new().refreshed();
        (
            detector.is_valorant_running(),
            detector.is_riot_client_running(),
        )
    }

    pub fn determine_session_state(
        &self,
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
