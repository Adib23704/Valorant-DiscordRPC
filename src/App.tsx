import { useState } from "react";
import { Layout, type TabType } from "@/components/layout";
import { SettingsPanel } from "@/components/settings";
import { Toaster } from "@/components/ui/toaster";
import { usePresence, useSettings, useTauriEvents } from "@/hooks";
import { launchValorant } from "@/lib/tauri";
import { About } from "@/pages/About";
import { Dashboard } from "@/pages/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  useTauriEvents();

  const {
    isRunning,
    isLoading,
    activity,
    gameState,
    processStatus,
    connectionStatus,
    start: handleStartPresence,
    stop: handleStopPresence,
  } = usePresence();

  const {
    settings,
    isSaving,
    hasChanges,
    updatePresenceSettings,
    updateStartupSettings,
    save: handleSaveSettings,
    reset: handleResetSettings,
  } = useSettings();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            processStatus={processStatus}
            discordConnected={connectionStatus?.discordConnected ?? false}
            gameState={gameState}
            activity={activity}
            isRunning={isRunning}
            isLoading={isLoading}
            onStart={handleStartPresence}
            onStop={handleStopPresence}
            onLaunchValorant={launchValorant}
          />
        );
      case "settings":
        return (
          <SettingsPanel
            settings={settings}
            onPresenceChange={updatePresenceSettings}
            onStartupChange={updateStartupSettings}
            onSave={() => {
              void handleSaveSettings();
            }}
            onReset={() => {
              void handleResetSettings();
            }}
            hasChanges={hasChanges}
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
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} isRunning={isRunning}>
        {renderContent()}
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
