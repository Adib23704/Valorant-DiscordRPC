import { useEffect } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { usePresenceStore } from "@/stores/presenceStore";
import { useConnectionStore } from "@/stores/connectionStore";
import {
  EVENT_NAMES,
  type GameStatePayload,
  type PresenceUpdatePayload,
  type ConnectionPayload,
  type ErrorPayload,
} from "@/types/events";

export function useTauriEvents() {
  const { setActivity, setGameState, setError } = usePresenceStore();
  const { setConnectionStatus } = useConnectionStore();

  useEffect(() => {
    const unlistenFns: UnlistenFn[] = [];

    const setupListeners = async () => {
      const unlistenGameState = await listen<GameStatePayload>(
        EVENT_NAMES.GAME_STATE_CHANGED,
        (event) => {
          const payload = event.payload;
          setGameState({
            sessionState: payload.sessionState,
            queueId: payload.queueId,
            mapName: payload.mapName,
            agentName: payload.agentName,
            partySize: payload.partySize?.[0],
            maxPartySize: payload.partySize?.[1],
            score: payload.score ? { ally: payload.score[0], enemy: payload.score[1] } : undefined,
          });
        }
      );
      unlistenFns.push(unlistenGameState);

      const unlistenPresence = await listen<PresenceUpdatePayload>(
        EVENT_NAMES.PRESENCE_UPDATED,
        (event) => {
          setActivity(event.payload.activity);
        }
      );
      unlistenFns.push(unlistenPresence);

      const unlistenConnection = await listen<ConnectionPayload>(
        EVENT_NAMES.CONNECTION_CHANGED,
        (event) => {
          setConnectionStatus(event.payload);
        }
      );
      unlistenFns.push(unlistenConnection);

      const unlistenError = await listen<ErrorPayload>(EVENT_NAMES.ERROR, (event) => {
        setError(event.payload.message);
        console.error(`[${event.payload.code}] ${event.payload.message}`);
      });
      unlistenFns.push(unlistenError);
    };

    void setupListeners();

    return () => {
      unlistenFns.forEach((unlisten) => {
        unlisten();
      });
    };
  }, [setActivity, setGameState, setError, setConnectionStatus]);
}
