import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square, RefreshCw } from "lucide-react";

interface PresenceControlProps {
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function PresenceControl({ isRunning, isLoading, onStart, onStop }: PresenceControlProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Presence Control</CardTitle>
        <CardDescription>
          {isRunning
            ? "Your Discord presence is being updated"
            : "Click start to begin showing your Valorant status"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          {isRunning ? (
            <Button variant="destructive" className="flex-1" onClick={onStop} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Square className="mr-2 h-4 w-4" />
              )}
              Stop Presence
            </Button>
          ) : (
            <Button
              className="flex-1 bg-valorant-red hover:bg-valorant-red-dark"
              onClick={onStart}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Start Presence
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
