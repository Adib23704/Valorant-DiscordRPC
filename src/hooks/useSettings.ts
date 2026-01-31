import { useCallback, useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { getSettings, saveSettings, resetSettings } from "@/lib/tauri";

export function useSettings() {
  const {
    settings,
    originalSettings,
    isSaving,
    isLoading,
    setSettings,
    setOriginalSettings,
    updatePresenceSettings,
    updateStartupSettings,
    updateGeneralSettings,
    setIsSaving,
    setIsLoading,
    hasChanges,
  } = useSettingsStore();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const loadedSettings = await getSettings();
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, [setSettings, setOriginalSettings, setIsLoading]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      setOriginalSettings(settings);
    } catch (err) {
      console.error("Failed to save settings:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [settings, setOriginalSettings, setIsSaving]);

  const handleReset = useCallback(async () => {
    try {
      const defaultSettings = await resetSettings();
      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
    } catch (err) {
      console.error("Failed to reset settings:", err);
      throw err;
    }
  }, [setSettings, setOriginalSettings]);

  return {
    settings,
    originalSettings,
    isSaving,
    isLoading,
    hasChanges: hasChanges(),
    updatePresenceSettings,
    updateStartupSettings,
    updateGeneralSettings,
    save: handleSave,
    reset: handleReset,
  };
}
