import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import { GameStateCard } from "@/components/dashboard/GameStateCard";
import { PresenceControl } from "@/components/dashboard/PresenceControl";
import { PresencePreview } from "@/components/dashboard/PresencePreview";
import type {
  ProcessStatus,
  ConnectionStatus as ConnectionStatusType,
  DiscordActivity,
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
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Monitor your Discord Rich Presence status</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PresenceControl
            isRunning={isRunning}
            isLoading={isLoading}
            onStart={onStart}
            onStop={onStop}
          />
          <ConnectionStatus processStatus={processStatus} connectionStatus={connectionStatus} />
        </div>

        <div className="space-y-6">
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
