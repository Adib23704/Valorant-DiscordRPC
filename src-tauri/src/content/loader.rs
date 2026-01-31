use crate::error::{AppError, AppResult};

use super::types::*;

const API_BASE_URL: &str = "https://valorant-api.com/v1";

pub struct ContentLoader {
    client: reqwest::Client,
}

impl ContentLoader {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::new(),
        }
    }

    pub async fn load_all(&self) -> AppResult<ContentData> {
        let (agents, maps, tiers) = tokio::try_join!(
            self.fetch_agents(),
            self.fetch_maps(),
            self.fetch_competitive_tiers()
        )?;

        Ok(ContentData {
            agents,
            maps,
            modes: Vec::new(),
            comp_tiers: tiers,
            current_season_id: None,
        })
    }

    async fn fetch_agents(&self) -> AppResult<std::collections::HashMap<String, Agent>> {
        let url = format!("{}/agents?isPlayableCharacter=true", API_BASE_URL);

        let response: AgentsResponse = self
            .client
            .get(&url)
            .send()
            .await
            .map_err(|e| AppError::ContentApi(format!("Failed to fetch agents: {}", e)))?
            .json()
            .await
            .map_err(|e| AppError::ContentApi(format!("Failed to parse agents: {}", e)))?;

        let agents = response
            .data
            .into_iter()
            .filter(|a| a.is_playable_character)
            .map(|a| (a.uuid.clone(), a))
            .collect();

        tracing::info!("Loaded agents from valorant-api.com");
        Ok(agents)
    }

    async fn fetch_maps(&self) -> AppResult<std::collections::HashMap<String, GameMap>> {
        let url = format!("{}/maps", API_BASE_URL);

        let response: MapsResponse = self
            .client
            .get(&url)
            .send()
            .await
            .map_err(|e| AppError::ContentApi(format!("Failed to fetch maps: {}", e)))?
            .json()
            .await
            .map_err(|e| AppError::ContentApi(format!("Failed to parse maps: {}", e)))?;

        let maps = response
            .data
            .into_iter()
            .map(|m| (m.map_url.clone(), m))
            .collect();

        tracing::info!("Loaded maps from valorant-api.com");
        Ok(maps)
    }

    async fn fetch_competitive_tiers(
        &self,
    ) -> AppResult<std::collections::HashMap<u32, CompetitiveTier>> {
        let url = format!("{}/competitivetiers", API_BASE_URL);

        let response: CompetitiveTiersResponse = self
            .client
            .get(&url)
            .send()
            .await
            .map_err(|e| AppError::ContentApi(format!("Failed to fetch competitive tiers: {}", e)))?
            .json()
            .await
            .map_err(|e| {
                AppError::ContentApi(format!("Failed to parse competitive tiers: {}", e))
            })?;

        let latest_tiers = response
            .data
            .into_iter()
            .last()
            .ok_or_else(|| AppError::ContentApi("No competitive tier data found".into()))?;

        let tiers = latest_tiers
            .tiers
            .into_iter()
            .map(|t| (t.tier, t))
            .collect();

        tracing::info!("Loaded competitive tiers from valorant-api.com");
        Ok(tiers)
    }
}

impl Default for ContentLoader {
    fn default() -> Self {
        Self::new()
    }
}
