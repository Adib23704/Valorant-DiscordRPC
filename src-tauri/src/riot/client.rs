use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};

use crate::error::{AppError, AppResult};

use super::endpoints::Endpoints;
use super::lockfile::Lockfile;
use super::types::*;

pub struct RiotClient {
    client: reqwest::Client,
    lockfile: Lockfile,
    puuid: Option<String>,
}

impl RiotClient {
    pub fn new() -> AppResult<Self> {
        let lockfile = Lockfile::read()?;

        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .build()
            .map_err(AppError::Http)?;

        Ok(Self {
            client,
            lockfile,
            puuid: None,
        })
    }

    pub fn with_lockfile(lockfile: Lockfile) -> AppResult<Self> {
        let client = reqwest::Client::builder()
            .danger_accept_invalid_certs(true)
            .build()
            .map_err(AppError::Http)?;

        Ok(Self {
            client,
            lockfile,
            puuid: None,
        })
    }

    fn default_headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        if let Ok(auth) = HeaderValue::from_str(&self.lockfile.auth_header()) {
            headers.insert(AUTHORIZATION, auth);
        }
        headers
    }

    async fn get<T: serde::de::DeserializeOwned>(&self, endpoint: &str) -> AppResult<T> {
        let url = format!("{}{}", self.lockfile.base_url(), endpoint);

        let response = self
            .client
            .get(&url)
            .headers(self.default_headers())
            .send()
            .await
            .map_err(|e| AppError::RiotApi(format!("Request failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(AppError::RiotApi(format!(
                "API returned status {}: {}",
                response.status(),
                endpoint
            )));
        }

        response
            .json::<T>()
            .await
            .map_err(|e| AppError::RiotApi(format!("Failed to parse response: {}", e)))
    }

    pub async fn fetch_puuid(&mut self) -> AppResult<String> {
        if let Some(ref puuid) = self.puuid {
            return Ok(puuid.clone());
        }

        let session: Session = self.get(Endpoints::SESSION).await?;
        self.puuid = Some(session.puuid.clone());
        Ok(session.puuid)
    }

    pub async fn get_puuid(&mut self) -> AppResult<String> {
        self.fetch_puuid().await
    }

    pub async fn fetch_presence(&mut self) -> AppResult<PresenceData> {
        let puuid = self.get_puuid().await?;
        let response: PresencesResponse = self.get(Endpoints::PRESENCES).await?;

        let our_presence = response
            .presences
            .into_iter()
            .find(|p| p.puuid == puuid && p.product == "valorant")
            .ok_or_else(|| AppError::RiotApi("Player presence not found".into()))?;

        if let Some(private) = our_presence.private {
            use base64::Engine;
            let decoded = base64::engine::general_purpose::STANDARD
                .decode(private)
                .map_err(|e| AppError::RiotApi(format!("Failed to decode presence: {}", e)))?;

            let presence: PresenceData = serde_json::from_slice(&decoded)?;
            Ok(presence)
        } else {
            Ok(PresenceData::default())
        }
    }

    pub async fn fetch_pregame_player(&mut self) -> AppResult<PregamePlayer> {
        let puuid = self.get_puuid().await?;
        self.get(&Endpoints::pregame_player(&puuid)).await
    }

    pub async fn fetch_pregame_match(&self, match_id: &str) -> AppResult<PregameMatch> {
        self.get(&Endpoints::pregame_match(match_id)).await
    }

    pub async fn fetch_coregame_player(&mut self) -> AppResult<CoregamePlayer> {
        let puuid = self.get_puuid().await?;
        self.get(&Endpoints::coregame_player(&puuid)).await
    }

    pub async fn fetch_coregame_match(&self, match_id: &str) -> AppResult<CoregameMatch> {
        self.get(&Endpoints::coregame_match(match_id)).await
    }

    pub async fn fetch_mmr(&mut self) -> AppResult<MmrResponse> {
        let puuid = self.get_puuid().await?;
        self.get(&Endpoints::mmr(&puuid)).await
    }

    pub async fn fetch_account_xp(&mut self) -> AppResult<AccountXpResponse> {
        let puuid = self.get_puuid().await?;
        self.get(&Endpoints::account_xp(&puuid)).await
    }

    pub async fn fetch_content(&self) -> AppResult<ContentResponse> {
        self.get(Endpoints::CONTENT).await
    }

    pub async fn is_connected(&self) -> bool {
        let url = format!("{}{}", self.lockfile.base_url(), Endpoints::SESSION);
        self.client
            .get(&url)
            .headers(self.default_headers())
            .send()
            .await
            .map(|r| r.status().is_success())
            .unwrap_or(false)
    }
}
