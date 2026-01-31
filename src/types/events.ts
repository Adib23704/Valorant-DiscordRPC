import type { DiscordActivity, SessionLoopState } from "./presence";

export const EVENT_NAMES = {
  GAME_STATE_CHANGED: "game-state-changed",
  PRESENCE_UPDATED: "presence-updated",
  CONNECTION_CHANGED: "connection-changed",
  ERROR: "app-error",
  CONTENT_LOADED: "content-loaded",
} as const;

export interface GameStatePayload {
  valorantRunning: boolean;
  riotClientRunning: boolean;
  sessionState: SessionLoopState;
  queueId?: string;
  mapName?: string;
  agentName?: string;
  score?: [number, number];
  isIdle: boolean;
  partySize?: [number, number];
}

export interface GameState {
  sessionState: string;
  queueId?: string;
  mapName?: string;
  agentName?: string;
  partySize?: number;
  maxPartySize?: number;
  score?: {
    ally: number;
    enemy: number;
  };
}

export interface PresenceUpdatePayload {
  activity: DiscordActivity;
  timestamp: number;
}

export interface ConnectionPayload {
  discordConnected: boolean;
  riotApiConnected: boolean;
}

export interface ErrorPayload {
  code: string;
  message: string;
}
