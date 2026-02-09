import { Gamepad2, Pause, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Control</CardTitle>
        <CardDescription>
          {valorantRunning ? "Valorant is running" : "Launch Valorant to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 bg-valorant-red hover:bg-valorant-red/80"
          onClick={onLaunchValorant}
          disabled={valorantRunning}
        >
          <Gamepad2 className="mr-1.5 h-4 w-4" />
          {valorantRunning ? "Valorant Running" : "Launch Valorant"}
        </Button>
        {isRunning ? (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onStop}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Pause className="mr-1.5 h-4 w-4" />
            )}
            Pause Discord RPC
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onStart}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-4 w-4" />
            )}
            Resume Discord RPC
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
