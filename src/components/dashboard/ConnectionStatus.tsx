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
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-3">
        {running ? (
          <Icon className="h-5 w-5 text-green-500" />
        ) : (
          <OffIcon className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <StatusIndicator
        status={running ? "online" : "offline"}
        label={running ? "Running" : "Not Running"}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
        <div className="my-2 h-px bg-border" />
        {getProcessIndicator(connectionStatus?.discordConnected ?? false, "Discord", Wifi, WifiOff)}
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
