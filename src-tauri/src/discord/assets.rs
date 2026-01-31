pub const DISCORD_CLIENT_ID: u64 = 1354173612487213268;

pub mod icons {

    pub const GAME_ICON: &str = "game_icon";

    pub const GAME_ICON_WHITE: &str = "game_icon_white";

    pub const GAME_ICON_YELLOW: &str = "game_icon_yellow";

    pub const AWAY_ICON: &str = "away_icon";

    pub const CROWN_ICON: &str = "crown_icon";
}

pub fn agent_asset(agent_name: &str) -> String {
    format!(
        "agent_{}",
        agent_name.to_lowercase().replace(['/', ' ', '-', '\''], "")
    )
}

pub fn map_asset(map_name: &str) -> String {
    format!("splash_{}", map_name.to_lowercase().replace(' ', "_"))
}

pub fn rank_asset(tier_id: u32) -> String {
    format!("rank_{}", tier_id)
}

pub fn mode_asset(queue_id: &str) -> String {
    let known_modes = [
        "competitive",
        "unrated",
        "deathmatch",
        "spikerush",
        "ggteam",
        "onefa",
        "snowball",
        "swiftplay",
        "hurm",
    ];

    if known_modes.contains(&queue_id) {
        format!("mode_{}", queue_id)
    } else {
        "mode_discovery".to_string()
    }
}

pub mod teams {
    pub const ATTACKER: &str = "team_attacker";
    pub const DEFENDER: &str = "team_defender";

    pub fn from_team_id(team_id: &str) -> &'static str {
        match team_id {
            "TeamOne" | "Red" => DEFENDER,
            "TeamTwo" | "Blue" => ATTACKER,
            _ => DEFENDER,
        }
    }
}
