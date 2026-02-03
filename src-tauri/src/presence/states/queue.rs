use crate::config::AppSettings;
use crate::content::{get_queue_name, ContentData};
use crate::discord::{icons, mode_asset, rank_asset, DiscordActivity};
use crate::presence::{build_party_state, parse_valorant_timestamp};
use crate::riot::PresenceData;

pub fn build_queue_presence(
  presence: &PresenceData,
  content: &ContentData,
  settings: &AppSettings,
) -> DiscordActivity {
  let party_state = build_party_state(presence);
  let queue_id = presence.queue_id.as_deref().unwrap_or("");
  let queue_name = get_queue_name(queue_id);

  let level_text = presence
    .account_level
    .map(|l| format!("Level {}", l))
    .unwrap_or_else(|| "Valorant".to_string());

  let mut activity = DiscordActivity::new()
    .state(party_state)
    .details(format!("In Queue - {}", queue_name))
    .large_image(icons::GAME_ICON_WHITE, Some(level_text))
    .small_image(mode_asset(queue_id), Some(queue_name.to_string()));

  if settings.presence.show_elapsed_time {
    if let Some(ref queue_time) = presence.queue_entry_time {
      if let Some(timestamp) = parse_valorant_timestamp(queue_time) {
        activity = activity.start_timestamp(timestamp);
      }
    }
  }

  if settings.presence.show_party_size && presence.party_size > 0 {
    activity = activity.party(
      &presence.party_id,
      presence.party_size,
      presence.max_party_size,
    );
  }

  if settings.presence.show_rank_in_comp_lobby && queue_id == "competitive" {
    if let Some(tier) = presence.competitive_tier {
      let rank_name = content.get_rank_name(tier);
      activity = activity.small_image(rank_asset(tier), Some(rank_name));
    }
  }

  activity
}
