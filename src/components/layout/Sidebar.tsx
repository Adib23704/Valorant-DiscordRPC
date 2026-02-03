import { Home, Info, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "dashboard" | "settings" | "about";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "about", label: "About", icon: Info },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex w-16 flex-col items-center border-r border-border bg-card py-4">
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => {
              onTabChange(id);
            }}
            className={cn(
              "flex h-12 w-12 flex-col items-center justify-center rounded-lg transition-colors",
              activeTab === id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={label}
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1 text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
