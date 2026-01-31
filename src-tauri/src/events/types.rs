use serde::{Deserialize, Serialize};

use crate::discord::DiscordActivity;
use crate::riot::SessionLoopState;

pub mod event_names {

    pub const GAME_STATE_CHANGED: &str = "game-state-changed";

    pub const PRESENCE_UPDATED: &str = "presence-updated";

    pub const CONNECTION_CHANGED: &str = "connection-changed";

    pub const ERROR: &str = "app-error";

    pub const CONTENT_LOADED: &str = "content-loaded";
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameStatePayload {
    pub valorant_running: bool,

    pub riot_client_running: bool,

    pub session_state: SessionLoopState,

    pub queue_id: Option<String>,

    pub map_name: Option<String>,

    pub agent_name: Option<String>,

    pub score: Option<(i32, i32)>,

    pub is_idle: bool,

    pub party_size: Option<(u32, u32)>,
}

impl Default for GameStatePayload {
    fn default() -> Self {
        Self {
            valorant_running: false,
            riot_client_running: false,
            session_state: SessionLoopState::Menus,
            queue_id: None,
            map_name: None,
            agent_name: None,
            score: None,
            is_idle: false,
            party_size: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresenceUpdatePayload {
    pub activity: DiscordActivity,

    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionPayload {
    pub discord_connected: bool,

    pub riot_api_connected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorPayload {
    pub code: String,

    pub message: String,
}

impl ErrorPayload {
    pub fn new(code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            message: message.into(),
        }
    }
}
