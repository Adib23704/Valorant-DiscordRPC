use tauri::State;

use crate::config::{AppSettings, SettingsStore};
use crate::error::AppResult;

#[tauri::command]
pub async fn get_settings(store: State<'_, SettingsStore>) -> AppResult<AppSettings> {
    store.get_settings().await
}

#[tauri::command]
pub async fn save_settings(
    store: State<'_, SettingsStore>,
    settings: AppSettings,
) -> AppResult<()> {
    store.save_settings(settings).await
}

#[tauri::command]
pub async fn reset_settings(store: State<'_, SettingsStore>) -> AppResult<AppSettings> {
    store.reset_to_defaults().await
}
