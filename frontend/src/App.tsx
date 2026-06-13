// App.tsx
import { useState, useEffect } from "react";
import { LoginPage } from "@/features/auth/LoginPage";
import { ItemsPage } from "@/features/items/ItemsPage";
import { DashboardHome } from "@/features/dashboard/DashboardHome";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentView("dashboard"); 
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-xs text-slate-500">
        INITIALIZING SECURITY SECURE SUITE...
      </div>
    );
  }

  // GATEKEEPER CHECK: Force login flow
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // WORKSPACE VIEW ROUTER: Wrapped nicely inside Header and Footer layers
  return (
    <SidebarProvider>
      <WorkspaceLayout
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      >
        {currentView === "dashboard" ? <DashboardHome /> : <ItemsPage />}
      </WorkspaceLayout>
    </SidebarProvider>
  );
}