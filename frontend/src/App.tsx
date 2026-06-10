import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import api from "@/lib/api";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate,
  Variants 
} from "framer-motion";
import { Calculator, Shield, Database, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

// 1. Import Shadcn UI Form Essentials & Primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// 2. Import Your Custom Login Schema
import { loginSchema, LoginFormValues } from "./features/auth/login.schema";

// 3. Import Your Cost Estimation Items Dashboard Feature
import { ItemsPage } from "@/features/items/ItemsPage";

// Ultra-premium cubic-bezier curve for high-end UI physics
const customCubic = [0.25, 1, 0.5, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const maskedSlideVariants: Variants = {
  hidden: { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 20 },
  visible: {
    opacity: 1,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: customCubic
    }
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  
  const magneticButtonRef = useRef<HTMLButtonElement>(null);

  // Global Pointer Tracker for Backdrops and Ambient Spotlights
  const globalX = useMotionValue(0);
  const globalY = useMotionValue(0);
  
  // Ambient cursor tracker light background string builder plugin
  const ambientBgLight = useMotionTemplate`radial-gradient(600px circle at ${globalX}px ${globalY}px, rgba(15, 23, 42, 0.04), transparent 80%)`;

  // Card Mouse Tracker for Subtle 3D Depth Shimmer Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(springY, [-300, 300], [5, -5]);
  const rotateY = useTransform(springX, [-300, 300], [-5, 5]);

  // Magnetic Spring Physics Engine values for the submission control button
  const buttonX = useMotionValue(0);
  const buttonY = useMotionValue(0);
  const springButtonX = useSpring(buttonX, { stiffness: 250, damping: 18, mass: 0.5 });
  const springButtonY = useSpring(buttonY, { stiffness: 250, damping: 18, mass: 0.5 });

  // 1. Session Hydration Lifecycle (Runs exactly once on boot)
  useEffect(() => {
    const hydrateSession = () => {
      try {
        const savedToken = localStorage.getItem("authToken");
        
        if (savedToken) {
          // Re-inject token into Axios global context for all app calls
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Session hydration failed:", error);
        localStorage.removeItem("authToken"); // Clear potentially corrupted state
      } finally {
        // App hydration finished, lift the gate
        setIsBooting(false);
      }
    };

    hydrateSession();
  }, []);

  // Tracking pointer location globally for the cursor highlight backdrop layer
  useEffect(() => {
    const handleGlobalPointer = (event: PointerEvent) => {
      globalX.set(event.clientX);
      globalY.set(event.clientY);
    };
    window.addEventListener("pointermove", handleGlobalPointer);
    return () => window.removeEventListener("pointermove", handleGlobalPointer);
  }, [globalX, globalY]);

  // Fake system boot counter matrix feed decoration
  useEffect(() => {
    const interval = setInterval(() => {
      setBootProgress((prev) => (prev >= 100 ? 100 : prev + Math.floor(Math.random() * 15) + 5));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseXFromCenter = event.clientX - rect.left - rect.width / 2;
    const mouseYFromCenter = event.clientY - rect.top - rect.height / 2;
    mouseX.set(mouseXFromCenter);
    mouseY.set(mouseYFromCenter);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    buttonX.set(0);
    buttonY.set(0);
  }

  function handleButtonMagneticMove(event: React.MouseEvent<HTMLButtonElement>) {
    if (!magneticButtonRef.current) return;
    const rect = magneticButtonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    
    buttonX.set(distanceX * 0.35);
    buttonY.set(distanceY * 0.35);
  }

  function handleButtonMagneticLeave() {
    buttonX.set(0);
    buttonY.set(0);
  }

  // FIX: Retain the full 'form' instance object so Shadcn components can digest it smoothly
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  // Production authentication form submission block processing axios token handshake calls
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Standardized to Axios to stay unified with your session hydration context
      const response = await api.post("/Auth/login", {
        username: data.username,
        password: data.password,
      });

      const result = response.data;

      // Persist the JWT securely in localStorage
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUsername", result.username);

      // Sync future application Axios instances automatically
      axios.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;

      // Trigger transition to display the ItemsPage dashboard
      setIsAuthenticated(true);

    } catch (error: any) {
      console.error("Gateway access error:", error.response || error.message || error);
      
      const serverErrorMessage = error.response?.data?.message
        || (error.response ? `Login failed: ${error.response.status}` : `Network login error: ${error.message}`);
      
      // Inject error natively into the Shadcn / React Hook Form context state
      form.setError("password", {
        type: "manual",
        message: serverErrorMessage,
      });
    }
  };

  // 2. The Guard Clause: Holds rendering until hydration completes to eliminate form flashing
  if (isBooting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-slate-400 text-xs">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-slate-200" />
        INITIALIZING SECURE ENVIRONMENT...
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: customCubic }}
        >
          <ItemsPage />
        </motion.div>
      ) : (
        <motion.div
          key="gateway"
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)", transition: { duration: 0.4 } }}
          className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50 text-slate-900 selection:bg-slate-200 relative overflow-hidden"
        >
          {/* Ambient Cursor Track Layer */}
          <motion.div 
            className="absolute inset-0 pointer-events-none hidden lg:block z-0" 
            style={{ background: ambientBgLight }} 
          />

          {/* LEFT COLUMN: ENTERPRISE SYSTEM INFO */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex lg:col-span-7 p-12 flex-col justify-between bg-slate-900 text-slate-100 border-r border-slate-800 relative overflow-hidden"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.5, ease: customCubic }}
              className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem]"
              style={{
                maskImage: `radial-gradient(circle 500px at center, white, transparent)`
              }}
            />

            <motion.div 
              animate={{ y: ["-100%", "100%"] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-b from-transparent via-white to-transparent h-1/3 w-full"
            />

            <motion.div variants={maskedSlideVariants} className="relative z-10 flex items-center gap-3">
              <div className="p-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg">
                <Calculator className="h-5 w-5 text-slate-200" />
              </div>
              <span className="font-mono font-semibold tracking-widest text-xs text-slate-400">
                SYS.NODE // CODESPACE_ALPHA
              </span>
            </motion.div>

            <div className="relative z-10 max-w-xl my-auto space-y-6">
              <motion.h1 variants={maskedSlideVariants} className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl leading-none">
                Precision Cost <br/>Estimation Engine
              </motion.h1>
              
              <motion.p variants={maskedSlideVariants} className="text-slate-400 leading-relaxed text-sm font-normal max-w-md">
                Calculate margins, evaluate vendor matrix variants, and manage structural paperboard inventory models instantly via an enterprise ledger infrastructure.
              </motion.p>

              <motion.div variants={maskedSlideVariants} className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <Database className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wide uppercase">MS-SQL Database</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">MATRIX_PIPELINE // CONNECTED</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wide uppercase">Audit Ledger</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">SYSTEM_INTEGRITY // STABLE</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div variants={maskedSlideVariants} className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-mono">
              <div>v2026.1.0 // MULTI-TENANT</div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>GRID_MATRIX_FEED: {bootProgress}%</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: INTERACTIVE INTERFACE GATEWAY */}
          <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: customCubic }}
              className="w-full max-w-md style-layer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <Calculator className="h-5 w-5 text-slate-700" />
                <span className="font-mono font-bold text-xs tracking-wider text-slate-600">
                  COST.ESTIMATE // APPS
                </span>
              </div>

              <Card className="border-slate-200/80 shadow-2xl bg-white rounded-2xl overflow-hidden relative transition-shadow duration-300 hover:shadow-slate-200/50">
                <div className="h-[3px] w-full bg-slate-900 absolute top-0 left-0" />

                <CardHeader className="space-y-1.5 pb-6 pt-8">
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                    System Access
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Enter secure parameters assigned by enterprise directory operations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      
                      {form.formState.errors.root && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium font-sans leading-relaxed"
                        >
                          {form.formState.errors.root.message}
                        </motion.div>
                      )}

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                              System Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="e.g., admin"
                                disabled={form.formState.isSubmitting}
                                className="border-slate-200 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:border-transparent bg-slate-50/30 font-sans text-sm rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-xs font-medium text-rose-600 block mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                              Security Password
                            </FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  disabled={form.formState.isSubmitting}
                                  className="border-slate-200 pr-10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:border-transparent bg-slate-50/30 font-sans text-sm rounded-lg"
                                />
                              </FormControl>
                              <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <FormMessage className="text-xs font-medium text-rose-600 block mt-1" />
                          </FormItem>
                        )}
                      />

                      <motion.div
                        style={{ x: springButtonX, y: springButtonY }}
                        className="w-full relative pt-1"
                      >
                        <Button
                          ref={magneticButtonRef}
                          type="submit"
                          disabled={form.formState.isSubmitting}
                          onMouseMove={handleButtonMagneticMove}
                          onMouseLeave={handleButtonMagneticLeave}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md flex items-center justify-center gap-2 h-10 relative overflow-hidden transition-colors duration-200 rounded-lg active:scale-[0.985]"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {form.formState.isSubmitting ? (
                              <motion.div
                                key="submitting"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2"
                              >
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="font-mono tracking-wider text-xs">VERIFYING SECURE TOKEN...</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="idle"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm tracking-normal">Initialize Gateway</span>
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                >
                                  <ArrowRight className="h-4 w-4 opacity-80" />
                                </motion.span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-[11px] text-slate-400 mt-6 px-6 leading-relaxed font-sans"
              >
                Authorized operation context only. All transactions, calculation cycles, and active parameter mutations are monitored and logged natively under network auditing regulations.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}