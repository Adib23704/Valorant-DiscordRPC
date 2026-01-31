import { invoke } from "@tauri-apps/api/core";
import type { AppSettings, ConnectionStatus, GameStatePayload, ProcessStatus } from "@/types";

export async function startPresence(): Promise<void> {
  return invoke("start_presence");
}

export async function stopPresence(): Promise<void> {
  return invoke("stop_presence");
}

export async function isPresenceRunning(): Promise<boolean> {
  return invoke("is_presence_running");
}

export async function getSettings(): Promise<AppSettings> {
  return invoke("get_settings");
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  return invoke("save_settings", { settings });
}

export async function resetSettings(): Promise<AppSettings> {
  return invoke("reset_settings");
}

export async function checkProcesses(): Promise<ProcessStatus> {
  return invoke("check_processes");
}

export async function getGameState(): Promise<GameStatePayload | null> {
  return invoke("get_game_state");
}

export async function getConnectionStatus(): Promise<ConnectionStatus> {
  return invoke("get_connection_status");
}
