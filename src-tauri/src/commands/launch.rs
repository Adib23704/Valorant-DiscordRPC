use std::path::PathBuf;

use crate::error::{AppError, AppResult};

#[tauri::command]
pub async fn launch_valorant() -> Result<(), String> {
  do_launch_valorant().map_err(|e| e.to_string())
}

#[derive(serde::Deserialize)]
struct RiotClientInstalls {
  rc_default: Option<String>,
  rc_live: Option<String>,
}

fn find_riot_client() -> AppResult<PathBuf> {
  let program_data = std::env::var("PROGRAMDATA")
    .map_err(|_| AppError::Process("PROGRAMDATA environment variable not found".into()))?;

  let installs_path = PathBuf::from(&program_data)
    .join("Riot Games")
    .join("RiotClientInstalls.json");

  if !installs_path.exists() {
    return Err(AppError::Process(format!(
      "RiotClientInstalls.json not found at {}. Is Riot Client installed?",
      installs_path.display()
    )));
  }

  let content = std::fs::read_to_string(&installs_path)
    .map_err(|e| AppError::Process(format!("Failed to read RiotClientInstalls.json: {}", e)))?;

  let installs: RiotClientInstalls = serde_json::from_str(&content)
    .map_err(|e| AppError::Process(format!("Failed to parse RiotClientInstalls.json: {}", e)))?;

  let path_str = installs.rc_live.or(installs.rc_default).ok_or_else(|| {
    AppError::Process("No Riot Client path found in RiotClientInstalls.json".into())
  })?;

  let path = PathBuf::from(&path_str);

  if !path.exists() {
    return Err(AppError::Process(format!(
      "RiotClientServices.exe not found at {}",
      path.display()
    )));
  }

  Ok(path)
}

fn do_launch_valorant() -> AppResult<()> {
  let riot_client_path = find_riot_client()?;

  tracing::info!("Launching VALORANT via: {}", riot_client_path.display());

  let result = std::process::Command::new(&riot_client_path)
    .args(["--launch-product=valorant", "--launch-patchline=live"])
    .spawn();

  match result {
    Ok(child) => {
      tracing::info!(
        "Successfully spawned RiotClientServices.exe (pid: {})",
        child.id()
      );
      Ok(())
    }
    Err(e) => {
      tracing::error!("Failed to spawn RiotClientServices.exe: {}", e);
      Err(AppError::Process(format!(
        "Failed to launch VALORANT: {}",
        e
      )))
    }
  }
}
