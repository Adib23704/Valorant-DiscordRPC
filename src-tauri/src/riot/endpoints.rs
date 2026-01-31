pub struct Endpoints;

impl Endpoints {
    pub const PRESENCES: &'static str = "/chat/v4/presences";

    pub const SESSION: &'static str = "/chat/v1/session";

    pub fn pregame_player(puuid: &str) -> String {
        format!("/pregame/v1/players/{}", puuid)
    }

    pub fn pregame_match(match_id: &str) -> String {
        format!("/pregame/v1/matches/{}", match_id)
    }

    pub fn coregame_player(puuid: &str) -> String {
        format!("/core-game/v1/players/{}", puuid)
    }

    pub fn coregame_match(match_id: &str) -> String {
        format!("/core-game/v1/matches/{}", match_id)
    }

    pub fn mmr(puuid: &str) -> String {
        format!("/mmr/v1/players/{}", puuid)
    }

    pub fn account_xp(puuid: &str) -> String {
        format!("/account-xp/v1/players/{}", puuid)
    }

    pub fn player_loadout(puuid: &str) -> String {
        format!("/personalization/v2/players/{}/playerloadout", puuid)
    }

    pub const CONTENT: &'static str = "/content-service/v3/content";

    pub fn entitlements(puuid: &str) -> String {
        format!("/store/v1/entitlements/{}", puuid)
    }
}
