import { useState, useEffect } from "react";
import {
  useGetAirportPricing,
  useAdminUpdateAirportPricing,
  getGetAirportPricingQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Plane,
  Save,
  Users,
  ArrowUpFromLine,
  ArrowDownToLine,
  Info,
  RefreshCw,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface PricingForm {
  pickupPrice: string;
  pickupPriceGroup: string;
  dropPrice: string;
  dropPriceGroup: string;
  groupThreshold: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Price Input Field
// ─────────────────────────────────────────────────────────────────────────────
function PriceField({
  label,
  description,
  value,
  onChange,
  prefix = "€",
  type = "number",
  testId,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  type?: string;
  testId?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-primary/70 pointer-events-none">
            {prefix}
          </span>
        )}
        <Input
          type={type}
          min="0"
          step={type === "number" && prefix === "€" ? "0.01" : "1"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 rounded-xl border-border/60 bg-white/60 backdrop-blur-sm font-semibold text-foreground focus:border-primary/50 focus:ring-primary/20 ${prefix ? "pl-8" : "pl-4"}`}
          data-testid={testId}
        />
      </div>
      {description && (
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Card
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({
  icon,
  iconBg,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-border/40 bg-gradient-to-r from-slate-50/80 to-transparent">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      {/* Body */}
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview Badge
// ─────────────────────────────────────────────────────────────────────────────
function PreviewCard({
  label,
  pax,
  pickup,
  drop,
}: {
  label: string;
  pax: string;
  pickup: string;
  drop: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#0B3D5E]/5 to-[#4BBCCC]/10 border border-[#4BBCCC]/20 rounded-xl px-5 py-4 flex flex-col gap-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#0B3D5E]/60">{label}</p>
      <p className="text-xs text-muted-foreground">{pax}</p>
      <div className="flex gap-4 mt-2">
        <div>
          <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">Pickup</p>
          <p className="text-lg font-bold text-[#0B3D5E]">€{pickup}</p>
        </div>
        <div className="border-l border-border/40" />
        <div>
          <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">Drop</p>
          <p className="text-lg font-bold text-[#0B3D5E]">€{drop}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAirport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pricing, isLoading } = useGetAirportPricing({
    query: { queryKey: getGetAirportPricingQueryKey() },
  });

  const updatePricing = useAdminUpdateAirportPricing();

  const [form, setForm] = useState<PricingForm>({
    pickupPrice: "75.00",
    pickupPriceGroup: "100.00",
    dropPrice: "65.00",
    dropPriceGroup: "100.00",
    groupThreshold: "4",
  });

  const [isDirty, setIsDirty] = useState(false);

  // Populate form from fetched data
  useEffect(() => {
    if (pricing) {
      setForm({
        pickupPrice: pricing.pickupPrice,
        pickupPriceGroup: pricing.pickupPriceGroup,
        dropPrice: pricing.dropPrice,
        dropPriceGroup: pricing.dropPriceGroup,
        groupThreshold: String(pricing.groupThreshold),
      });
    }
  }, [pricing]);

  function updateField(field: keyof PricingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  function handleReset() {
    if (pricing) {
      setForm({
        pickupPrice: pricing.pickupPrice,
        pickupPriceGroup: pricing.pickupPriceGroup,
        dropPrice: pricing.dropPrice,
        dropPriceGroup: pricing.dropPriceGroup,
        groupThreshold: String(pricing.groupThreshold),
      });
      setIsDirty(false);
    }
  }

  function validate() {
    const fields = [
      { name: "Pickup Rate", val: form.pickupPrice },
      { name: "Drop Rate", val: form.dropPrice },
    ];
    for (const f of fields) {
      const n = parseFloat(f.val);
      if (isNaN(n) || n < 0) {
        toast({ variant: "destructive", title: `${f.name} must be a positive number.` });
        return false;
      }
    }
    return true;
  }

  function handleSave() {
    if (!validate()) return;

    updatePricing.mutate(
      {
        data: {
          pickupPrice: parseFloat(form.pickupPrice).toFixed(2),
          pickupPriceGroup: parseFloat(form.pickupPriceGroup).toFixed(2),
          dropPrice: parseFloat(form.dropPrice).toFixed(2),
          dropPriceGroup: parseFloat(form.dropPriceGroup).toFixed(2),
          groupThreshold: parseInt(form.groupThreshold, 10),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "✈️ Airport pricing updated", description: "Changes are live on the booking page." });
          queryClient.invalidateQueries({ queryKey: getGetAirportPricingQueryKey() });
          setIsDirty(false);
        },
        onError: () =>
          toast({ variant: "destructive", title: "Failed to update pricing." }),
      }
    );
  }

  const threshold = parseInt(form.groupThreshold, 10) || 4;
  const standardPax = `Up to ${threshold - 1} guest${threshold - 1 !== 1 ? "s" : ""}`;
  const groupPax = `${threshold}+ guests`;

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#1A6B8A] flex items-center justify-center shadow-lg shadow-[#0B3D5E]/20">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Airport Transfer Pricing</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Configure pickup and drop rates shown during booking checkout.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isDirty && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="rounded-full gap-2 text-muted-foreground"
                data-testid="button-reset-airport-pricing"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={updatePricing.isPending || !isDirty}
              className="bg-gradient-to-r from-[#0B3D5E] to-[#1A6B8A] hover:from-[#0a3352] hover:to-[#175f7a] text-white rounded-full gap-2 shadow-md shadow-[#0B3D5E]/20"
              data-testid="button-save-airport-pricing"
            >
              <Save className="w-4 h-4" />
              {updatePricing.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* ── Info Banner ── */}
        <div className="flex items-start gap-3 bg-[#4BBCCC]/10 border border-[#4BBCCC]/25 rounded-xl px-5 py-4 mb-8">
          <Info className="w-4 h-4 text-[#1A6B8A] shrink-0 mt-0.5" />
          <p className="text-sm text-[#0B3D5E]/80 leading-relaxed">
            Prices set here are applied <span className="font-semibold">immediately</span> to the booking page.
            All prices are in <span className="font-semibold">Euros (€)</span> and are collected on arrival.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-5">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* ── Pickup Pricing ── */}
            <SectionCard
              icon={<ArrowDownToLine className="w-5 h-5 text-[#0B3D5E]" />}
              iconBg="bg-sky-100"
              title="Airport Pick-up"
              subtitle="Bandaranaike International Airport → Surf Camp"
            >
              <div className="max-w-xs">
                <PriceField
                  label="Standard Rate"
                  description="Applies to all airport pick-up bookings."
                  value={form.pickupPrice}
                  onChange={(v) => updateField("pickupPrice", v)}
                  testId="input-pickup-price"
                />
              </div>
            </SectionCard>

            {/* ── Drop Pricing ── */}
            <SectionCard
              icon={<ArrowUpFromLine className="w-5 h-5 text-[#0B3D5E]" />}
              iconBg="bg-emerald-100"
              title="Airport Drop"
              subtitle="Surf Camp → Bandaranaike International Airport"
            >
              <div className="max-w-xs">
                <PriceField
                  label="Standard Rate"
                  description="Applies to all airport drop-off bookings."
                  value={form.dropPrice}
                  onChange={(v) => updateField("dropPrice", v)}
                  testId="input-drop-price"
                />
              </div>
            </SectionCard>

            {/* ── Live Preview ── */}
            <div className="bg-gradient-to-br from-[#0B3D5E]/5 to-[#4BBCCC]/5 border border-[#4BBCCC]/20 rounded-2xl p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0B3D5E]/60 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#4BBCCC] rounded-full inline-block" />
                Live Preview — How guests will see it
              </p>
              <div className="max-w-xs">
                <PreviewCard
                  label="Standard Booking"
                  pax="All bookings"
                  pickup={parseFloat(form.pickupPrice || "0").toFixed(2)}
                  drop={parseFloat(form.dropPrice || "0").toFixed(2)}
                />
              </div>
            </div>

            {/* ── Last Updated Info ── */}
            {pricing?.updatedAt && (
              <p className="text-center text-[11px] text-muted-foreground/60 pb-2">
                Last updated: {new Date(pricing.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
