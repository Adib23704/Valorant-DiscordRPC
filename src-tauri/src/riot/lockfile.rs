use std::path::PathBuf;

use crate::error::{AppError, AppResult};

#[derive(Debug, Clone)]
pub struct Lockfile {
    pub name: String,
    pub process_id: u32,
    pub port: u16,
    pub password: String,
    pub protocol: String,
}

impl Lockfile {
    pub fn default_path() -> AppResult<PathBuf> {
        let local_app_data = std::env::var("LOCALAPPDATA").map_err(|_| {
            AppError::Lockfile("LOCALAPPDATA environment variable not found".into())
        })?;

        Ok(PathBuf::from(local_app_data)
            .join("Riot Games")
            .join("Riot Client")
            .join("Config")
            .join("lockfile"))
    }

    pub fn read() -> AppResult<Self> {
        let path = Self::default_path()?;
        Self::read_from_path(&path)
    }

    pub fn read_from_path(path: &PathBuf) -> AppResult<Self> {
        let content = std::fs::read_to_string(path).map_err(|e| {
            AppError::Lockfile(format!(
                "Failed to read lockfile at {}: {}. Is the Riot Client running?",
                path.display(),
                e
            ))
        })?;

        Self::parse(&content)
    }

    fn parse(content: &str) -> AppResult<Self> {
        let parts: Vec<&str> = content.trim().split(':').collect();

        if parts.len() != 5 {
            return Err(AppError::Lockfile(format!(
                "Invalid lockfile format: expected 5 parts, got {}",
                parts.len()
            )));
        }

        let name = parts[0].to_string();

        let process_id = parts[1].parse::<u32>().map_err(|_| {
            AppError::Lockfile(format!("Invalid process ID in lockfile: {}", parts[1]))
        })?;

        let port = parts[2]
            .parse::<u16>()
            .map_err(|_| AppError::Lockfile(format!("Invalid port in lockfile: {}", parts[2])))?;

        let password = parts[3].to_string();
        let protocol = parts[4].to_string();

        Ok(Self {
            name,
            process_id,
            port,
            password,
            protocol,
        })
    }

    pub fn base_url(&self) -> String {
        format!("{}://127.0.0.1:{}", self.protocol, self.port)
    }

    pub fn auth_header(&self) -> String {
        use base64::Engine;
        let credentials = format!("riot:{}", self.password);
        let encoded = base64::engine::general_purpose::STANDARD.encode(credentials.as_bytes());
        format!("Basic {}", encoded)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_lockfile() {
        let content = "Riot Client:12345:54321:abcdefg123:https";
        let lockfile = Lockfile::parse(content).unwrap();

        assert_eq!(lockfile.name, "Riot Client");
        assert_eq!(lockfile.process_id, 12345);
        assert_eq!(lockfile.port, 54321);
        assert_eq!(lockfile.password, "abcdefg123");
        assert_eq!(lockfile.protocol, "https");
    }

    #[test]
    fn test_base_url() {
        let lockfile = Lockfile {
            name: "Riot Client".to_string(),
            process_id: 12345,
            port: 54321,
            password: "test".to_string(),
            protocol: "https".to_string(),
        };

        assert_eq!(lockfile.base_url(), "https://127.0.0.1:54321");
    }
}
