use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Agent {
    pub uuid: String,

    pub display_name: String,

    #[serde(default)]
    pub developer_name: String,

    #[serde(default)]
    pub is_playable_character: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameMap {
    pub uuid: String,

    pub display_name: String,

    #[serde(default)]
    pub map_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameMode {
    pub uuid: String,

    pub display_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompetitiveTier {
    pub tier: u32,

    pub tier_name: String,

    #[serde(default)]
    pub division_name: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct ContentData {
    pub agents: HashMap<String, Agent>,

    pub maps: HashMap<String, GameMap>,

    pub modes: Vec<GameMode>,

    pub comp_tiers: HashMap<u32, CompetitiveTier>,

    pub current_season_id: Option<String>,
}

impl ContentData {
    pub fn get_agent(&self, uuid: &str) -> Option<&Agent> {
        let normalized = uuid.to_lowercase().replace('-', "");
        self.agents.iter().find_map(|(k, v)| {
            if k.to_lowercase().replace('-', "") == normalized {
                Some(v)
            } else {
                None
            }
        })
    }

    pub fn get_map_by_path(&self, path: &str) -> Option<&GameMap> {
        let path_lower = path.to_lowercase();
        self.maps.values().find(|m| {
            let map_url_lower = m.map_url.to_lowercase();
            path_lower.contains(&map_url_lower) || map_url_lower.contains(&path_lower)
        })
    }

    pub fn get_rank(&self, tier: u32) -> Option<&CompetitiveTier> {
        self.comp_tiers.get(&tier)
    }

    pub fn get_rank_name(&self, tier: u32) -> String {
        self.comp_tiers
            .get(&tier)
            .map(|t| t.tier_name.clone())
            .unwrap_or_else(|| format!("Tier {}", tier))
    }
}

#[derive(Debug, Deserialize)]
pub struct AgentsResponse {
    pub data: Vec<Agent>,
}

#[derive(Debug, Deserialize)]
pub struct MapsResponse {
    pub data: Vec<GameMap>,
}

#[derive(Debug, Deserialize)]
pub struct CompetitiveTiersResponse {
    pub data: Vec<CompetitiveTierSeason>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompetitiveTierSeason {
    pub uuid: String,
    pub tiers: Vec<CompetitiveTier>,
}
