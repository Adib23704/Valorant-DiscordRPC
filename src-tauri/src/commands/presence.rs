use std::sync::Arc;
use tauri::State;

use crate::config::SettingsStore;
use crate::error::AppResult;
use crate::presence::PresenceManager;

#[tauri::command]
pub async fn start_presence(
  manager: State<'_, Arc<PresenceManager>>,
  settings_store: State<'_, Arc<SettingsStore>>,
) -> AppResult<()> {
  manager.start(settings_store.inner().clone()).await
}

#[tauri::command]
pub async fn stop_presence(manager: State<'_, Arc<PresenceManager>>) -> AppResult<()> {
  manager.stop().await
}

#[tauri::command]
pub async fn is_presence_running(manager: State<'_, Arc<PresenceManager>>) -> AppResult<bool> {
  Ok(manager.is_running().await)
}
