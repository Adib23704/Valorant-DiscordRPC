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
use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  Manager,
};

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

      let show_item = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
      let exit_item = MenuItem::with_id(app, "exit", "Exit", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_item, &exit_item])?;

      let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show" => {
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
          "exit" => {
            app.exit(0);
          }
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
        })
        .build(app)?;

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
