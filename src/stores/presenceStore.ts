import { create } from "zustand";
import type { DiscordActivity } from "@/types";
import type { GameState } from "@/types/events";

interface PresenceState {
  isRunning: boolean;
  isLoading: boolean;
  activity: DiscordActivity | null;
  gameState: GameState | null;
  error: string | null;

  setIsRunning: (running: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setActivity: (activity: DiscordActivity | null) => void;
  setGameState: (gameState: GameState | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  isRunning: false,
  isLoading: false,
  activity: null,
  gameState: null,
  error: null,
};

export const usePresenceStore = create<PresenceState>((set) => ({
  ...initialState,

  setIsRunning: (running) => {
    set({ isRunning: running });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  setActivity: (activity) => {
    set({ activity });
  },

  setGameState: (gameState) => {
    set({ gameState });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));
