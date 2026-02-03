import { useCallback, useEffect, useRef } from "react";
import {
  checkProcesses,
  getConnectionStatus,
  getGameState,
  isPresenceRunning,
  startPresence,
  stopPresence,
} from "@/lib/tauri";
import { useConnectionStore } from "@/stores/connectionStore";
import { usePresenceStore } from "@/stores/presenceStore";
import { useSettingsStore } from "@/stores/settingsStore";

export function usePresence() {
  const {
    isRunning,
    isLoading,
    activity,
    gameState,
    error,
    setIsRunning,
    setIsLoading,
    setGameState,
    setError,
  } = usePresenceStore();

  const { processStatus, connectionStatus, setProcessStatus, setConnectionStatus } =
    useConnectionStore();

  const { settings } = useSettingsStore();
  const refreshInterval = settings.refreshIntervalMs;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const [running, processes, connection] = await Promise.all([
          isPresenceRunning(),
          checkProcesses(),
          getConnectionStatus(),
        ]);

        setIsRunning(running);
        setProcessStatus(processes);
        setConnectionStatus(connection);
      } catch (err) {
        console.error("Failed to check initial state:", err);
      }
    };

    void checkInitialState();
  }, [setIsRunning, setProcessStatus, setConnectionStatus]);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const [processes, connection] = await Promise.all([
          checkProcesses(),
          getConnectionStatus(),
        ]);

        setProcessStatus(processes);
        setConnectionStatus(connection);

        if (isRunning) {
          try {
            const state = await getGameState();
            if (state) {
              setGameState({
                sessionState: state.sessionState,
                queueId: state.queueId,
                mapName: state.mapName,
                agentName: state.agentName,
                partySize: state.partySize?.[0],
                maxPartySize: state.partySize?.[1],
                score: state.score ? { ally: state.score[0], enemy: state.score[1] } : undefined,
              });
            }
          } catch {}
        }
      } catch (err) {
        console.error("Failed to poll status:", err);
      }
    };

    void pollStatus();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      void pollStatus();
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, refreshInterval, setProcessStatus, setConnectionStatus, setGameState]);

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await startPresence();
      setIsRunning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start presence";
      setError(message);
      console.error("Failed to start presence:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setIsRunning, setError]);

  const handleStop = useCallback(async () => {
    setIsLoading(true);
    try {
      await stopPresence();
      setIsRunning(false);
      setGameState(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to stop presence";
      setError(message);
      console.error("Failed to stop presence:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setIsRunning, setGameState, setError]);

  return {
    isRunning,
    isLoading,
    activity,
    gameState,
    error,
    processStatus,
    connectionStatus,
    start: handleStart,
    stop: handleStop,
  };
}
