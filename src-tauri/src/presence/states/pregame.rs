use crate::config::AppSettings;
use crate::content::{get_queue_name, pregame_states, ContentData};
use crate::discord::{agent_asset, mode_asset, DiscordActivity};
use crate::presence::{build_party_state, current_timestamp};
use crate::riot::{PregameMatch, PregamePlayerInfo, PresenceData};

pub fn build_pregame_presence(
    presence: &PresenceData,
    pregame_match: &PregameMatch,
    player_info: Option<&PregamePlayerInfo>,
    content: &ContentData,
    settings: &AppSettings,
) -> DiscordActivity {
    let party_state = build_party_state(presence);
    let queue_id = presence.queue_id.as_deref().unwrap_or("unrated");
    let queue_name = get_queue_name(queue_id);

    let (agent_asset_key, agent_name, selection_state) = if let Some(player) = player_info {
        if !player.character_id.is_empty() {
            let (asset, name) = if let Some(agent) = content.get_agent(&player.character_id) {
                (agent_asset(&agent.display_name), agent.display_name.clone())
            } else {
                ("game_icon".to_string(), "Unknown Agent".to_string())
            };
            let state = pregame_states::get_selection_state(&player.character_selection_state);
            (asset, name, state)
        } else {
            (
                "game_icon".to_string(),
                "Selecting...".to_string(),
                pregame_states::SELECTING,
            )
        }
    } else {
        (
            "game_icon".to_string(),
            "Selecting...".to_string(),
            pregame_states::SELECTING,
        )
    };

    let large_text = format!("{} - {}", selection_state, agent_name);

    let mut activity = DiscordActivity::new()
        .state(party_state)
        .details(format!("Agent Select - {}", queue_name))
        .large_image(&agent_asset_key, Some(large_text))
        .small_image(mode_asset(queue_id), Some(queue_name.to_string()));

    if pregame_match.phase_time_remaining_ns > 0 {
        let remaining_seconds = pregame_match.phase_time_remaining_ns / 1_000_000_000;
        let end_time = current_timestamp() + remaining_seconds;
        activity = activity.end_timestamp(end_time);
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
