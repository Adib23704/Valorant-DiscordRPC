use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub version: String,

    pub region: String,

    pub locale: String,

    pub refresh_interval_ms: u64,

    pub presence: PresenceSettings,

    pub startup: StartupSettings,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            version: env!("CARGO_PKG_VERSION").to_string(),
            region: String::new(),
            locale: "en-US".to_string(),
            refresh_interval_ms: 3000,
            presence: PresenceSettings::default(),
            startup: StartupSettings::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresenceSettings {
    pub show_rank_in_comp_lobby: bool,

    pub show_rank_in_range: bool,

    pub large_image_pref: ImagePreference,

    pub small_image_pref: ImagePreference,

    pub show_elapsed_time: bool,

    pub show_party_size: bool,
}

impl Default for PresenceSettings {
    fn default() -> Self {
        Self {
            show_rank_in_comp_lobby: true,
            show_rank_in_range: false,
            large_image_pref: ImagePreference::Map,
            small_image_pref: ImagePreference::Agent,
            show_elapsed_time: true,
            show_party_size: true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ImagePreference {
    Map,

    Agent,

    Rank,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartupSettings {
    pub minimize_to_tray: bool,

    pub start_minimized: bool,

    pub auto_start: bool,
}

impl Default for StartupSettings {
    fn default() -> Self {
        Self {
            minimize_to_tray: true,
            start_minimized: false,
            auto_start: false,
        }
    }
}
