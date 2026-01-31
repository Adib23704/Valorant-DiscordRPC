import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { AppSettings } from "@/types";

interface GeneralSettingsProps {
  refreshInterval: number;
  onChange: (settings: Partial<AppSettings>) => void;
}

export function GeneralSettings({ refreshInterval, onChange }: GeneralSettingsProps) {
  const handleIntervalChange = (value: number[]) => {
    onChange({ refreshIntervalMs: value[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>General application settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="refresh-interval">Refresh Interval</Label>
              <span className="text-sm text-muted-foreground">{refreshInterval / 1000}s</span>
            </div>
            <Slider
              id="refresh-interval"
              min={1000}
              max={10000}
              step={500}
              value={[refreshInterval]}
              onValueChange={handleIntervalChange}
            />
            <p className="text-xs text-muted-foreground">
              How often to check for game state updates (1-10 seconds)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
