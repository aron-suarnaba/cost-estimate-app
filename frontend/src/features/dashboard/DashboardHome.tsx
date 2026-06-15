// src/features/dashboard/DashboardHome.tsx
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Cpu, Layers } from "lucide-react";

export const DashboardHome: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Control Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time computational processing parameters and estimation telemetry metrics.
        </p>
      </div>

      {/* Matrix Cards Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Margin Delta Target
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900">+24.8%</div>
            <p className="text-xs text-slate-400 mt-0.5">Optimized against current ledger</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Database Core Status
            </CardTitle>
            <Cpu className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono text-emerald-600">ONLINE</div>
            <p className="text-xs text-slate-400 mt-0.5">MS-SQL Pool Connection active</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Material Variants
            </CardTitle>
            <Layers className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900">1,412</div>
            <p className="text-xs text-slate-400 mt-0.5">Active paperboard matrix types</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Security Protocol
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">AES-JWT</div>
            <p className="text-xs text-slate-400 mt-0.5">Cryptographic interceptor active</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Log Block */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-slate-900">Operational Notices</CardTitle>
          <CardDescription className="text-xs text-slate-400">Recent environmental logs within this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 font-mono text-xs text-slate-600 space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-emerald-600 font-semibold">[OK] SYSTEM INITIALIZED</span>
              <span className="text-slate-400">Just Now</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-600">[INFO] Injected JWT validation signature into API client request context header successfully.</span>
              <span className="text-slate-400">2 min ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">[INFO] Synced inventory cache models safely with upstream C# microservice.</span>
              <span className="text-slate-400">12 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};