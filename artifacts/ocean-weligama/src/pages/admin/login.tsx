import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Waves, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const adminLogin = useAdminLogin();

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
          toast({ variant: "destructive", title: "Login failed", description: "Invalid email or password." });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Ocean Weligama</h1>
          <p className="text-primary-foreground/60 text-sm">Admin Portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Secure admin access</span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@oceanweligama.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      data-testid="input-admin-email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      data-testid="input-admin-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )} />
              <Button
                type="submit"
                className="w-full bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full h-12 font-medium mt-2"
                disabled={adminLogin.isPending}
                data-testid="button-admin-login"
              >
                {adminLogin.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
