import React from "react";
import { Layout } from "lucide-react";

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 shrink-0 bg-white border-b border-slate-100 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900 capitalize">{title}</h1>
        
        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
        
        <button className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900">
          <Layout className="h-4 w-4 text-purple-600" />
          <span>All Views</span>
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Add any global actions here, like "New Item" or Notifications */}
      </div>
    </header>
  );
}