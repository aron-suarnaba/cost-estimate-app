// src/App.tsx
import { useState, useEffect } from "react";
import { LoginPage } from "@/features/auth/LoginPage";
import { ItemsPage } from "@/features/items/ItemsPage";
import { VendorsPage } from "@/features/vendors/VendorsPage";
import { PtypesPage } from "@/features/ptype/PtypesPage";
import { PricingPage } from "@/features/pricing/PricingPage";
import { DashboardHome } from "@/features/dashboard/DashboardHome";
import { MainLayout } from "./components/layout/main-layout";
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

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardHome />;
      case "items":
        return <ItemsPage />;
      case "vendors":
        return <VendorsPage />;
      case "ptype":
        return <PtypesPage />;
      case "pricing":
        return <PricingPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <SidebarProvider>
      <MainLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        handleLogout={handleLogout} 
      >
        {renderView()}
      </MainLayout>
    </SidebarProvider>
  );
}