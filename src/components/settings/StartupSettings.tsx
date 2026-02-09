import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { StartupSettings as StartupSettingsType } from "@/types";

interface StartupSettingsProps {
  settings: StartupSettingsType;
  onChange: (settings: Partial<StartupSettingsType>) => void;
}

export function StartupSettings({ settings, onChange }: StartupSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup & Behavior</CardTitle>
        <CardDescription>App startup and window behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="minimize-tray" className="text-xs">
            Minimize to Tray
          </Label>
          <Switch
            id="minimize-tray"
            checked={settings.minimizeToTray}
            onCheckedChange={(checked) => {
              onChange({ minimizeToTray: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="start-minimized" className="text-xs">
            Start Minimized
          </Label>
          <Switch
            id="start-minimized"
            checked={settings.startMinimized}
            onCheckedChange={(checked) => {
              onChange({ startMinimized: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-start" className="text-xs">
            Launch on Startup
          </Label>
          <Switch
            id="auto-start"
            checked={settings.autoStart}
            onCheckedChange={(checked) => {
              onChange({ autoStart: checked });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
