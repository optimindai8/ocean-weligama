import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingDown,
  TrendingUp,
  Save,
  Plus,
  Trash2,
  Power,
  PowerOff,
  SunMedium,
  Snowflake,
  BedDouble,
  Sparkles,
  Grid3x3,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface RateAdjustment {
  id: string;
  seasonName: string;
  dateFrom: string | null;
  dateTo: string | null;
  roomAdjustmentType: string;
  roomAdjustmentValue: string;
  experienceAdjustmentType: string;
  experienceAdjustmentValue: string;
  packageAdjustmentType: string;
  packageAdjustmentValue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SEASONS = [
  {
    key: "summer",
    label: "Low Season",
    subtitle: "Manage base rates",
    icon: SunMedium,
    gradient: "from-amber-500 via-orange-400 to-yellow-400",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    activeBg: "bg-amber-500",
    iconColor: "text-amber-500",
    defaultName: "Low Season",
  },
  {
    key: "winter",
    label: "High Season",
    subtitle: "Manage peak rates",
    icon: Snowflake,
    gradient: "from-sky-500 via-blue-400 to-cyan-400",
    bg: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    activeBg: "bg-sky-500",
    iconColor: "text-sky-500",
    defaultName: "High Season",
  },
];

const API_BASE = "/api/v1/admin/rate-adjustments";

function getToken() {
  return localStorage.getItem("ow-admin-token") || "";
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Price Input Component ────────────────────────────────────────────────────
function PriceAdjustInput({
  label,
  icon: Icon,
  iconColor,
  adjustmentType,
  adjustmentValue,
  onTypeChange,
  onValueChange,
  disabled,
}: {
  label: string;
  icon: any;
  iconColor: string;
  adjustmentType: string;
  adjustmentValue: string;
  onTypeChange: (v: string) => void;
  onValueChange: (v: string) => void;
  disabled?: boolean;
}) {
  const numVal = parseFloat(adjustmentValue) || 0;
  const isNegative = numVal < 0;
  const isPositive = numVal > 0;

  return (
    <div className={`rounded-2xl border bg-white p-5 space-y-4 shadow-sm transition-all duration-300 ${disabled ? "opacity-60" : "hover:shadow-md"}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{label}</span>
      </div>

      {/* Type Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 gap-1">
        {[
          { val: "fixed", label: "€ Fixed" },
          { val: "percentage", label: "% Percent" },
        ].map((opt) => (
          <button
            key={opt.val}
            type="button"
            onClick={() => !disabled && onTypeChange(opt.val)}
            disabled={disabled}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 ${
              adjustmentType === opt.val
                ? "bg-[#0B3D5E] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Value Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
          {adjustmentType === "percentage" ? "%" : "€"}
        </div>
        <input
          type="number"
          step="0.01"
          value={adjustmentValue}
          onChange={(e) => !disabled && onValueChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className={`w-full pl-8 pr-16 py-3 rounded-xl border-2 text-center text-2xl font-black transition-all duration-200 outline-none
            ${isNegative ? "border-red-300 text-red-600 bg-red-50 focus:border-red-400" : ""}
            ${isPositive ? "border-emerald-300 text-emerald-600 bg-emerald-50 focus:border-emerald-400" : ""}
            ${!isNegative && !isPositive ? "border-slate-200 text-slate-500 bg-white focus:border-[#0B3D5E]" : ""}
            disabled:cursor-not-allowed
          `}
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200`}>
          {isNegative && <TrendingDown className="w-5 h-5 text-red-500" />}
          {isPositive && <TrendingUp className="w-5 h-5 text-emerald-500" />}
        </div>
      </div>

      {/* Preview label */}
      <div className="text-center">
        {numVal === 0 && <span className="text-xs text-slate-400 font-medium">No change applied</span>}
        {isNegative && (
          <span className="text-xs font-bold text-red-500">
            Reducing by {Math.abs(numVal)}{adjustmentType === "percentage" ? "%" : "€"} per item
          </span>
        )}
        {isPositive && (
          <span className="text-xs font-bold text-emerald-600">
            Increasing by {numVal}{adjustmentType === "percentage" ? "%" : "€"} per item
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Season Card Component ────────────────────────────────────────────────────
function SeasonCard({
  season,
  adjustment,
  isExpanded,
  onToggleExpand,
  onSave,
  onToggleActive,
  onDelete,
  isSaving,
}: {
  season: typeof SEASONS[0];
  adjustment: RateAdjustment | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSave: (data: Partial<RateAdjustment>) => void;
  onToggleActive: () => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    seasonName: adjustment?.seasonName || season.defaultName,
    dateFrom: adjustment?.dateFrom || "",
    dateTo: adjustment?.dateTo || "",
    roomAdjustmentType: adjustment?.roomAdjustmentType || "fixed",
    roomAdjustmentValue: adjustment?.roomAdjustmentValue || "0",
    experienceAdjustmentType: adjustment?.experienceAdjustmentType || "fixed",
    experienceAdjustmentValue: adjustment?.experienceAdjustmentValue || "0",
    packageAdjustmentType: adjustment?.packageAdjustmentType || "fixed",
    packageAdjustmentValue: adjustment?.packageAdjustmentValue || "0",
  });

  useEffect(() => {
    if (adjustment) {
      setForm({
        seasonName: adjustment.seasonName,
        dateFrom: adjustment.dateFrom || "",
        dateTo: adjustment.dateTo || "",
        roomAdjustmentType: adjustment.roomAdjustmentType || "fixed",
        roomAdjustmentValue: adjustment.roomAdjustmentValue || "0",
        experienceAdjustmentType: adjustment.experienceAdjustmentType || "fixed",
        experienceAdjustmentValue: adjustment.experienceAdjustmentValue || "0",
        packageAdjustmentType: adjustment.packageAdjustmentType || "fixed",
        packageAdjustmentValue: adjustment.packageAdjustmentValue || "0",
      });
    }
  }, [adjustment]);

  const isActive = adjustment?.isActive ?? false;
  const SeasonIcon = season.icon;

  const hasChanges =
    !adjustment ||
    form.roomAdjustmentValue !== (adjustment?.roomAdjustmentValue || "0") ||
    form.experienceAdjustmentValue !== (adjustment?.experienceAdjustmentValue || "0") ||
    form.packageAdjustmentValue !== (adjustment?.packageAdjustmentValue || "0") ||
    form.roomAdjustmentType !== (adjustment?.roomAdjustmentType || "fixed") ||
    form.experienceAdjustmentType !== (adjustment?.experienceAdjustmentType || "fixed") ||
    form.packageAdjustmentType !== (adjustment?.packageAdjustmentType || "fixed") ||
    form.dateFrom !== (adjustment?.dateFrom || "") ||
    form.dateTo !== (adjustment?.dateTo || "");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border-2 overflow-hidden shadow-lg transition-all duration-300 ${
        isActive
          ? `${season.border} shadow-xl`
          : "border-slate-200"
      }`}
    >
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${isActive ? season.bg : "from-slate-50 to-slate-100"} p-6 cursor-pointer transition-all duration-300`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Season Icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${isActive ? `bg-gradient-to-br ${season.gradient}` : "bg-white"}`}>
              <SeasonIcon className={`w-7 h-7 ${isActive ? "text-white" : season.iconColor}`} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-black text-[#0B3D5E]">{season.label}</h3>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${season.gradient} shadow-sm`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </motion.span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{season.subtitle}</p>
              {adjustment && (
                <p className="text-xs text-slate-400 mt-1">
                  Rooms {parseFloat(adjustment.roomAdjustmentValue) > 0 ? "+" : ""}{adjustment.roomAdjustmentValue}€ &nbsp;·&nbsp;
                  Exp {parseFloat(adjustment.experienceAdjustmentValue) > 0 ? "+" : ""}{adjustment.experienceAdjustmentValue}€ &nbsp;·&nbsp;
                  Pkgs {parseFloat(adjustment.packageAdjustmentValue) > 0 ? "+" : ""}{adjustment.packageAdjustmentValue}€
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Toggle Button */}
            {adjustment && (
              <motion.button
                whileTap={{ scale: 0.85, rotate: isActive ? -5 : 5 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => { e.stopPropagation(); onToggleActive(); }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-all duration-500 shadow-md ${
                  isActive
                    ? `bg-gradient-to-r ${season.gradient} text-white shadow-lg hover:shadow-xl ring-4 ring-${season.iconColor.split('-')[1]}-200`
                    : "bg-white text-slate-500 border-2 border-slate-200 hover:border-slate-300"
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                </motion.div>
                {isActive ? "Active" : "Inactive"}
                
                {/* Glow effect when active */}
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${season.gradient} blur-md -z-10`} 
                  />
                )}
              </motion.button>
            )}

            {/* Expand toggle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-[#0B3D5E] text-white" : "bg-white text-slate-400"}`}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 border-t border-slate-100">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Season Start</label>
                  <input
                    type="date"
                    value={form.dateFrom}
                    onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#0B3D5E] outline-none text-sm font-bold text-slate-700 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Season End</label>
                  <input
                    type="date"
                    value={form.dateTo}
                    onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#0B3D5E] outline-none text-sm font-bold text-slate-700 transition-colors"
                  />
                </div>
              </div>

              {/* Info banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-6">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-blue-700 uppercase tracking-widest mb-0.5">Bulk Adjustment</p>
                  <p className="text-xs text-blue-600 font-medium">
                    Enter a single value — it applies to <strong>all</strong> rooms, experiences, or packages at once. Use negative numbers to reduce prices (e.g. -10 to reduce by €10), positive to increase.
                  </p>
                </div>
              </div>

              {/* Price Adjustment Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <PriceAdjustInput
                  label="Room Prices"
                  icon={BedDouble}
                  iconColor="text-[#0B3D5E]"
                  adjustmentType={form.roomAdjustmentType}
                  adjustmentValue={form.roomAdjustmentValue}
                  onTypeChange={(v) => setForm({ ...form, roomAdjustmentType: v })}
                  onValueChange={(v) => setForm({ ...form, roomAdjustmentValue: v })}
                />
                <PriceAdjustInput
                  label="Experience Prices"
                  icon={Sparkles}
                  iconColor="text-purple-500"
                  adjustmentType={form.experienceAdjustmentType}
                  adjustmentValue={form.experienceAdjustmentValue}
                  onTypeChange={(v) => setForm({ ...form, experienceAdjustmentType: v })}
                  onValueChange={(v) => setForm({ ...form, experienceAdjustmentValue: v })}
                />
                <PriceAdjustInput
                  label="Package Matrix"
                  icon={Grid3x3}
                  iconColor="text-teal-500"
                  adjustmentType={form.packageAdjustmentType}
                  adjustmentValue={form.packageAdjustmentValue}
                  onTypeChange={(v) => setForm({ ...form, packageAdjustmentType: v })}
                  onValueChange={(v) => setForm({ ...form, packageAdjustmentValue: v })}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {adjustment ? (
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Season
                  </button>
                ) : (
                  <div />
                )}

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSave(form)}
                  disabled={isSaving || (!hasChanges && !!adjustment)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 shadow-md
                    ${hasChanges || !adjustment
                      ? "bg-[#0B3D5E] text-white hover:bg-[#1A6B8A] hover:shadow-lg"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isSaving ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Save className="w-4 h-4" /> {adjustment ? "Save Changes" : "Create Season"}</>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminRateAdjustments() {
  const { toast } = useToast();
  const [adjustments, setAdjustments] = useState<RateAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSeason, setExpandedSeason] = useState<string | null>("summer");
  const [savingSeasons, setSavingSeasons] = useState<Record<string, boolean>>({});

  // Which adjustment corresponds to which season key
  const getAdjForSeason = (key: string) => {
    const season = SEASONS.find((s) => s.key === key)!;
    return adjustments.find((a) => {
      const name = (a.seasonName || "").toLowerCase();
      if (key === "summer") {
        return name.startsWith("april") || name.includes("low season");
      } else {
        return name.startsWith("october") || name.includes("high season");
      }
    }) || adjustments.find((a) => a.seasonName === season.defaultName) || null;
  };

  async function fetchAdjustments() {
    try {
      setIsLoading(true);
      const data = await apiFetch(API_BASE);
      setAdjustments(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: "Error loading adjustments", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchAdjustments(); }, []);

  async function handleSave(seasonKey: string, formData: any) {
    setSavingSeasons((prev) => ({ ...prev, [seasonKey]: true }));
    try {
      const existing = getAdjForSeason(seasonKey);
      const payload = {
        ...formData,
        seasonName: formData.seasonName || SEASONS.find((s) => s.key === seasonKey)!.defaultName,
        isActive: existing?.isActive ?? false,
      };

      if (existing) {
        const updated = await apiFetch(`${API_BASE}/${existing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setAdjustments((prev) => prev.map((a) => (a.id === existing.id ? updated : a)));
        toast({ title: "✅ Saved!", description: "Rate adjustment updated. Changes are live on the website." });
      } else {
        const created = await apiFetch(API_BASE, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAdjustments((prev) => [...prev, created]);
        toast({ title: "✅ Created!", description: "New season created. Activate it to apply prices." });
      }
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message || "Unknown error", variant: "destructive" });
    } finally {
      setSavingSeasons((prev) => ({ ...prev, [seasonKey]: false }));
    }
  }

  async function handleToggleActive(seasonKey: string) {
    const existing = getAdjForSeason(seasonKey);
    if (!existing) return;

    const newActive = !existing.isActive;

    // If activating this one, deactivate all others first
    if (newActive) {
      for (const adj of adjustments) {
        if (adj.id !== existing.id && adj.isActive) {
          await apiFetch(`${API_BASE}/${adj.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...adj, isActive: false }),
          });
        }
      }
    }

    try {
      const updated = await apiFetch(`${API_BASE}/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...existing, isActive: newActive }),
      });
      setAdjustments((prev) =>
        prev.map((a) => {
          if (a.id === existing.id) return updated;
          if (newActive && a.id !== existing.id) return { ...a, isActive: false };
          return a;
        })
      );
      toast({
        title: newActive ? "🟢 Season Activated!" : "⚫ Season Deactivated",
        description: newActive
          ? "Adjusted prices are now live on the main website."
          : "Prices have returned to original values.",
      });
    } catch (e) {
      toast({ title: "Failed to update activation", variant: "destructive" });
    }
  }

  async function handleDelete(seasonKey: string) {
    const existing = getAdjForSeason(seasonKey);
    if (!existing) return;
    if (!confirm("Delete this season's rate adjustment? This cannot be undone.")) return;
    try {
      await apiFetch(`${API_BASE}/${existing.id}`, { method: "DELETE" });
      setAdjustments((prev) => prev.filter((a) => a.id !== existing.id));
      toast({ title: "Deleted", description: "Season adjustment removed." });
    } catch (e) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  }

  const anyActive = adjustments.some((a) => a.isActive);
  const activeAdj = adjustments.find((a) => a.isActive);

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-5xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#1A6B8A] flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">Rate Adjustment</h1>
                  <p className="text-slate-500 font-medium text-sm">Seasonal bulk price control for the entire website</p>
                </div>
              </div>
            </div>

            {/* Live status banner */}
            <AnimatePresence>
              {anyActive && activeAdj && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-200 px-5 py-3 rounded-2xl shadow-md"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Adjustment Live</p>
                    <p className="text-xs text-emerald-600 font-medium">{activeAdj.seasonName}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* How it works */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Set adjustments", desc: "Enter a fixed (€) or percentage (%) change for each price type." },
              { title: "Save season", desc: "Save the season. Prices are staged but not yet live." },
              { title: "Activate", desc: "Hit the Activate button to instantly apply prices across the whole website." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div>
                  <p className="text-sm font-black text-slate-700">{step.title}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Season Cards */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {SEASONS.map((season) => {
              const adj = getAdjForSeason(season.key);
              return (
                <SeasonCard
                  key={season.key}
                  season={season}
                  adjustment={adj}
                  isExpanded={expandedSeason === season.key}
                  onToggleExpand={() =>
                    setExpandedSeason((prev) => (prev === season.key ? null : season.key))
                  }
                  onSave={(formData) => handleSave(season.key, formData)}
                  onToggleActive={() => handleToggleActive(season.key)}
                  onDelete={() => handleDelete(season.key)}
                  isSaving={!!savingSeasons[season.key]}
                />
              );
            })}
          </div>
        )}

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200"
        >
          <p className="text-xs text-slate-500 font-medium text-center">
            <strong className="text-slate-700">Only one season can be active at a time.</strong> Activating a season automatically deactivates any other.
            When a season is active, the website shows the original price with a strikethrough and the new adjusted price.
            Booking totals are recalculated using the adjusted prices.
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
