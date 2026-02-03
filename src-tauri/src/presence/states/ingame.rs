use crate::config::{AppSettings, ImagePreference};
use crate::content::{get_queue_name, ContentData};
use crate::discord::{agent_asset, map_asset, mode_asset, rank_asset, DiscordActivity};
use crate::presence::build_party_state;
use crate::riot::{CoregameMatch, CoregamePlayerInfo, PresenceData};

pub fn build_ingame_presence(
    presence: &PresenceData,
    coregame_match: &CoregameMatch,
    player_info: Option<&CoregamePlayerInfo>,
    content: &ContentData,
    settings: &AppSettings,
    start_timestamp: Option<i64>,
) -> DiscordActivity {
    let party_state = build_party_state(presence);
    let queue_id = presence.queue_id.as_deref().unwrap_or("unrated");
    let queue_name = get_queue_name(queue_id);

    let score_str = match (
        presence.party_owner_match_score_ally_team,
        presence.party_owner_match_score_enemy_team,
    ) {
        (Some(ally), Some(enemy)) => format!("{} - {}", ally, enemy),
        _ => String::new(),
    };

    let details = if score_str.is_empty() {
        queue_name.to_string()
    } else {
        format!("{} // {}", queue_name, score_str)
    };

    let (map_asset_key, map_name) =
        if let Some(map) = content.get_map_by_path(&coregame_match.map_id) {
            (map_asset(&map.display_name), map.display_name.clone())
        } else {
            let name = coregame_match
                .map_id
                .split('/')
                .next_back()
                .unwrap_or("Unknown")
                .to_string();
            (map_asset(&name), name)
        };

    let (agent_asset_key, agent_name) = if let Some(player) = player_info {
        if let Some(agent) = content.get_agent(&player.character_id) {
            (agent_asset(&agent.display_name), agent.display_name.clone())
        } else {
            ("game_icon".to_string(), "Unknown Agent".to_string())
        }
    } else {
        ("game_icon".to_string(), "Unknown Agent".to_string())
    };

    let (rank_asset_key, rank_name) = if let Some(tier) = presence.competitive_tier {
        (rank_asset(tier), content.get_rank_name(tier))
    } else {
        ("rank_0".to_string(), "Unranked".to_string())
    };

    let (large_key, large_text) = match settings.presence.large_image_pref {
        ImagePreference::Map => (map_asset_key.clone(), map_name.clone()),
        ImagePreference::Agent => (agent_asset_key.clone(), agent_name.clone()),
        ImagePreference::Rank => (rank_asset_key.clone(), rank_name.clone()),
    };

    let (small_key, small_text) = match settings.presence.small_image_pref {
        ImagePreference::Map => (map_asset_key, map_name),
        ImagePreference::Agent => (agent_asset_key, agent_name),
        ImagePreference::Rank => (rank_asset_key, rank_name),
    };

    let mut activity = DiscordActivity::new()
        .state(party_state)
        .details(details)
        .large_image(large_key, Some(large_text))
        .small_image(small_key, Some(small_text));

    if settings.presence.show_elapsed_time {
        if let Some(start) = start_timestamp {
            activity = activity.start_timestamp(start);
        }
    }

    if settings.presence.show_party_size && presence.party_size > 0 {
        activity = activity.party(
            &presence.party_id,
            presence.party_size,
            presence.max_party_size,
        );
    }

    activity
}

pub fn build_ingame_away_presence(
    presence: &PresenceData,
    coregame_match: &CoregameMatch,
    content: &ContentData,
) -> DiscordActivity {
    let queue_name = presence
        .queue_id
        .as_deref()
        .map(get_queue_name)
        .unwrap_or("In Game");

    let map_name = content
        .get_map_by_path(&coregame_match.map_id)
        .map(|m| m.display_name.clone())
        .unwrap_or_else(|| "Unknown Map".to_string());

    DiscordActivity::new()
        .state("Away")
        .details(format!("{} - {}", queue_name, map_name))
        .large_image("game_icon_yellow", Some("Away".to_string()))
        .small_image(
            mode_asset(presence.queue_id.as_deref().unwrap_or("")),
            Some(queue_name.to_string()),
        )
}
