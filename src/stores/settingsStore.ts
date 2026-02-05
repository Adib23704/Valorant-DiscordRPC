import { create } from "zustand";
import type { AppSettings, PresenceSettings, StartupSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/types/settings";

interface SettingsState {
  settings: AppSettings;
  originalSettings: AppSettings;
  isSaving: boolean;
  isLoading: boolean;

  setSettings: (settings: AppSettings) => void;
  updatePresenceSettings: (updates: Partial<PresenceSettings>) => void;
  updateStartupSettings: (updates: Partial<StartupSettings>) => void;
  setOriginalSettings: (settings: AppSettings) => void;
  setIsSaving: (saving: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  hasChanges: () => boolean;
  reset: () => void;
}

const initialState = {
  settings: DEFAULT_SETTINGS,
  originalSettings: DEFAULT_SETTINGS,
  isSaving: false,
  isLoading: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initialState,

  setSettings: (settings) => {
    set({ settings });
  },

  updatePresenceSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        presence: { ...state.settings.presence, ...updates },
      },
    }));
  },

  updateStartupSettings: (updates) => {
    set((state) => ({
      settings: {
        ...state.settings,
        startup: { ...state.settings.startup, ...updates },
      },
    }));
  },

  setOriginalSettings: (settings) => {
    set({ originalSettings: settings });
  },

  setIsSaving: (saving) => {
    set({ isSaving: saving });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  hasChanges: () => {
    const { settings, originalSettings } = get();
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  },

  reset: () => {
    set(initialState);
  },
}));
