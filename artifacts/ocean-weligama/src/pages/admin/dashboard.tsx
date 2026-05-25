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
import { Calendar, Euro, Users, TrendingUp, Mail, Clock } from "lucide-react";

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
    { label: "Month Revenue", value: `€${dash?.monthRevenue ?? "0"}`, icon: Euro, color: "text-green-500" },
    { label: "Active Guests", value: dash?.activeGuests ?? 0, icon: Users, color: "text-purple-500" },
    { label: "Total Bookings", value: dash?.totalBookings ?? 0, icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Welcome back. Here's your island sanctuary at a glance.</p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashLoading
            ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-[2rem]" />)
            : METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/50 cursor-default transition-shadow hover:shadow-xl hover:shadow-slate-200"
                  data-testid={`metric-${m.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                    <div className={`p-2 rounded-xl bg-slate-50 ${m.color.replace('text-', 'bg-').replace('500', '50')} ${m.color}`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-black text-[#0B3D5E]">{m.value}</p>
                </motion.div>
              ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bookings Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] mb-8">Bookings Trend (30 days)</h2>
            {trend && Array.isArray(trend) && trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trend as Array<{ date: string; bookings: number; revenue: string }>}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="#0B3D5E" strokeWidth={4} dot={{ r: 4, fill: '#0B3D5E', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6, fill: '#4BBCCC', stroke: '#ffffff', strokeWidth: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl">
                No booking data yet
              </div>
            )}
          </div>

          {/* Unread Messages */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">Unread Messages</h2>
              {messages && Array.isArray(messages) && messages.length > 0 && (
                <Badge className="bg-rose-100 text-rose-700 border-0 text-[10px] font-black px-2 py-0.5 rounded-full">{messages.length} New</Badge>
              )}
            </div>
            {messages && Array.isArray(messages) && messages.length > 0 ? (
              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {(messages as Array<{ id: string; fullName: string; email: string; subject?: string; createdAt: string }>).slice(0, 5).map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={msg.id} 
                    className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer group"
                  >
                    <p className="font-bold text-sm text-[#0B3D5E] group-hover:text-sky-700 transition-colors">{msg.fullName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{msg.subject || msg.email}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-[1.5rem]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Mail className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold">Inbox zero</p>
                <p className="text-xs text-slate-500 mt-1">No unread messages</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Check-ins */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">Upcoming Check-ins (7 days)</h2>
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200">{upcomingCheckins && Array.isArray(upcomingCheckins) ? upcomingCheckins.length : 0} Total</Badge>
          </div>
          {upcomingCheckins && Array.isArray(upcomingCheckins) && upcomingCheckins.length > 0 ? (
            <div className="overflow-x-auto rounded-[1.5rem] border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4 rounded-tl-[1.5rem]">Reference</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Check-in</th>
                    <th className="px-6 py-4">Nights</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-tr-[1.5rem]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group cursor-default" data-testid={`row-checkin-${b.id}`}>
                      <td className="px-6 py-5 font-mono text-xs font-bold text-[#4BBCCC] group-hover:text-[#0B3D5E] transition-colors">{b.reference}</td>
                      <td className="px-6 py-5 font-bold text-[#0B3D5E]">{b.guestFullName}</td>
                      <td className="px-6 py-5 text-slate-600 font-medium">{b.checkIn}</td>
                      <td className="px-6 py-5 text-slate-600 font-medium">{b.nights}n</td>
                      <td className="px-6 py-5">
                        <Badge className={`text-[10px] font-black uppercase tracking-widest border-0 ${
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>{b.status}</Badge>
                      </td>
                      <td className="px-6 py-5 font-black text-[#0B3D5E]">€{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-[1.5rem] border border-slate-100 border-dashed">
              <Calendar className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-sm font-bold">No upcoming check-ins</p>
              <p className="text-xs text-slate-500 mt-1">Your next 7 days are clear</p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
