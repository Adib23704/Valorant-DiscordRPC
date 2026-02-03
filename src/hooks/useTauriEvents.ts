import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";
import { toast } from "@/hooks/useToast";
import { useConnectionStore } from "@/stores/connectionStore";
import { usePresenceStore } from "@/stores/presenceStore";
import {
  type ConnectionPayload,
  type ErrorPayload,
  EVENT_NAMES,
  type GameStatePayload,
  type PresenceUpdatePayload,
} from "@/types/events";

export function useTauriEvents() {
  const { setActivity, setGameState, setError } = usePresenceStore();
  const { setConnectionStatus } = useConnectionStore();
  const unlistenFnsRef = useRef<UnlistenFn[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const setupListeners = async () => {
      try {
        const unlistenGameState = await listen<GameStatePayload>(
          EVENT_NAMES.GAME_STATE_CHANGED,
          (event) => {
            if (!isMountedRef.current) return;
            const payload = event.payload;
            setGameState({
              sessionState: payload.sessionState,
              queueId: payload.queueId,
              mapName: payload.mapName,
              agentName: payload.agentName,
              partySize: payload.partySize?.[0],
              maxPartySize: payload.partySize?.[1],
              score: payload.score
                ? { ally: payload.score[0], enemy: payload.score[1] }
                : undefined,
            });
          }
        );
        if (!isMountedRef.current) {
          unlistenGameState();
          return;
        }
        unlistenFnsRef.current.push(unlistenGameState);

        const unlistenPresence = await listen<PresenceUpdatePayload>(
          EVENT_NAMES.PRESENCE_UPDATED,
          (event) => {
            if (!isMountedRef.current) return;
            setActivity(event.payload.activity);
          }
        );
        if (!isMountedRef.current) {
          unlistenPresence();
          return;
        }
        unlistenFnsRef.current.push(unlistenPresence);

        const unlistenConnection = await listen<ConnectionPayload>(
          EVENT_NAMES.CONNECTION_CHANGED,
          (event) => {
            if (!isMountedRef.current) return;
            setConnectionStatus(event.payload);
          }
        );
        if (!isMountedRef.current) {
          unlistenConnection();
          return;
        }
        unlistenFnsRef.current.push(unlistenConnection);

        const unlistenError = await listen<ErrorPayload>(EVENT_NAMES.ERROR, (event) => {
          if (!isMountedRef.current) return;
          setError(event.payload.message);
          toast({
            variant: "destructive",
            title: "Error",
            description: event.payload.message,
          });
          console.error(`[${event.payload.code}] ${event.payload.message}`);
        });
        if (!isMountedRef.current) {
          unlistenError();
          return;
        }
        unlistenFnsRef.current.push(unlistenError);
      } catch (err) {
        console.error("Failed to setup Tauri event listeners:", err);
      }
    };

    void setupListeners();

    return () => {
      isMountedRef.current = false;
      for (const unlisten of unlistenFnsRef.current) {
        unlisten();
      }
      unlistenFnsRef.current = [];
    };
  }, [setActivity, setGameState, setError, setConnectionStatus]);
}
