import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ImagePreference, PresenceSettings as PresenceSettingsType } from "@/types";

interface PresenceSettingsProps {
  settings: PresenceSettingsType;
  onChange: (settings: Partial<PresenceSettingsType>) => void;
}

export function PresenceSettings({ settings, onChange }: PresenceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presence Display</CardTitle>
        <CardDescription>What appears in your Discord status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-rank-lobby" className="text-xs">
              Show Rank in Comp Lobby
            </Label>
            <Switch
              id="show-rank-lobby"
              checked={settings.showRankInCompLobby}
              onCheckedChange={(checked) => {
                onChange({ showRankInCompLobby: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-rank-range" className="text-xs">
              Show Rank in Range
            </Label>
            <Switch
              id="show-rank-range"
              checked={settings.showRankInRange}
              onCheckedChange={(checked) => {
                onChange({ showRankInRange: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-elapsed" className="text-xs">
              Show Elapsed Time
            </Label>
            <Switch
              id="show-elapsed"
              checked={settings.showElapsedTime}
              onCheckedChange={(checked) => {
                onChange({ showElapsedTime: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-party" className="text-xs">
              Show Party Size
            </Label>
            <Switch
              id="show-party"
              checked={settings.showPartySize}
              onCheckedChange={(checked) => {
                onChange({ showPartySize: checked });
              }}
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="large-image" className="text-xs">
                Large Image
              </Label>
              <Select
                value={settings.largeImagePref}
                onValueChange={(value: ImagePreference) => {
                  onChange({ largeImagePref: value });
                }}
              >
                <SelectTrigger id="large-image" className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="map">Map</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="rank">Rank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="small-image" className="text-xs">
                Small Image
              </Label>
              <Select
                value={settings.smallImagePref}
                onValueChange={(value: ImagePreference) => {
                  onChange({ smallImagePref: value });
                }}
              >
                <SelectTrigger id="small-image" className="h-8 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="rank">Rank</SelectItem>
                  <SelectItem value="map">Map</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
