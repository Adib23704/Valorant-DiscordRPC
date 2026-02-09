import { Gamepad2, Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PresenceControlProps {
  isRunning: boolean;
  isLoading: boolean;
  valorantRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onLaunchValorant: () => Promise<void>;
}

export function PresenceControl({
  isRunning,
  isLoading,
  valorantRunning,
  onStart,
  onStop,
  onLaunchValorant,
}: PresenceControlProps) {
  const [launching, setLaunching] = useState(false);
  const rpcDisabled = !valorantRunning || isLoading;

  useEffect(() => {
    if (valorantRunning && launching) {
      setLaunching(false);
    }
  }, [valorantRunning, launching]);

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await onLaunchValorant();
    } catch {
      setLaunching(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        className="flex-1 bg-valorant-red hover:bg-valorant-red/80"
        onClick={() => void handleLaunch()}
        disabled={valorantRunning || launching}
      >
        {launching ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Gamepad2 className="mr-2 h-4 w-4" />
        )}
        {valorantRunning
          ? "VALORANT Running"
          : launching
            ? "Launching VALORANT..."
            : "Launch VALORANT"}
      </Button>
      <div className="flex-1" title={!valorantRunning ? "Launch VALORANT to start RPC" : undefined}>
        {isRunning ? (
          <Button variant="secondary" className="w-full" onClick={onStop} disabled={rpcDisabled}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Pause className="mr-2 h-4 w-4" />
            )}
            Pause Discord RPC
          </Button>
        ) : (
          <Button variant="secondary" className="w-full" onClick={onStart} disabled={rpcDisabled}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Start Discord RPC
          </Button>
        )}
      </div>
    </div>
  );
}
