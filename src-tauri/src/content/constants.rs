use std::collections::HashMap;

pub fn queue_aliases() -> HashMap<&'static str, &'static str> {
    HashMap::from([
        ("newmap", "New Map"),
        ("competitive", "Competitive"),
        ("unrated", "Unrated"),
        ("spikerush", "Spike Rush"),
        ("deathmatch", "Deathmatch"),
        ("ggteam", "Escalation"),
        ("onefa", "Replication"),
        ("custom", "Custom"),
        ("snowball", "Snowball Fight"),
        ("swiftplay", "Swiftplay"),
        ("hurm", "Team Deathmatch"),
        ("", "Custom"),
    ])
}

pub fn get_queue_name(queue_id: &str) -> &'static str {
    queue_aliases().get(queue_id).copied().unwrap_or("Unknown")
}

pub fn team_aliases() -> HashMap<&'static str, &'static str> {
    HashMap::from([
        ("TeamOne", "Defender"),
        ("TeamTwo", "Attacker"),
        ("TeamSpectate", "Observer"),
        ("TeamOneCoaches", "Defender Coach"),
        ("TeamTwoCoaches", "Attacker Coach"),
        ("Red", "Defender"),
        ("Blue", "Attacker"),
    ])
}

pub fn get_team_name(team_id: &str) -> &'static str {
    team_aliases().get(team_id).copied().unwrap_or("Unknown")
}

pub const MODES_WITH_ICONS: &[&str] = &[
    "ggteam",
    "onefa",
    "snowball",
    "spikerush",
    "unrated",
    "deathmatch",
    "swiftplay",
    "hurm",
    "competitive",
];

pub fn has_mode_icon(queue_id: &str) -> bool {
    MODES_WITH_ICONS.contains(&queue_id)
}

pub mod party_states {
    pub const SOLO: &str = "Solo";
    pub const IN_PARTY: &str = "In a Party";
    pub const OPEN_PARTY: &str = "Open Party";

    pub fn get_party_state(
        party_size: u32,
        max_size: u32,
        accessibility: Option<&str>,
    ) -> &'static str {
        if party_size > 1 {
            IN_PARTY
        } else if accessibility == Some("OPEN") && max_size > 1 {
            OPEN_PARTY
        } else {
            SOLO
        }
    }
}

pub mod client_states {
    pub const AWAY: &str = "Away";
    pub const MENU: &str = "Menu";
    pub const CUSTOM_SETUP: &str = "Custom Setup";
    pub const QUEUE: &str = "Queue";
    pub const PREGAME: &str = "Agent Select";
    pub const INGAME: &str = "In Game";
    pub const RANGE: &str = "The Range";
}

pub mod pregame_states {
    pub const SELECTING: &str = "Selecting";
    pub const LOCKED: &str = "Locked";

    pub fn get_selection_state(state: &str) -> &'static str {
        if state.eq_ignore_ascii_case("locked") {
            LOCKED
        } else {
            SELECTING
        }
    }
}
