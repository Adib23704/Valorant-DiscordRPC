import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import { GameStateCard } from "@/components/dashboard/GameStateCard";
import { PresenceControl } from "@/components/dashboard/PresenceControl";
import { PresencePreview } from "@/components/dashboard/PresencePreview";
import type {
  ConnectionStatus as ConnectionStatusType,
  DiscordActivity,
  ProcessStatus,
} from "@/types";
import type { GameState } from "@/types/events";

interface DashboardProps {
  processStatus: ProcessStatus | null;
  connectionStatus: ConnectionStatusType | null;
  gameState: GameState | null;
  activity: DiscordActivity | null;
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onLaunchValorant: () => void;
}

export function Dashboard({
  processStatus,
  connectionStatus,
  gameState,
  activity,
  isRunning,
  isLoading,
  onStart,
  onStop,
  onLaunchValorant,
}: DashboardProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <PresenceControl
            isRunning={isRunning}
            isLoading={isLoading}
            valorantRunning={processStatus?.valorantRunning ?? false}
            onStart={onStart}
            onStop={onStop}
            onLaunchValorant={onLaunchValorant}
          />
          <ConnectionStatus processStatus={processStatus} connectionStatus={connectionStatus} />
        </div>

        <div className="space-y-3">
          <PresencePreview
            activity={activity}
            isConnected={connectionStatus?.discordConnected ?? false}
          />
          <GameStateCard gameState={gameState} />
        </div>
      </div>
    </div>
  );
}
