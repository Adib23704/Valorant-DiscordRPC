import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        <CardDescription>Configure how the application starts and behaves</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="minimize-tray">Minimize to Tray</Label>
            <p className="text-xs text-muted-foreground">
              Keep running in system tray when window is closed
            </p>
          </div>
          <Switch
            id="minimize-tray"
            checked={settings.minimizeToTray}
            onCheckedChange={(checked) => {
              onChange({ minimizeToTray: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="start-minimized">Start Minimized</Label>
            <p className="text-xs text-muted-foreground">Start the app minimized to system tray</p>
          </div>
          <Switch
            id="start-minimized"
            checked={settings.startMinimized}
            onCheckedChange={(checked) => {
              onChange({ startMinimized: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-start">Launch on Startup</Label>
            <p className="text-xs text-muted-foreground">Automatically start when Windows boots</p>
          </div>
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
