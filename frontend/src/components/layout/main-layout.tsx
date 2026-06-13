import { useState } from "react";
import { motion } from "framer-motion";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"; 
import {
  Menu,
  LayoutDashboard, // Added proper dashboard icon
  Package,
  CircleDollarSign,
  Calculator,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function MainLayout({
  children,
  onLogout,
  currentView,
  onViewChange,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="grid h-screen w-screen grid-rows-[60px_1fr_40px] grid-cols-[auto_1fr] overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="col-span-2 flex items-center justify-between border-b bg-white px-6 z-30">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-700" />
            <span className="font-semibold">PI | Cost Estimate System</span>
          </div>
        </div>

        {onLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </header>

      {/* Sidebar - Wrapped in motion.aside for animating layout shifts */}
      <motion.aside
        animate={{
          width: isSidebarOpen ? 260 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 1, 0.5, 1],
        }}
        className="overflow-hidden bg-slate-900 text-slate-200 z-20"
      >
        {/* Fixed-width wrapper prevents text wrapping layout breaking during animation */}
        <div className="w-[260px] p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 font-medium px-2 mb-2 block text-xs uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <nav className="flex flex-col gap-1">
                {/* 1. Dashboard Button (Fixed) */}
                <button
                  onClick={() => onViewChange("dashboard")}
                  className={`flex items-center gap-3 rounded-md p-2 text-left text-sm transition-colors ${
                    currentView === "dashboard"
                      ? "bg-slate-800 text-white font-medium"
                      : "hover:bg-slate-800/50 text-slate-400"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>

                {/* 2. Items Button */}
                <button
                  onClick={() => onViewChange("items")}
                  className={`flex items-center gap-3 rounded-md p-2 text-left text-sm transition-colors ${
                    currentView === "items"
                      ? "bg-slate-800 text-white font-medium"
                      : "hover:bg-slate-800/50 text-slate-400"
                  }`}
                >
                  <Package className="h-4 w-4" />
                  Items
                </button>

                {/* 3. Pricing Button */}
                <button
                  onClick={() => onViewChange("pricing")}
                  className={`flex items-center gap-3 rounded-md p-2 text-left text-sm transition-colors ${
                    currentView === "pricing"
                      ? "bg-slate-800 text-white font-medium"
                      : "hover:bg-slate-800/50 text-slate-400"
                  }`}
                >
                  <CircleDollarSign className="h-4 w-4" />
                  Pricing
                </button>
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </motion.aside>

      {/* Content View Workspace */}
      <main className="overflow-y-auto p-6 z-10">{children}</main>

      {/* System Footer Wrapper */}
      <footer className="col-span-2 border-t bg-white px-6 flex items-center text-[11px] text-slate-400 z-30">
        &copy; {new Date().getFullYear()} Printwell Inc. All rights reserved.
      </footer>
    </div>
  );
}