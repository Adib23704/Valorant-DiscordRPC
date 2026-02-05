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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Discord Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded bg-[#232428] p-2.5">
          <div className="flex gap-2.5">
            <div className="relative h-12 w-12 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded bg-[#36393f]">
                {activity?.largeImage ? (
                  <img
                    src={`https://cdn.discordapp.com/app-assets/1354173612487213268/${activity.largeImage}.png`}
                    alt={activity.largeText ?? "Large image"}
                    className="h-full w-full rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-lg text-gray-500">?</span>
                )}
              </div>
              {activity?.smallImage && (
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 overflow-hidden rounded-full border-[1.5px] border-[#232428] bg-[#36393f]">
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

            <div className="flex min-w-0 flex-1 flex-col justify-center">
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

          <div className="mt-2 flex items-center justify-between border-t border-[#36393f] pt-2">
            <span className="text-[10px] text-gray-400">
              {isConnected ? "Live" : "Disconnected"}
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected ? "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" : "bg-gray-500"
                }`}
              />
              <span className="text-[10px] text-gray-400">{isConnected ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
