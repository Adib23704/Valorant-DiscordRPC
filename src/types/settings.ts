export type ImagePreference = "map" | "agent" | "rank";

export interface PresenceSettings {
  showRankInCompLobby: boolean;
  showRankInRange: boolean;
  largeImagePref: ImagePreference;
  smallImagePref: ImagePreference;
  showElapsedTime: boolean;
  showPartySize: boolean;
}

export interface StartupSettings {
  minimizeToTray: boolean;
  startMinimized: boolean;
  autoStart: boolean;
}

export interface AppSettings {
  version: string;
  region: string;
  locale: string;
  presence: PresenceSettings;
  startup: StartupSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  version: "1.0.0",
  region: "",
  locale: "en-US",
  presence: {
    showRankInCompLobby: true,
    showRankInRange: false,
    largeImagePref: "map",
    smallImagePref: "agent",
    showElapsedTime: true,
    showPartySize: true,
  },
  startup: {
    minimizeToTray: true,
    startMinimized: false,
    autoStart: false,
  },
};
