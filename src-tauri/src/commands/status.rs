use std::sync::Arc;
use tauri::State;

use crate::error::AppResult;
use crate::events::GameStatePayload;
use crate::presence::PresenceManager;
use crate::process::ProcessDetector;

#[tauri::command]
pub async fn check_processes() -> AppResult<ProcessStatus> {
    let detector = ProcessDetector::new();
    Ok(ProcessStatus {
        valorant_running: detector.is_valorant_running(),
        riot_client_running: detector.is_riot_client_running(),
    })
}

#[tauri::command]
pub async fn get_game_state(
    manager: State<'_, Arc<PresenceManager>>,
) -> AppResult<Option<GameStatePayload>> {
    Ok(manager.get_current_state().await)
}

#[tauri::command]
pub async fn get_connection_status(
    manager: State<'_, Arc<PresenceManager>>,
) -> AppResult<ConnectionStatus> {
    Ok(manager.get_connection_status().await)
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessStatus {
    pub valorant_running: bool,
    pub riot_client_running: bool,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionStatus {
    pub discord_connected: bool,
    pub riot_api_connected: bool,
}
