use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
  #[error("Lockfile error: {0}")]
  Lockfile(String),

  #[error("Riot API error: {0}")]
  RiotApi(String),

  #[error("Discord RPC error: {0}")]
  DiscordRpc(String),

  #[error("Content API error: {0}")]
  ContentApi(String),

  #[error("Configuration error: {0}")]
  Config(String),

  #[error("Process detection error: {0}")]
  Process(String),

  #[error("HTTP error: {0}")]
  Http(#[from] reqwest::Error),

  #[error("JSON error: {0}")]
  Json(#[from] serde_json::Error),

  #[error("I/O error: {0}")]
  Io(#[from] std::io::Error),

  #[error("{0}")]
  Other(String),
}

pub type AppResult<T> = Result<T, AppError>;

impl From<AppError> for String {
  fn from(error: AppError) -> Self {
    error.to_string()
  }
}

impl serde::Serialize for AppError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    serializer.serialize_str(&self.to_string())
  }
}
