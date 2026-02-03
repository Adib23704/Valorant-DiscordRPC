import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AppSettings,
  PresenceSettings as PresenceSettingsType,
  StartupSettings as StartupSettingsType,
} from "@/types";
import { GeneralSettings } from "./GeneralSettings";
import { PresenceSettings } from "./PresenceSettings";
import { StartupSettings } from "./StartupSettings";

interface SettingsPanelProps {
  settings: AppSettings;
  onPresenceChange: (settings: Partial<PresenceSettingsType>) => void;
  onStartupChange: (settings: Partial<StartupSettingsType>) => void;
  onGeneralChange: (settings: Partial<AppSettings>) => void;
  onSave: () => void;
  onReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
}

export function SettingsPanel({
  settings,
  onPresenceChange,
  onStartupChange,
  onGeneralChange,
  onSave,
  onReset,
  hasChanges,
  isSaving,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">Customize your Discord presence behavior</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset} disabled={isSaving}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <PresenceSettings settings={settings.presence} onChange={onPresenceChange} />
        <StartupSettings settings={settings.startup} onChange={onStartupChange} />
        <GeneralSettings refreshInterval={settings.refreshIntervalMs} onChange={onGeneralChange} />
      </div>
    </div>
  );
}
