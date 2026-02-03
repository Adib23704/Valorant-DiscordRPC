import { create } from "zustand";
import type { ConnectionStatus, ProcessStatus } from "@/types";

interface ConnectionState {
  processStatus: ProcessStatus | null;
  connectionStatus: ConnectionStatus | null;

  setProcessStatus: (status: ProcessStatus | null) => void;
  setConnectionStatus: (status: ConnectionStatus | null) => void;
  reset: () => void;
}

const initialState = {
  processStatus: null,
  connectionStatus: null,
};

export const useConnectionStore = create<ConnectionState>((set) => ({
  ...initialState,

  setProcessStatus: (status) => {
    set({ processStatus: status });
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  reset: () => {
    set(initialState);
  },
}));
