use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscordActivity {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_timestamp: Option<i64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_timestamp: Option<i64>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub large_image: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub large_text: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub small_image: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub small_text: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub party_id: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub party_size: Option<(u32, u32)>,
}

impl DiscordActivity {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn state(mut self, state: impl Into<String>) -> Self {
        self.state = Some(state.into());
        self
    }

    pub fn details(mut self, details: impl Into<String>) -> Self {
        self.details = Some(details.into());
        self
    }

    pub fn start_timestamp(mut self, timestamp: i64) -> Self {
        self.start_timestamp = Some(timestamp);
        self
    }

    pub fn end_timestamp(mut self, timestamp: i64) -> Self {
        self.end_timestamp = Some(timestamp);
        self
    }

    pub fn large_image(mut self, key: impl Into<String>, text: Option<String>) -> Self {
        self.large_image = Some(key.into());
        self.large_text = text;
        self
    }

    pub fn small_image(mut self, key: impl Into<String>, text: Option<String>) -> Self {
        self.small_image = Some(key.into());
        self.small_text = text;
        self
    }

    pub fn party(mut self, party_id: impl Into<String>, current: u32, max: u32) -> Self {
        self.party_id = Some(party_id.into());
        self.party_size = Some((current, max));
        self
    }

    pub fn clear_timestamps(mut self) -> Self {
        self.start_timestamp = None;
        self.end_timestamp = None;
        self
    }
}
