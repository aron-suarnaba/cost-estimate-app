// src/components/layout/WorkspaceLayout.tsx
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { PanelLeft, ShieldAlert, Cpu } from "lucide-react";

interface WorkspaceLayoutProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  handleLogout: () => void;
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  currentView,
  setCurrentView,
  handleLogout,
  children,
}) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* 1. Left Sidebar Navigation */}
      <AppSidebar
        currentView={currentView}
        setView={setCurrentView}
        onLogout={handleLogout}
      />

      {/* Main Panel Content Area Wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. Top Header with Sidebar Toggle Trigger */}
        <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Shadcn's Built-in Trigger Button */}
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              root // {currentView}
            </span>

            <div className="h-4 w-[1px] bg-slate-200" />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              Node: Localhost
            </span>
          </div>
        </header>

        {/* 3. Central Viewing Sandbox Canvas */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto pb-12">{children}</div>
        </main>

        {/* 4. Fixed System Workspace Footer */}
        <footer className="h-8 border-t border-slate-200 bg-white px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-semibold uppercase tracking-tight text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
              Status // Nominal
            </span>
            <span>Target Framework: ASP.NET Core API</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400/80">
            <ShieldAlert className="h-3 w-3 text-amber-500" />
            <span>Encrypted Ledger Context (TLS 1.3)</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
