import { Clock, Gamepad2, Map as MapIcon, Swords, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GameState } from "@/types/events";

interface GameStateCardProps {
  gameState: GameState | null;
}

export function GameStateCard({ gameState }: GameStateCardProps) {
  if (!gameState) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Game State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Gamepad2 className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Waiting for game data...</p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Start Valorant to see your game state
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStateBadgeVariant = (state: string) => {
    switch (state) {
      case "Ingame":
        return "success";
      case "Pregame":
        return "warning";
      case "Menus":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Game State</CardTitle>
          <Badge variant={getStateBadgeVariant(gameState.sessionState)}>
            {gameState.sessionState}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameState.queueId && (
          <div className="flex items-center gap-3">
            <Swords className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Queue:</span>{" "}
              <span className="font-medium">{gameState.queueId}</span>
            </span>
          </div>
        )}

        {gameState.mapName && (
          <div className="flex items-center gap-3">
            <MapIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Map:</span>{" "}
              <span className="font-medium">{gameState.mapName}</span>
            </span>
          </div>
        )}

        {gameState.partySize !== undefined && gameState.maxPartySize !== undefined && (
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Party:</span>{" "}
              <span className="font-medium">
                {gameState.partySize} / {gameState.maxPartySize}
              </span>
            </span>
          </div>
        )}

        {gameState.score && (
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Score:</span>{" "}
              <span className="font-medium text-green-500">{gameState.score.ally}</span>
              <span className="text-muted-foreground"> - </span>
              <span className="font-medium text-red-500">{gameState.score.enemy}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
