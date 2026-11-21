import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useAdminLogin } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const adminLogin = useAdminLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginForm) {
    adminLogin.mutate(
      { data },
      {
        onSuccess: (result) => {
          const r = result as { token: string };
          localStorage.setItem("ow-admin-token", r.token);
          setLocation("/ow-admin/dashboard");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Access Denied", description: "Invalid credentials provided." });
        },
      }
    );
  }

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 py-12"
      style={{
        background: "radial-gradient(circle at 50% 12%, #0E3D60 0%, #071E2E 50%, #04121C 100%)",
      }}
    >
      {/* ── Ambient Brand Lighting ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Golden Sunrise Backlight */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-gradient-to-tr from-[#FBBF24]/12 via-[#F59E0B]/8 to-transparent rounded-full blur-[110px]" />
        
        {/* Deep Ocean Coastal Glow */}
        <div className="absolute -bottom-24 right-[-10%] w-[500px] h-[500px] bg-[#0B3D5E]/40 rounded-full blur-[140px]" />
        
        {/* Executive Minimal Grid Accent */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(251, 191, 36, 0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Main Card */}
          <div className="bg-[#071E2E]/85 backdrop-blur-2xl border border-white/12 rounded-[2rem] shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_0_1px_rgba(251,191,36,0.18)] p-7 sm:p-10 relative overflow-hidden">
            {/* Elegant Golden Hairline Top Accent */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-80" />

            {/* Header: Medallion Logo & Title */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-5 flex justify-center">
                <div className="relative group">
                  {/* Subtle golden ambient halo */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#FBBF24]/25 via-[#F59E0B]/20 to-[#FBBF24]/25 blur-lg opacity-75 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                  {/* Circular Medallion */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-[#FBBF24] via-[#F59E0B]/70 to-[#FBBF24]/30 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                    <div className="w-full h-full rounded-full bg-[#FAF9F6] p-1.5 flex items-center justify-center overflow-hidden shadow-inner border border-white/90">
                      <img 
                        src="/images/logo.jpg" 
                        alt="Ocean Air Sanctuary Logo" 
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] text-[10px] font-black uppercase tracking-[0.24em] mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                <span>Ocean Air Weligama</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mt-1">Enter your credentials to manage operations</p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Address */}
                <FormField 
                  control={form.control} 
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-[11px] uppercase tracking-wider font-bold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type="email"
                            placeholder="admin@oceanweligama.com"
                            className="bg-[#051C2C]/85 border-white/15 text-white placeholder:text-white/30 h-13 rounded-xl px-4 text-sm font-medium transition-all duration-200 focus:bg-[#072439] focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 hover:border-white/25"
                            data-testid="input-admin-email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-amber-400 text-xs font-medium" />
                    </FormItem>
                  )} 
                />

                {/* Password */}
                <FormField 
                  control={form.control} 
                  name="password" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-[11px] uppercase tracking-wider font-bold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-[#051C2C]/85 border-white/15 text-white placeholder:text-white/30 h-13 rounded-xl pl-4 pr-11 text-sm font-medium transition-all duration-200 focus:bg-[#072439] focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 hover:border-white/25"
                            data-testid="input-admin-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#FBBF24] transition-colors p-1.5 rounded-lg cursor-pointer"
                            tabIndex={-1}
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-amber-400 text-xs font-medium" />
                    </FormItem>
                  )} 
                />

                {/* Action CTA - Uiverse.io Expand Button by gharsh11032000 (Ocean Air Brand Colors) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="admin-signin-expand-btn"
                    disabled={adminLogin.isPending}
                    data-testid="button-admin-login"
                  >
                    {adminLogin.isPending ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#FBBF24]" />
                        <span className="font-bold tracking-wider">Authenticating...</span>
                      </span>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                          />
                        </svg>
                        <span className="text">Secure Sign In</span>
                        <span className="circle" />
                        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>

            {/* Footer Trust & Navigation */}
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-col items-center gap-2.5">
              <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <ShieldCheck className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>256-Bit Encrypted Management Session</span>
              </div>
              <Link 
                href="/" 
                className="text-[11px] text-white/40 hover:text-[#FBBF24] transition-colors inline-flex items-center gap-1 font-medium pt-0.5"
              >
                <span>← Return to Public Website</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}