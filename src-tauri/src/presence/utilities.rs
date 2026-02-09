use crate::content::{party_states, ContentData};
use crate::discord::{agent_asset, map_asset, rank_asset, DiscordActivity};
use crate::riot::PresenceData;

pub fn build_party_state(presence: &PresenceData) -> &'static str {
  party_states::get_party_state(
    presence.party_size,
    presence.max_party_size,
    presence.party_accessibility.as_deref(),
  )
}

pub fn build_agent_info(character_id: &str, content: &ContentData) -> (String, String) {
  if let Some(agent) = content.get_agent(character_id) {
    (agent_asset(&agent.display_name), agent.display_name.clone())
  } else {
    ("game_icon".to_string(), "Unknown Agent".to_string())
  }
}

pub fn build_map_info(map_path: &str, content: &ContentData) -> (String, String) {
  if let Some(map) = content.get_map_by_path(map_path) {
    (map_asset(&map.display_name), map.display_name.clone())
  } else {
    let name = map_path
      .split('/')
      .next_back()
      .unwrap_or("Unknown")
      .to_string();
    (map_asset(&name), name)
  }
}

pub fn build_rank_info(
  tier: u32,
  rr: i32,
  leaderboard: u32,
  content: &ContentData,
) -> (String, String) {
  let rank_name = content.get_rank_name(tier);
  let display = if leaderboard > 0 {
    format!("{} - {} RR (#{} )", rank_name, rr, leaderboard)
  } else {
    format!("{} - {} RR", rank_name, rr)
  };
  (rank_asset(tier), display)
}

pub fn parse_valorant_timestamp(timestamp: &str) -> Option<i64> {
  if let Ok(dt) = chrono::DateTime::parse_from_rfc3339(timestamp) {
    return Some(dt.timestamp());
  }

  let parts: Vec<&str> = timestamp.split('-').collect();
  if parts.len() == 2 {
    let date_parts: Vec<&str> = parts[0].split('.').collect();
    let time_parts: Vec<&str> = parts[1].split('.').collect();

    if date_parts.len() == 3 && time_parts.len() == 3 {
      let year: i32 = date_parts[0].parse().ok()?;
      let month: u32 = date_parts[1].parse().ok()?;
      let day: u32 = date_parts[2].parse().ok()?;
      let hour: u32 = time_parts[0].parse().ok()?;
      let minute: u32 = time_parts[1].parse().ok()?;
      let second: u32 = time_parts[2].parse().ok()?;

      let dt =
        chrono::NaiveDate::from_ymd_opt(year, month, day)?.and_hms_opt(hour, minute, second)?;
      let dt_utc = chrono::DateTime::<chrono::Utc>::from_naive_utc_and_offset(dt, chrono::Utc);
      return Some(dt_utc.timestamp());
    }
  }

  None
}

pub fn current_timestamp() -> i64 {
  chrono::Utc::now().timestamp()
}

pub fn build_menu_presence(presence: &PresenceData, content: &ContentData) -> DiscordActivity {
  let party_state = build_party_state(presence);
  let queue_name = presence
    .queue_id
    .as_deref()
    .map(crate::content::get_queue_name)
    .unwrap_or("Menu");

  let mut activity = DiscordActivity::new()
    .state(party_state)
    .details(format!("Menu - {}", queue_name))
    .large_image("game_icon", Some("VALORANT".to_string()));

  if presence.party_size > 0 {
    activity = activity.party(
      &presence.party_id,
      presence.party_size,
      presence.max_party_size,
    );
  }

  if presence.queue_id.as_deref() == Some("competitive") {
    if let Some(tier) = presence.competitive_tier {
      let rank_name = content.get_rank_name(tier);
      activity = activity.small_image(rank_asset(tier), Some(rank_name));
    }
  }

  activity
}
