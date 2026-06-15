// src/components/layout/main-layout.tsx
import { useState, useEffect } from "react"; 
import { AppSidebar } from "./app-sidebar";  
import { AppHeader } from "./app-header";    
import { AppFooter } from "./app-footer";    

interface MainLayoutProps {
  children: React.ReactNode; 
  currentView: string;
  onViewChange: (view: string) => void;
  handleLogout: () => void;
  isLoading?: boolean;
}

export function MainLayout({
  children,
  currentView,
  onViewChange,
  handleLogout,
  isLoading = false,
}: MainLayoutProps) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading]);

  return (
    <div className="h-screen w-screen bg-[#F5F5F7] flex p-0 sm:p-2 md:p-4 overflow-hidden">
      <div className="flex w-full h-full bg-white border border-0 rounded-lg overflow-hidden">
        
        <AppSidebar 
          currentView={currentView} 
          onViewChange={onViewChange} 
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Right Content Area with proper divider styling applied */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FDFDFD]">
          <AppHeader title={currentView} />

          <main className="flex-1 overflow-auto p-8 relative">
            <div className="h-full max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>

          <AppFooter />
        </div>
      </div>
    </div>
  );
}