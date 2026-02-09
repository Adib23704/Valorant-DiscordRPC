import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatElapsedTime } from "@/lib/utils";
import type { DiscordActivity } from "@/types";

interface PresencePreviewProps {
  activity: DiscordActivity | null;
  isConnected: boolean;
}

export function PresencePreview({ activity, isConnected }: PresencePreviewProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    if (!activity?.startTimestamp) {
      setElapsedTime("");
      return;
    }

    const startTime = activity.startTimestamp;
    const updateTime = () => {
      setElapsedTime(formatElapsedTime(startTime));
    };

    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [activity?.startTimestamp]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Discord Preview</CardTitle>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" : "bg-gray-500"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-[#232428] p-3">
          <div className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-md bg-[#36393f]">
                {activity?.largeImage ? (
                  <img
                    src={`https://cdn.discordapp.com/app-assets/1354173612487213268/${activity.largeImage}.png`}
                    alt={activity.largeText ?? "Large image"}
                    className="h-full w-full rounded-md object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-lg text-gray-500">?</span>
                )}
              </div>
              {activity?.smallImage && (
                <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 overflow-hidden rounded-full border-2 border-[#232428] bg-[#36393f]">
                  <img
                    src={`https://cdn.discordapp.com/app-assets/1354173612487213268/${activity.smallImage}.png`}
                    alt={activity.smallText ?? "Small image"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
              <p className="text-xs font-semibold text-white">Valorant</p>
              {activity?.details && (
                <p className="truncate text-[11px] leading-tight text-gray-300">
                  {activity.details}
                </p>
              )}
              {activity?.state && (
                <p className="truncate text-[11px] leading-tight text-gray-300">{activity.state}</p>
              )}
              {elapsedTime && <p className="text-[10px] text-gray-400">{elapsedTime}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
