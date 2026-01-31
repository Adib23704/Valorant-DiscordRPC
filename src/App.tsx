import { useCallback, useEffect, useState } from "react";
import { Layout, type TabType } from "@/components/layout";
import { SettingsPanel } from "@/components/settings";
import { Dashboard } from "@/pages/Dashboard";
import { About } from "@/pages/About";
import {
  checkProcesses,
  getConnectionStatus,
  getSettings,
  saveSettings,
  resetSettings,
  startPresence,
  stopPresence,
  isPresenceRunning,
  getGameState,
} from "@/lib/tauri";
import type {
  ProcessStatus,
  ConnectionStatus,
  AppSettings,
  DiscordActivity,
  PresenceSettings,
  StartupSettings,
} from "@/types";
import type { GameState } from "@/types/events";
import { DEFAULT_SETTINGS } from "@/types/settings";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const [processStatus, setProcessStatus] = useState<ProcessStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activity, setActivity] = useState<DiscordActivity | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const hasSettingsChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [processes, connection, running, loadedSettings] = await Promise.all([
          checkProcesses(),
          getConnectionStatus(),
          isPresenceRunning(),
          getSettings(),
        ]);

        setProcessStatus(processes);
        setConnectionStatus(connection);
        setIsRunning(running);
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };

    void loadInitialData();
  }, []);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const [processes, connection] = await Promise.all([
          checkProcesses(),
          getConnectionStatus(),
        ]);

        setProcessStatus(processes);
        setConnectionStatus(connection);

        if (isRunning) {
          try {
            const state = await getGameState();
            if (state) {
              setGameState({
                sessionState: state.sessionState,
                queueId: state.queueId,
                mapName: state.mapName,
                agentName: state.agentName,
                partySize: state.partySize?.[0],
                maxPartySize: state.partySize?.[1],
                score: state.score ? { ally: state.score[0], enemy: state.score[1] } : undefined,
              });
            }
          } catch {
            // Game state might not be available
          }
        }
      } catch (err) {
        console.error("Failed to poll status:", err);
      }
    };

    void pollStatus();
    const interval = setInterval(() => {
      void pollStatus();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartPresence = useCallback(async () => {
    setIsLoading(true);
    try {
      await startPresence();
      setIsRunning(true);
    } catch (err) {
      console.error("Failed to start presence:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStopPresence = useCallback(async () => {
    setIsLoading(true);
    try {
      await stopPresence();
      setIsRunning(false);
      setGameState(null);
      setActivity(null);
    } catch (err) {
      console.error("Failed to stop presence:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePresenceSettingsChange = useCallback((changes: Partial<PresenceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      presence: { ...prev.presence, ...changes },
    }));
  }, []);

  const handleStartupSettingsChange = useCallback((changes: Partial<StartupSettings>) => {
    setSettings((prev) => ({
      ...prev,
      startup: { ...prev.startup, ...changes },
    }));
  }, []);

  const handleGeneralSettingsChange = useCallback((changes: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...changes }));
  }, []);

  const handleSaveSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      setOriginalSettings(settings);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const handleResetSettings = useCallback(async () => {
    try {
      const defaultSettings = await resetSettings();
      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
    } catch (err) {
      console.error("Failed to reset settings:", err);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            processStatus={processStatus}
            connectionStatus={connectionStatus}
            gameState={gameState}
            activity={activity}
            isRunning={isRunning}
            isLoading={isLoading}
            onStart={handleStartPresence}
            onStop={handleStopPresence}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            settings={settings}
            onPresenceChange={handlePresenceSettingsChange}
            onStartupChange={handleStartupSettingsChange}
            onGeneralChange={handleGeneralSettingsChange}
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
            hasChanges={hasSettingsChanges}
            isSaving={isSaving}
          />
        );
      case "about":
        return <About />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} isRunning={isRunning}>
      {renderContent()}
    </Layout>
  );
}

export default App;
