import { Gamepad2, Pause, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresenceControlProps {
  isRunning: boolean;
  isLoading: boolean;
  valorantRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onLaunchValorant: () => void;
}

export function PresenceControl({
  isRunning,
  isLoading,
  valorantRunning,
  onStart,
  onStop,
  onLaunchValorant,
}: PresenceControlProps) {
  return (
    <div className="flex gap-2">
      <Button
        className="flex-1 bg-valorant-red hover:bg-valorant-red/80"
        onClick={onLaunchValorant}
        disabled={valorantRunning}
      >
        <Gamepad2 className="mr-2 h-4 w-4" />
        {valorantRunning ? "Valorant Running" : "Launch Valorant"}
      </Button>
      {isRunning ? (
        <Button variant="secondary" className="flex-1" onClick={onStop} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Pause className="mr-2 h-4 w-4" />
          )}
          Pause Discord RPC
        </Button>
      ) : (
        <Button variant="secondary" className="flex-1" onClick={onStart} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Resume Discord RPC
        </Button>
      )}
    </div>
  );
}
