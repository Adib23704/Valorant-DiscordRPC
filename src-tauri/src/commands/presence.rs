use tauri::State;

use crate::error::AppResult;
use crate::presence::PresenceManager;

#[tauri::command]
pub async fn start_presence(manager: State<'_, PresenceManager>) -> AppResult<()> {
    manager.start().await
}

#[tauri::command]
pub async fn stop_presence(manager: State<'_, PresenceManager>) -> AppResult<()> {
    manager.stop().await
}

#[tauri::command]
pub async fn is_presence_running(manager: State<'_, PresenceManager>) -> AppResult<bool> {
    Ok(manager.is_running().await)
}
