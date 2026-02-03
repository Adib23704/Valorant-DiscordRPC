import { useState } from "react";
import { Layout, type TabType } from "@/components/layout";
import { SettingsPanel } from "@/components/settings";
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "@/pages/Dashboard";
import { About } from "@/pages/About";
import { usePresence, useSettings, useTauriEvents } from "@/hooks";

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
    updateGeneralSettings,
    save: handleSaveSettings,
    reset: handleResetSettings,
  } = useSettings();

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
            onPresenceChange={updatePresenceSettings}
            onStartupChange={updateStartupSettings}
            onGeneralChange={updateGeneralSettings}
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
