import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Waves, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const adminLogin = useAdminLogin();
  const [isHovering, setIsHovering] = useState(false);

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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a192f]">
      {/* ── Background Animations ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Main Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
            {/* Glossy overlay top edge */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="text-center mb-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto mb-6 flex justify-center"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.2)] p-2 border border-white/20 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="Ocean Weligama Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </motion.div>
              <h1 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
              <p className="text-sky-200/60 text-sm font-medium tracking-wide">Enter your credentials to continue</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-widest font-bold">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="email"
                          placeholder="admin@oceanweligama.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl px-4 transition-all duration-300 focus:bg-white/10 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 group-hover:border-white/20"
                          data-testid="input-admin-email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-widest font-bold">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl px-4 transition-all duration-300 focus:bg-white/10 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 group-hover:border-white/20"
                          data-testid="input-admin-password"
                          {...field}
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <div className="pt-4">
                  <motion.div
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full relative overflow-hidden bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl h-14 font-bold text-sm shadow-[0_10px_30px_rgba(56,189,248,0.3)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(56,189,248,0.5)] border-0"
                      disabled={adminLogin.isPending}
                      data-testid="button-admin-login"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {adminLogin.isPending ? "Authenticating..." : "Secure Sign In"}
                        {!adminLogin.isPending && (
                          <motion.span
                            animate={{ x: isHovering ? 5 : 0 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        )}
                      </span>
                      {/* Shine effect */}
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: isHovering ? "200%" : "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 skew-x-[-20deg]" 
                      />
                    </Button>
                  </motion.div>
                </div>
              </form>
            </Form>

            <div className="mt-8 flex items-center justify-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              End-to-End Encrypted Session
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
