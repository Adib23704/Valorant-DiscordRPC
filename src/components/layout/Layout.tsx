import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar, type TabType } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isRunning: boolean;
}

export function Layout({ children, activeTab, onTabChange, isRunning }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Header isRunning={isRunning} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
