use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use parking_lot::Mutex;
use std::sync::Arc;

use crate::error::{AppError, AppResult};

use super::activity::DiscordActivity;
use super::assets::DISCORD_CLIENT_ID;

pub struct DiscordClient {
    client: Arc<Mutex<Option<DiscordIpcClient>>>,
    connected: Arc<Mutex<bool>>,
}

impl DiscordClient {
    pub fn new() -> Self {
        Self {
            client: Arc::new(Mutex::new(None)),
            connected: Arc::new(Mutex::new(false)),
        }
    }

    pub fn connect(&self) -> AppResult<()> {
        let mut client_guard = self.client.lock();

        if client_guard.is_some() && *self.connected.lock() {
            return Ok(());
        }

        let mut client = DiscordIpcClient::new(&DISCORD_CLIENT_ID.to_string())
            .map_err(|e| AppError::DiscordRpc(format!("Failed to create client: {}", e)))?;

        client
            .connect()
            .map_err(|e| AppError::DiscordRpc(format!("Failed to connect: {}", e)))?;

        *client_guard = Some(client);
        *self.connected.lock() = true;

        tracing::info!("Connected to Discord IPC");
        Ok(())
    }

    pub fn disconnect(&self) -> AppResult<()> {
        let mut client_guard = self.client.lock();

        if let Some(ref mut client) = *client_guard {
            let _ = client.close();
        }

        *client_guard = None;
        *self.connected.lock() = false;

        tracing::info!("Disconnected from Discord IPC");
        Ok(())
    }

    pub fn is_connected(&self) -> bool {
        *self.connected.lock()
    }

    pub fn update_activity(&self, activity_data: &DiscordActivity) -> AppResult<()> {
        let mut client_guard = self.client.lock();

        let client = client_guard
            .as_mut()
            .ok_or_else(|| AppError::DiscordRpc("Not connected to Discord".into()))?;

        let mut activity_builder = activity::Activity::new();

        if let Some(ref state) = activity_data.state {
            activity_builder = activity_builder.state(state);
        }

        if let Some(ref details) = activity_data.details {
            activity_builder = activity_builder.details(details);
        }

        let mut timestamps = activity::Timestamps::new();
        if let Some(start) = activity_data.start_timestamp {
            timestamps = timestamps.start(start);
        }
        if let Some(end) = activity_data.end_timestamp {
            timestamps = timestamps.end(end);
        }
        if activity_data.start_timestamp.is_some() || activity_data.end_timestamp.is_some() {
            activity_builder = activity_builder.timestamps(timestamps);
        }

        let mut assets = activity::Assets::new();
        let mut has_assets = false;

        if let Some(ref large_image) = activity_data.large_image {
            assets = assets.large_image(large_image);
            has_assets = true;
            if let Some(ref large_text) = activity_data.large_text {
                assets = assets.large_text(large_text);
            }
        }

        if let Some(ref small_image) = activity_data.small_image {
            assets = assets.small_image(small_image);
            has_assets = true;
            if let Some(ref small_text) = activity_data.small_text {
                assets = assets.small_text(small_text);
            }
        }

        if has_assets {
            activity_builder = activity_builder.assets(assets);
        }

        if let Some((current, max)) = activity_data.party_size {
            let party = activity::Party::new().size([current as i32, max as i32]);
            activity_builder = activity_builder.party(party);
        }

        client
            .set_activity(activity_builder)
            .map_err(|e| AppError::DiscordRpc(format!("Failed to set activity: {}", e)))?;

        Ok(())
    }

    pub fn clear_activity(&self) -> AppResult<()> {
        let mut client_guard = self.client.lock();

        if let Some(ref mut client) = *client_guard {
            let _ = client.clear_activity();
        }

        Ok(())
    }

    pub fn reconnect(&self) -> AppResult<()> {
        let _ = self.disconnect();
        std::thread::sleep(std::time::Duration::from_millis(500));
        self.connect()
    }
}

impl Default for DiscordClient {
    fn default() -> Self {
        Self::new()
    }
}

impl Drop for DiscordClient {
    fn drop(&mut self) {
        let _ = self.disconnect();
    }
}
