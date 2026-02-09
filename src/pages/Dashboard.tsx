import { GameStateCard } from "@/components/dashboard/GameStateCard";
import { PresenceControl } from "@/components/dashboard/PresenceControl";
import { PresencePreview } from "@/components/dashboard/PresencePreview";
import type { DiscordActivity, ProcessStatus } from "@/types";
import type { GameState } from "@/types/events";

interface DashboardProps {
  processStatus: ProcessStatus | null;
  discordConnected: boolean;
  gameState: GameState | null;
  activity: DiscordActivity | null;
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onLaunchValorant: () => Promise<void>;
}

export function Dashboard({
  processStatus,
  discordConnected,
  gameState,
  activity,
  isRunning,
  isLoading,
  onStart,
  onStop,
  onLaunchValorant,
}: DashboardProps) {
  return (
    <div className="space-y-4">
      <PresenceControl
        isRunning={isRunning}
        isLoading={isLoading}
        valorantRunning={processStatus?.valorantRunning ?? false}
        onStart={onStart}
        onStop={onStop}
        onLaunchValorant={onLaunchValorant}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <PresencePreview activity={activity} isConnected={discordConnected} />
        <GameStateCard gameState={gameState} />
      </div>
    </div>
  );
}
