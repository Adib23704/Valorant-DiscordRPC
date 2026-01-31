import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiscordActivity } from "@/types";
import { formatElapsedTime } from "@/lib/utils";
import { useEffect, useState } from "react";

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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Discord Presence Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-[#232428] p-4">
          <div className="flex gap-4">
            <div className="relative h-16 w-16 flex-shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#36393f]">
                {activity?.largeImage ? (
                  <img
                    src={`https://cdn.discordapp.com/app-assets/1354173612487213268/${activity.largeImage}.png`}
                    alt={activity.largeText ?? "Large image"}
                    className="h-full w-full rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-2xl text-gray-500">?</span>
                )}
              </div>
              {activity?.smallImage && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 overflow-hidden rounded-full border-2 border-[#232428] bg-[#36393f]">
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
              <p className="text-sm font-semibold text-white">Valorant</p>
              {activity?.details && (
                <p className="truncate text-sm text-gray-300">{activity.details}</p>
              )}
              {activity?.state && (
                <p className="truncate text-sm text-gray-300">{activity.state}</p>
              )}
              {elapsedTime && <p className="text-xs text-gray-400">{elapsedTime} elapsed</p>}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#36393f] pt-3">
            <span className="text-xs text-gray-400">
              {isConnected ? "Live Preview" : "Preview (Disconnected)"}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" : "bg-gray-500"
                }`}
              />
              <span className="text-xs text-gray-400">{isConnected ? "Connected" : "Offline"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
