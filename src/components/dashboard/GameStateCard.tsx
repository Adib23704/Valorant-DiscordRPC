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
        <CardHeader>
          <CardTitle>Game State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Gamepad2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Waiting for game...</p>
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Game State</CardTitle>
          <Badge
            variant={getStateBadgeVariant(gameState.sessionState)}
            className="px-2 py-0.5 text-[10px]"
          >
            {gameState.sessionState}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {gameState.queueId && (
          <div className="flex items-center gap-2.5">
            <Swords className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Queue:</span>{" "}
              <span className="font-medium">{gameState.queueId}</span>
            </span>
          </div>
        )}

        {gameState.mapName && (
          <div className="flex items-center gap-2.5">
            <MapIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Map:</span>{" "}
              <span className="font-medium">{gameState.mapName}</span>
            </span>
          </div>
        )}

        {gameState.partySize !== undefined && gameState.maxPartySize !== undefined && (
          <div className="flex items-center gap-2.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Party:</span>{" "}
              <span className="font-medium">
                {gameState.partySize}/{gameState.maxPartySize}
              </span>
            </span>
          </div>
        )}

        {gameState.score && (
          <div className="flex items-center gap-2.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
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
