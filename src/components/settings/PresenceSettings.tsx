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
        <CardDescription>Configure what information appears in your Discord status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-rank-lobby">Show Rank in Competitive Lobby</Label>
              <p className="text-xs text-muted-foreground">
                Display your competitive rank while in queue
              </p>
            </div>
            <Switch
              id="show-rank-lobby"
              checked={settings.showRankInCompLobby}
              onCheckedChange={(checked) => {
                onChange({ showRankInCompLobby: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-rank-range">Show Rank in Range</Label>
              <p className="text-xs text-muted-foreground">
                Display your rank while in the practice range
              </p>
            </div>
            <Switch
              id="show-rank-range"
              checked={settings.showRankInRange}
              onCheckedChange={(checked) => {
                onChange({ showRankInRange: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-elapsed">Show Elapsed Time</Label>
              <p className="text-xs text-muted-foreground">
                Show how long you've been in your current state
              </p>
            </div>
            <Switch
              id="show-elapsed"
              checked={settings.showElapsedTime}
              onCheckedChange={(checked) => {
                onChange({ showElapsedTime: checked });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-party">Show Party Size</Label>
              <p className="text-xs text-muted-foreground">Display your party size in Discord</p>
            </div>
            <Switch
              id="show-party"
              checked={settings.showPartySize}
              onCheckedChange={(checked) => {
                onChange({ showPartySize: checked });
              }}
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="large-image">Large Image</Label>
              <Select
                value={settings.largeImagePref}
                onValueChange={(value: ImagePreference) => {
                  onChange({ largeImagePref: value });
                }}
              >
                <SelectTrigger id="large-image">
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="map">Map</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="rank">Rank</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">The main image shown in your presence</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="small-image">Small Image</Label>
              <Select
                value={settings.smallImagePref}
                onValueChange={(value: ImagePreference) => {
                  onChange({ smallImagePref: value });
                }}
              >
                <SelectTrigger id="small-image">
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="rank">Rank</SelectItem>
                  <SelectItem value="map">Map</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">The small overlay image</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
