import { Monitor, MonitorOff, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConnectionStatus as ConnectionStatusType, ProcessStatus } from "@/types";
import { StatusIndicator } from "./StatusIndicator";

interface ConnectionStatusProps {
  processStatus: ProcessStatus | null;
  connectionStatus: ConnectionStatusType | null;
}

export function ConnectionStatus({ processStatus, connectionStatus }: ConnectionStatusProps) {
  const getProcessIndicator = (
    running: boolean,
    label: string,
    Icon: React.ElementType,
    OffIcon: React.ElementType
  ) => (
    <div className="flex items-center justify-between rounded bg-muted/50 px-2 py-1.5">
      <div className="flex items-center gap-2">
        {running ? (
          <Icon className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <OffIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <StatusIndicator status={running ? "online" : "offline"} label={running ? "On" : "Off"} />
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {getProcessIndicator(
          processStatus?.valorantRunning ?? false,
          "Valorant",
          Monitor,
          MonitorOff
        )}
        {getProcessIndicator(
          processStatus?.riotClientRunning ?? false,
          "Riot Client",
          Monitor,
          MonitorOff
        )}
        <div className="my-1 h-px bg-border" />
        {getProcessIndicator(
          connectionStatus?.discordConnected ?? false,
          "Discord RPC",
          Wifi,
          WifiOff
        )}
        {getProcessIndicator(
          connectionStatus?.riotApiConnected ?? false,
          "Riot API",
          Wifi,
          WifiOff
        )}
      </CardContent>
    </Card>
  );
}
