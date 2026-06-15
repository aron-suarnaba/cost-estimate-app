// src/components/layout/app-sidebar.tsx
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Tags, 
  Coins,
  LogOut,
  PanelLeftClose, 
  PanelLeftOpen,
  Cpu // 🟢 App branding icon representing the "System"
} from "lucide-react";

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void; 
  isCollapsed: boolean;             
  onToggleCollapse: () => void;     
}

export function AppSidebar({ 
  currentView, 
  onViewChange, 
  onLogout,
  isCollapsed,
  onToggleCollapse 
}: AppSidebarProps) {
  
  const NavItem = ({ icon: Icon, label, id, onClickAction }: { 
    icon: any; 
    label: string; 
    id?: string; 
    onClickAction?: () => void;
  }) => {
    const isActive = id ? currentView === id : false;
    
    return (
      <button
        onClick={onClickAction ? onClickAction : () => id && onViewChange(id)}
        title={isCollapsed ? label : undefined} 
        className={`w-full flex items-center rounded-lg text-sm transition-all relative group ${
          isCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
        } ${
          isActive 
            ? "bg-white text-slate-900 shadow-sm border border-slate-100 font-medium" 
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 font-normal"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </div>
      </button>
    );
  };

  return (
    <aside 
      className={`flex-shrink-0 flex flex-col h-full bg-[#F5F5F7] border-r border-slate-200/60 z-20 transition-all duration-300 ${
        isCollapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      {/* 🟢 TOP AREA: ChatGPT Style System Identity & Toggle Button */}
      <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm tracking-tight min-w-0">
            <Cpu className="h-4 w-4 text-purple-600 shrink-0 animate-pulse" />
            <span className="truncate">Estimate Engine</span>
          </div>
        )}

        {/* Toggle Button Swaps places contextually if collapsed */}
        <button 
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-purple-600" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* MID AREA: Navigation Links */}
      <div className={`flex-1 overflow-y-auto space-y-6 pb-4 ${isCollapsed ? "px-2" : "px-3"}`}>
        
        {/* SECTION 1: CORE OVERVIEWS */}
        <div>
          {!isCollapsed && (
            <h4 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px] select-none">
              Overview
            </h4>
          )}
          <div className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
            <NavItem icon={Coins} label="Paper Board Pricing" id="pricing" />
          </div>
        </div>

        {/* SECTION 2: SEPARATE DATA REGISTRIES */}
        <div>
          {!isCollapsed && (
            <h4 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider text-[10px] select-none">
              Ledger
            </h4>
          )}
          <div className="space-y-1">
            <NavItem icon={Package} label="Items" id="items" />
            <NavItem icon={Users} label="Vendors" id="vendors" />
            <NavItem icon={Tags} label="Product Types (PType)" id="ptype" />
          </div>
        </div>
      </div>

      {/* 🟢 BOTTOM AREA: ChatGPT Profile Panel Structure Wrapper */}
      <div className="p-3 border-t border-slate-200/60 flex flex-col gap-1 bg-[#F5F5F7]">
        <div className={`flex items-center justify-between rounded-lg p-2 ${isCollapsed ? "justify-center" : "hover:bg-slate-200/40"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300/40">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-slate-800 truncate">Felix User</span>
                <span className="text-[10px] text-slate-400 font-mono truncate">ID // 90412</span>
              </div>
            )}
          </div>
          
          {/* Action Log out Button inside expanded row item layout links */}
          {!isCollapsed && (
            <button 
              onClick={onLogout}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors ml-1"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Alternate icon block view trigger layout if collapsed */}
        {isCollapsed && (
          <button
            onClick={onLogout}
            title="Logout"
            className="w-full flex justify-center p-2.5 text-slate-400 hover:text-red-500 hover:bg-slate-200/50 rounded-lg transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
          </button>
        )}
      </div>
    </aside>
  );
}