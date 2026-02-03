use crate::config::AppSettings;
use crate::content::ContentData;
use crate::discord::{icons, map_asset, rank_asset, DiscordActivity};
use crate::presence::build_party_state;
use crate::riot::PresenceData;

pub fn build_range_presence(
  presence: &PresenceData,
  content: &ContentData,
  settings: &AppSettings,
  start_timestamp: Option<i64>,
) -> DiscordActivity {
  let party_state = build_party_state(presence);

  let level_text = presence
    .account_level
    .map(|l| format!("Level {}", l))
    .unwrap_or_else(|| "The Range".to_string());

  let mut activity = DiscordActivity::new()
    .state(party_state)
    .details("The Range")
    .large_image(map_asset("range"), Some(level_text));

  if settings.presence.show_rank_in_range {
    if let Some(tier) = presence.competitive_tier {
      let rank_name = content.get_rank_name(tier);
      activity = activity.small_image(rank_asset(tier), Some(rank_name));
    }
  } else {
    activity = activity.small_image(icons::GAME_ICON, Some("Practice".to_string()));
  }

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
