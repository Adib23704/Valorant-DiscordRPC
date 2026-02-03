use parking_lot::RwLock;
use std::path::{Path, PathBuf};
use std::sync::Arc;

use crate::error::{AppError, AppResult};

use super::settings::AppSettings;

pub struct SettingsStore {
  settings: Arc<RwLock<AppSettings>>,
  store_path: PathBuf,
}

impl SettingsStore {
  pub fn new(app_data_dir: impl AsRef<Path>) -> Self {
    let store_path = app_data_dir.as_ref().join("settings.json");
    let settings = Self::load_from_file(&store_path).unwrap_or_default();

    Self {
      settings: Arc::new(RwLock::new(settings)),
      store_path,
    }
  }

  fn load_from_file(path: impl AsRef<Path>) -> Option<AppSettings> {
    let content = std::fs::read_to_string(path).ok()?;
    serde_json::from_str(&content).ok()
  }

  fn save_to_file(&self, settings: &AppSettings) -> AppResult<()> {
    if let Some(parent) = self.store_path.parent() {
      std::fs::create_dir_all(parent)
        .map_err(|e| AppError::Config(format!("Failed to create config directory: {}", e)))?;
    }

    let content = serde_json::to_string_pretty(settings)?;
    std::fs::write(&self.store_path, content)
      .map_err(|e| AppError::Config(format!("Failed to save settings: {}", e)))?;

    Ok(())
  }

  pub async fn get_settings(&self) -> AppResult<AppSettings> {
    Ok(self.settings.read().clone())
  }

  pub async fn save_settings(&self, settings: AppSettings) -> AppResult<()> {
    *self.settings.write() = settings.clone();

    self.save_to_file(&settings)?;

    tracing::info!("Settings saved to {:?}", self.store_path);
    Ok(())
  }

  pub async fn reset_to_defaults(&self) -> AppResult<AppSettings> {
    let defaults = AppSettings::default();
    self.save_settings(defaults.clone()).await?;
    Ok(defaults)
  }

  pub async fn update<F>(&self, updater: F) -> AppResult<AppSettings>
  where
    F: FnOnce(&mut AppSettings),
  {
    let mut settings = self.settings.write();
    updater(&mut settings);
    let updated = settings.clone();
    drop(settings);

    self.save_to_file(&updated)?;
    Ok(updated)
  }
}
