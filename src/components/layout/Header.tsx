import { getCurrentWindow } from "@tauri-apps/api/window";
import { Activity, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isRunning: boolean;
}

export function Header({ isRunning }: HeaderProps) {
  const handleMinimize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-valorant-red">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Valo Discord RPC</h1>
          <p className="text-xs text-muted-foreground">
            {isRunning ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleMinimize}>
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
