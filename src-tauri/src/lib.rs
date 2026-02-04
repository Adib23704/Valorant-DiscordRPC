pub mod commands;
pub mod config;
pub mod content;
pub mod discord;
pub mod error;
pub mod events;
pub mod presence;
pub mod process;
pub mod riot;

use std::sync::Arc;

use config::SettingsStore;
use presence::PresenceManager;
use tauri::Manager;

pub struct AppState {
  pub presence_manager: Arc<PresenceManager>,
  pub settings_store: Arc<SettingsStore>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tracing_subscriber::fmt()
    .with_env_filter(
      tracing_subscriber::EnvFilter::from_default_env()
        .add_directive("valorant_discordrpc=debug".parse().unwrap())
        .add_directive("tauri=info".parse().unwrap()),
    )
    .init();

  tracing::info!(
    "Starting Valorant DiscordRPC v{}",
    env!("CARGO_PKG_VERSION")
  );

  let builder = tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_store::Builder::default().build());

  builder
    .setup(|app| {
      let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");

      let settings_store = Arc::new(SettingsStore::new(app_data_dir));

      let presence_manager = Arc::new(PresenceManager::new());

      app.manage(presence_manager.clone());
      app.manage(settings_store.clone());

      tracing::info!("Application initialized successfully");
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      commands::start_presence,
      commands::stop_presence,
      commands::is_presence_running,
      commands::get_settings,
      commands::save_settings,
      commands::reset_settings,
      commands::check_processes,
      commands::get_game_state,
      commands::get_connection_status,
    ])
    .run(tauri::generate_context!())
    .expect("Error while running Tauri application");
}
