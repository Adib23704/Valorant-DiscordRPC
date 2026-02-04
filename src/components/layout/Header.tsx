import { getCurrentWindow } from "@tauri-apps/api/window";
import { Activity, Minimize2, X } from "lucide-react";
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

  const handleClose = () => {
    const appWindow = getCurrentWindow();
    appWindow.close().catch((err) => {
      console.error("Failed to close window:", err);
    });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3" data-tauri-drag-region>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-valorant-red">
          <Activity className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div data-tauri-drag-region>
          <h1 className="text-sm font-semibold text-foreground">Valorant DiscordRPC</h1>
          <p className="text-xs text-muted-foreground">
            {isRunning ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleMinimize}
          aria-label="Minimize window"
        >
          <Minimize2 className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
          onClick={handleClose}
          aria-label="Close window"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
