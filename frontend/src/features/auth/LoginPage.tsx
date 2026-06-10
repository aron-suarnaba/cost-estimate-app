import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calculator, Shield, Database, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, LoginFormValues } from "./login.schema";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    // Simulate API Auth Request payload passing to your ASP.NET Core backend
    console.log("Authenticating user payload:", data);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    alert("Authentication request sent to C# backend controller successfully.");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50 text-slate-900 selection:bg-slate-200">
      
      {/* LEFT COLUMN: ENTERPRISE SYSTEM INFO */}
      <div className="hidden lg:flex lg:col-span-7 p-12 flex-col justify-between bg-slate-900 text-slate-100 border-r border-slate-800 relative overflow-hidden">
        {/* Subtle grid accent overlay to maintain a plain, utilitarian vibe */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
            <Calculator className="h-6 w-6 text-slate-200" />
          </div>
          <span className="font-mono font-semibold tracking-wider text-sm text-slate-400">
            COST.ESTIMATE // PRODUCTION
          </span>
        </div>

        <div className="relative z-10 max-w-xl my-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-bold tracking-tight text-white font-sans"
          >
            Precision Cost Estimation Engine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-slate-400 leading-relaxed text-base"
          >
            Calculate margins, evaluate vendor matrix variants, and manage structural paperboard inventory models instantly via an enterprise ledger infrastructure.
          </motion.p>

          {/* System status dashboard highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800"
          >
            <div className="flex items-start gap-2.5">
              <Database className="h-4 w-4 text-slate-500 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-slate-300 font-mono">MS-SQL Database</h4>
                <p className="text-xs text-slate-500">Connected to local node</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-slate-500 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-slate-300 font-mono">Active Sessions</h4>
                <p className="text-xs text-slate-500">Restricted internal network</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-slate-600 font-mono">
          v2026.1.0 // ENTERPRISE MULTI-TENANT CONTEXT
        </div>
      </div>

      {/* RIGHT COLUMN: CLEAN AUTHENTICATION PANEL */}
      <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile Heading view wrapper */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Calculator className="h-5 w-5 text-slate-700" />
            <span className="font-mono font-bold text-xs tracking-wider text-slate-600">
              COST.ESTIMATE // APPS
            </span>
          </div>

          <Card className="border-slate-200 shadow-md bg-white rounded-xl">
            <CardHeader className="space-y-1.5 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                System Access
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                Enter your identity credentials assigned by system operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Username Input Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 font-mono">
                    System Username
                  </label>
                  <Input
                    type="text"
                    {...register("username")}
                    placeholder="e.g., p.torres"
                    disabled={isSubmitting}
                    className="border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 bg-slate-50/50"
                  />
                  {errors.username && (
                    <p className="text-xs font-medium text-rose-600 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password Input Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 font-mono">
                      Security Password
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      disabled={isSubmitting}
                      className="border-slate-200 pr-10 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 bg-slate-50/50"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-rose-600 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Action Submission Trigger */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all flex items-center justify-center gap-2 h-10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Gateway</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-6 px-4 leading-relaxed">
            Authorized operation context only. All transactions, calculation cycles, and active parameter mutations are monitored and logged natively under network auditing regulations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}