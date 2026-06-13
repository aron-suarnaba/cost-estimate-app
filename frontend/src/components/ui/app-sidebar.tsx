import * as React from "react";
import { 
  Calculator, 
  LayoutDashboard, 
  Database, 
  LogOut, 
  ShieldCheck, 
  PanelLeft, 
  ChevronRight 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar, // 🟢 Import the state hook from Shadcn
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
}

export function AppSidebar({ currentView, setView, onLogout }: AppSidebarProps) {
  // 🟢 Access Shadcn's layout state and its built-in toggle functionality
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="text-slate-200 transition-all duration-300">
      
      {/* Sidebar Header */}
      <SidebarHeader className={`p-4 flex flex-row items-center justify-between ${isCollapsed ? "justify-center px-2" : ""}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          
          {/* Hide application text cleanly when minimized */}
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-200">
              <span className="font-mono font-bold text-xs tracking-wider text-slate-200 whitespace-nowrap">
                COST.ENGINE
              </span>
              <span className="text-[10px] text-slate-500 font-mono">v2026.1.0</span>
            </div>
          )}
        </div>

        {/* 🟢 Inline Toggle trigger button (Hidden if collapsed, or styled to fit edge) */}
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="p-3 px-2">
        <SidebarMenu className="space-y-1">
          
          {/* Dashboard View Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={currentView === "dashboard"}
              onClick={() => setView("dashboard")}
              className={`w-full flex items-center rounded-lg text-sm transition-all ${
                isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
              } ${
                currentView === "dashboard"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
              title="System Overview"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-200">System Overview</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Items Database Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={currentView === "items"}
              onClick={() => setView("items")}
              className={`w-full flex items-center rounded-lg text-sm transition-all ${
                isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
              } ${
                currentView === "items"
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
              title="Estimation Ledger"
            >
              <Database className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-200">Estimation Ledger</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer Account Actions */}
      <SidebarFooter className={`p-3 border-t border-slate-800 space-y-2 ${isCollapsed ? "px-2 items-center" : ""}`}>
        
        {/* Session Status indicator */}
        {isCollapsed ? (
          <div className="p-1.5 bg-slate-950/40 rounded-md border border-slate-800 text-emerald-500" title="Secure Session Active">
            <ShieldCheck className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 font-mono bg-slate-950/40 rounded-md border border-slate-800/60 w-full animate-in fade-in duration-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Session: SECURE_NODE</span>
          </div>
        )}
        
        {/* Logout Action Button */}
        <button
          onClick={onLogout}
          className={`flex items-center rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all ${
            isCollapsed ? "w-10 h-10 justify-center p-2" : "w-full gap-3 px-3 py-2"
          }`}
          title="Exit Gateway"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="animate-in fade-in duration-200">Exit Gateway</span>}
        </button>

        {/* 🟢 Expand toggle button appears down here ONLY when sidebar is minimized */}
        {isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="w-8 h-8 mt-2 flex items-center justify-center hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}