export interface DiscordActivity {
  state?: string;
  details?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  largeImage?: string;
  largeText?: string;
  smallImage?: string;
  smallText?: string;
  partyId?: string;
  partySize?: [number, number];
}

export type SessionLoopState = "Menus" | "Pregame" | "Ingame";

export interface ProcessStatus {
  valorantRunning: boolean;
  riotClientRunning: boolean;
}

export interface ConnectionStatus {
  discordConnected: boolean;
  riotApiConnected: boolean;
}
