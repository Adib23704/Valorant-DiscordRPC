use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
  pub puuid: String,
  pub game_name: Option<String>,
  pub game_tag: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PresenceData {
  #[serde(default)]
  pub session_loop_state: Option<String>,

  #[serde(default)]
  pub party_state: Option<String>,

  #[serde(default)]
  pub party_id: String,

  #[serde(default)]
  pub party_size: u32,

  #[serde(default)]
  pub max_party_size: u32,

  #[serde(default)]
  pub party_accessibility: Option<String>,

  #[serde(default)]
  pub queue_id: Option<String>,

  #[serde(default)]
  pub queue_entry_time: Option<String>,

  #[serde(default)]
  pub is_idle: bool,

  #[serde(default)]
  pub is_matchmaking_game: Option<bool>,

  #[serde(default)]
  pub matchmaking_state: Option<String>,

  #[serde(default)]
  pub provisioning_flow: Option<String>,

  #[serde(default)]
  pub match_map: Option<String>,

  #[serde(default)]
  pub custom_game_team: Option<String>,

  #[serde(default)]
  pub party_owner_match_score_ally_team: Option<i32>,

  #[serde(default)]
  pub party_owner_match_score_enemy_team: Option<i32>,

  #[serde(default)]
  pub account_level: Option<u32>,

  #[serde(default)]
  pub competitive_tier: Option<u32>,

  #[serde(default)]
  pub is_party_owner_matchmvp_banned: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresencesResponse {
  pub presences: Vec<PresenceEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PresenceEntry {
  pub puuid: String,
  pub product: String,
  pub private: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SessionLoopState {
  #[default]
  Menus,
  Pregame,
  Ingame,
}

impl SessionLoopState {
  pub fn from_string(s: &str) -> Self {
    match s.to_uppercase().as_str() {
      "PREGAME" => Self::Pregame,
      "INGAME" => Self::Ingame,
      _ => Self::Menus,
    }
  }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PregamePlayer {
  pub match_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PregameMatch {
  #[serde(rename = "ID")]
  pub id: String,
  pub ally_team: Option<PregameTeam>,
  pub enemy_team: Option<PregameTeam>,
  pub phase_time_remaining_ns: i64,
  pub mode: Option<String>,
  pub map_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PregameTeam {
  pub players: Vec<PregamePlayerInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct PregamePlayerInfo {
  pub subject: String,
  pub character_id: String,
  pub character_selection_state: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct CoregamePlayer {
  pub match_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct CoregameMatch {
  #[serde(rename = "MatchID")]
  pub match_id: String,
  #[serde(rename = "MapID")]
  pub map_id: String,
  pub players: Vec<CoregamePlayerInfo>,
  pub mode: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct CoregamePlayerInfo {
  pub subject: String,
  pub character_id: String,
  pub team_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct MmrResponse {
  pub queue_skills: Option<QueueSkills>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueueSkills {
  pub competitive: Option<CompetitiveSkill>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct CompetitiveSkill {
  pub seasonal_info_by_season_id: HashMap<String, SeasonalInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SeasonalInfo {
  pub competitive_tier: u32,
  pub ranked_rating: i32,
  pub leaderboard_rank: u32,
  pub number_of_wins: Option<u32>,
  pub number_of_games: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct AccountXpResponse {
  pub progress: Option<AccountProgress>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct AccountProgress {
  pub level: u32,
  pub xp: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct ContentResponse {
  pub seasons: Option<Vec<SeasonContent>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct SeasonContent {
  #[serde(rename = "ID")]
  pub id: String,
  pub name: String,
  pub is_active: bool,
  #[serde(rename = "Type")]
  pub content_type: Option<String>,
}
