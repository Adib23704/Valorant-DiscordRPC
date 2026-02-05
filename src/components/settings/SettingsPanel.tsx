import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AppSettings,
  PresenceSettings as PresenceSettingsType,
  StartupSettings as StartupSettingsType,
} from "@/types";
import { PresenceSettings } from "./PresenceSettings";
import { StartupSettings } from "./StartupSettings";

interface SettingsPanelProps {
  settings: AppSettings;
  onPresenceChange: (settings: Partial<PresenceSettingsType>) => void;
  onStartupChange: (settings: Partial<StartupSettingsType>) => void;
  onSave: () => void;
  onReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
}

export function SettingsPanel({
  settings,
  onPresenceChange,
  onStartupChange,
  onSave,
  onReset,
  hasChanges,
  isSaving,
}: SettingsPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={onReset} disabled={isSaving}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={onSave} disabled={!hasChanges || isSaving}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        <PresenceSettings settings={settings.presence} onChange={onPresenceChange} />
        <StartupSettings settings={settings.startup} onChange={onStartupChange} />
      </div>
    </div>
  );
}
