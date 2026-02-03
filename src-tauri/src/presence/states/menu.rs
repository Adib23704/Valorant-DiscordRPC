use crate::config::AppSettings;
use crate::content::{get_queue_name, ContentData};
use crate::discord::{icons, rank_asset, DiscordActivity};
use crate::presence::build_party_state;
use crate::riot::PresenceData;

pub fn build_menu_presence(
  presence: &PresenceData,
  content: &ContentData,
  settings: &AppSettings,
) -> DiscordActivity {
  let party_state = build_party_state(presence);
  let queue_name = presence
    .queue_id
    .as_deref()
    .map(get_queue_name)
    .unwrap_or("Menu");

  let level_text = presence
    .account_level
    .map(|l| format!("Level {}", l))
    .unwrap_or_else(|| "Valorant".to_string());

  let mut activity = DiscordActivity::new()
    .state(party_state)
    .details(format!("Menu - {}", queue_name))
    .large_image(icons::GAME_ICON, Some(level_text));

  if settings.presence.show_party_size && presence.party_size > 0 {
    activity = activity.party(
      &presence.party_id,
      presence.party_size,
      presence.max_party_size,
    );
  }

  if settings.presence.show_rank_in_comp_lobby
    && presence.queue_id.as_deref() == Some("competitive")
  {
    if let Some(tier) = presence.competitive_tier {
      let rank_name = content.get_rank_name(tier);
      activity = activity.small_image(rank_asset(tier), Some(rank_name));
    }
  }

  activity
}

pub fn build_away_presence(presence: &PresenceData) -> DiscordActivity {
  let party_state = build_party_state(presence);

  DiscordActivity::new()
    .state(party_state)
    .details("Away")
    .large_image(icons::GAME_ICON_YELLOW, Some("Away".to_string()))
    .small_image(icons::AWAY_ICON, Some("Idle".to_string()))
}

pub fn build_custom_setup_presence(
  presence: &PresenceData,
  _content: &ContentData,
) -> DiscordActivity {
  let party_state = build_party_state(presence);

  let mut activity = DiscordActivity::new()
    .state(party_state)
    .details("Custom Game Setup")
    .large_image(icons::GAME_ICON, Some("Custom Game".to_string()));

  if presence.party_size > 0 {
    activity = activity.party(
      &presence.party_id,
      presence.party_size,
      presence.max_party_size,
    );
  }

  activity
}
