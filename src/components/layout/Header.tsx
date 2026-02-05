import { getCurrentWindow } from "@tauri-apps/api/window";
import { Activity, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isRunning: boolean;
}

export function Header({ isRunning }: HeaderProps) {
  const handleMinimize = () => {
    const appWindow = getCurrentWindow();
    appWindow.minimize().catch((err) => {
      console.error("Failed to minimize window:", err);
    });
  };

  const handleHideToTray = () => {
    const appWindow = getCurrentWindow();
    appWindow.hide().catch((err) => {
      console.error("Failed to hide window:", err);
    });
  };

  return (
    <header className="flex h-11 items-center justify-between border-b border-border bg-card px-3">
      <div className="flex items-center gap-2" data-tauri-drag-region>
        <div className="flex h-6 w-6 items-center justify-center rounded bg-valorant-red">
          <Activity className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2" data-tauri-drag-region>
          <h1 className="text-sm font-semibold text-foreground">Valorant DiscordRPC</h1>
          <span
            className={`h-1.5 w-1.5 rounded-full ${isRunning ? "bg-green-500" : "bg-muted-foreground"}`}
          />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleMinimize}
          aria-label="Minimize window"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-muted"
          onClick={handleHideToTray}
          aria-label="Minimize to tray"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
