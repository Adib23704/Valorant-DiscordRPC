import { Play, RefreshCw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PresenceControlProps {
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function PresenceControl({ isRunning, isLoading, onStart, onStop }: PresenceControlProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Presence Control</CardTitle>
        <CardDescription>
          {isRunning ? "Presence active" : "Start to show your status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRunning ? (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onStop}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Square className="mr-1.5 h-3.5 w-3.5" />
            )}
            Stop
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full bg-valorant-red hover:bg-valorant-red-dark"
            onClick={onStart}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="mr-1.5 h-3.5 w-3.5" />
            )}
            Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
