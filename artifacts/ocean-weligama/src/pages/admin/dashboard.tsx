import { motion } from "framer-motion";
import {
  useAdminGetDashboard,
  useAdminGetBookingsTrend,
  useAdminGetUpcomingCheckins,
  useAdminListMessages,
  getAdminGetDashboardQueryKey,
  getAdminGetBookingsTrendQueryKey,
  getAdminGetUpcomingCheckinsQueryKey,
  getAdminListMessagesQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, DollarSign, Users, TrendingUp, Mail, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: dashboard, isLoading: dashLoading } = useAdminGetDashboard({
    query: { queryKey: getAdminGetDashboardQueryKey() },
  });
  const { data: trend } = useAdminGetBookingsTrend({ days: 30 }, {
    query: { queryKey: getAdminGetBookingsTrendQueryKey({ days: 30 }) },
  });
  const { data: upcomingCheckins } = useAdminGetUpcomingCheckins({
    query: { queryKey: getAdminGetUpcomingCheckinsQueryKey() },
  });
  const { data: messages } = useAdminListMessages({ isRead: false }, {
    query: { queryKey: getAdminListMessagesQueryKey({ isRead: false }) },
  });

  const dash = dashboard as {
    todayBookings: number;
    monthRevenue: string;
    activeGuests: number;
    totalBookings: number;
    pendingBookings: number;
    recentMessages: number;
  } | undefined;

  const METRICS = [
    { label: "Today's Bookings", value: dash?.todayBookings ?? 0, icon: Calendar, color: "text-blue-500" },
    { label: "Month Revenue", value: `$${dash?.monthRevenue ?? "0"}`, icon: DollarSign, color: "text-green-500" },
    { label: "Active Guests", value: dash?.activeGuests ?? 0, icon: Users, color: "text-purple-500" },
    { label: "Total Bookings", value: dash?.totalBookings ?? 0, icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's what's happening.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {dashLoading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            : METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-5 border border-border"
                  data-testid={`metric-${m.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{m.label}</span>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{m.value}</p>
                </motion.div>
              ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bookings Trend Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <h2 className="font-bold text-foreground mb-5">Bookings Trend (30 days)</h2>
            {trend && Array.isArray(trend) && trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trend as Array<{ date: string; bookings: number; revenue: string }>}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="#1A6B8A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No booking data yet
              </div>
            )}
          </div>

          {/* Unread Messages */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="font-bold text-foreground">Unread Messages</h2>
              {messages && Array.isArray(messages) && messages.length > 0 && (
                <Badge className="bg-red-100 text-red-700 border-0 text-xs">{messages.length}</Badge>
              )}
            </div>
            {messages && Array.isArray(messages) && messages.length > 0 ? (
              <div className="space-y-3">
                {(messages as Array<{ id: string; fullName: string; email: string; subject?: string; createdAt: string }>).slice(0, 5).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                    <p className="font-medium text-sm text-foreground">{msg.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Mail className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No unread messages</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Check-ins */}
        <div className="mt-6 bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-foreground mb-5">Upcoming Check-ins (7 days)</h2>
          {upcomingCheckins && Array.isArray(upcomingCheckins) && upcomingCheckins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Reference</th>
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Check-in</th>
                    <th className="pb-3 font-medium">Nights</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(upcomingCheckins as Array<{
                    id: string;
                    reference: string;
                    guestFullName: string;
                    checkIn: string;
                    nights: number;
                    status: string;
                    totalAmount: string;
                    currency: string;
                  }>).map((b) => (
                    <tr key={b.id} className="py-2" data-testid={`row-checkin-${b.id}`}>
                      <td className="py-3 font-mono text-xs text-primary">{b.reference}</td>
                      <td className="py-3 font-medium">{b.guestFullName}</td>
                      <td className="py-3">{b.checkIn}</td>
                      <td className="py-3">{b.nights}n</td>
                      <td className="py-3">
                        <Badge className="capitalize text-xs" variant="outline">{b.status}</Badge>
                      </td>
                      <td className="py-3 font-medium">${b.totalAmount} {b.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
              No upcoming check-ins in the next 7 days
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
