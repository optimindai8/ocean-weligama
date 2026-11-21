import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Check, Minus, Star, Layers, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Save, Loader2, Edit2
} from 'lucide-react';
import { useListServices, useGetSetting, useAdminUpdateSetting, useAdminUpdateService, type Service } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Package Color Schemes ─────────────────────────────────────────────────── */
const POPULAR_SCHEME = {
  gradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FCD34D]',
  headerGrad: 'from-[#0B3D5E] to-[#124E78]',
  lightBg: 'bg-[#FBBF24]/15',
  accentBorder: 'border-[#FBBF24]',
  accentText: 'text-[#0B3D5E]',
  checkBg: 'bg-[#FBBF24]/20',
  checkText: 'text-[#0B3D5E]',
  pillBg: 'bg-[#FBBF24]',
};

const DEFAULT_SCHEME = {
  gradient: 'from-[#0B3D5E] to-[#164e63]',
  headerGrad: 'from-[#0B3D5E] to-[#0A324E]',
  lightBg: 'bg-slate-100',
  accentBorder: 'border-slate-200',
  accentText: 'text-[#0B3D5E]',
  checkBg: 'bg-[#0B3D5E]/10',
  checkText: 'text-[#0B3D5E]',
  pillBg: 'bg-[#0B3D5E]',
};

const COLOR_SCHEMES = [DEFAULT_SCHEME, POPULAR_SCHEME, DEFAULT_SCHEME, DEFAULT_SCHEME];

function CellValue({
  val,
  pkg,
  mini = false,
}: {
  val: boolean | string;
  pkg: any;
  mini?: boolean;
}) {
  const isPopular = pkg?.popular;

  if (typeof val === 'boolean') {
    if (val) {
      return (
        <div className="flex justify-center">
          <div
            className={`transition-transform duration-200 ${mini ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center shadow-sm ${
              isPopular
                ? 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FBBF24] text-[#0B3D5E] shadow-[0_2px_8px_rgba(251,191,36,0.35)]'
                : 'bg-[#0B3D5E]/10 border border-[#0B3D5E]/20 text-[#0B3D5E]'
            }`}
          >
            <Check size={mini ? 12 : 15} className="text-[#0B3D5E]" strokeWidth={isPopular ? 3 : 2.5} />
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-center">
        <div className={`${mini ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-slate-100/80 flex items-center justify-center`}>
          <Minus size={mini ? 12 : 14} className="text-slate-300" strokeWidth={2} />
        </div>
      </div>
    );
  }
  return (
    <span
      className={`inline-block font-bold transition-transform duration-200 ${mini ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1.5'} rounded-lg shadow-sm border ${
        isPopular
          ? 'bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] text-[#0B3D5E] border-[#FBBF24] font-black shadow-[0_2px_6px_rgba(251,191,36,0.25)]'
          : 'bg-slate-100 text-[#0B3D5E] border-slate-200/80 font-bold'
      }`}
    >
      {val}
    </span>
  );
}

/* ─── Motion Variants for Section Header ───────────────────────────────────── */
const compareBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const packageWordsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
};

const packageWordItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -45,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const compareDescVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      delay: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const trustContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const trustBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function PackageComparisonTable({ isEditable = false }: { isEditable?: boolean }) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [selectedMobileCard, setSelectedMobileCard] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [localPackages, setLocalPackages] = useState<any[]>([]);
  const [localFeatures, setLocalFeatures] = useState<string[]>([]);

  const { data: rawServices, isLoading: isLoadingServices, refetch: refetchServices } = useListServices();
  const { data: settingsData, refetch: refetchSettings } = useGetSetting('package_comparison_features');

  const updateSettingMutation = useAdminUpdateSetting();
  const updateServiceMutation = useAdminUpdateService();

  useEffect(() => {
    if (!rawServices) return;
    
    // 1. Process Packages
    const active = (rawServices as Service[])
      .filter(s => s.type === "main" && s.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((s) => ({
        ...s,
        emoji: s.iconEmoji || '🏄',
        subtitle: s.category || 'Premium',
        tag: s.comparisonLabel || (s.isFeatured ? 'Most Popular' : 'Curated'),
        popular: s.isFeatured,
        scheme: s.isFeatured ? POPULAR_SCHEME : DEFAULT_SCHEME
      }));
    
    // 2. Process Features
    const allHighlights = new Set<string>();
    active.forEach(pkg => {
      (pkg.highlights || []).forEach((h: string) => allHighlights.add(h));
    });
    const uniqueHighlights = Array.from(allHighlights);

    // 3. Merge with saved order
    let finalFeatures = uniqueHighlights;
    const rawValue = settingsData?.value;
    const savedOrder = Array.isArray(rawValue) ? (rawValue as unknown as string[]) : null;
    if (savedOrder) {
      const orderedExisting = savedOrder.filter(f => uniqueHighlights.includes(f));
      const newFeatures = uniqueHighlights.filter(f => !savedOrder.includes(f));
      finalFeatures = [...orderedExisting, ...newFeatures];
    }
    
    setLocalPackages(active);
    setLocalFeatures(finalFeatures);
    setHasChanges(false);
  }, [rawServices, settingsData]);

  if (isLoadingServices) {
    return <div className="py-24 text-center text-slate-500 font-bold">Loading comparison...</div>;
  }

  if (localPackages.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-2xl font-serif text-[#0B3D5E] mb-2">No Packages Available</h3>
        <p className="text-slate-500">Check back later for our exclusive retreat packages.</p>
      </div>
    );
  }

  // --- Sorting Handlers ---
  const handleMoveColLeft = (idx: number) => {
    if (idx === 0) return;
    const newPkgs = [...localPackages];
    [newPkgs[idx - 1], newPkgs[idx]] = [newPkgs[idx], newPkgs[idx - 1]];
    setLocalPackages(newPkgs.map((p) => ({ ...p, scheme: p.popular ? POPULAR_SCHEME : DEFAULT_SCHEME })));
    setHasChanges(true);
  };

  const handleMoveColRight = (idx: number) => {
    if (idx === localPackages.length - 1) return;
    const newPkgs = [...localPackages];
    [newPkgs[idx], newPkgs[idx + 1]] = [newPkgs[idx + 1], newPkgs[idx]];
    setLocalPackages(newPkgs.map((p) => ({ ...p, scheme: p.popular ? POPULAR_SCHEME : DEFAULT_SCHEME })));
    setHasChanges(true);
  };

  const handleMoveRowUp = (idx: number) => {
    if (idx === 0) return;
    const newFeats = [...localFeatures];
    [newFeats[idx - 1], newFeats[idx]] = [newFeats[idx], newFeats[idx - 1]];
    setLocalFeatures(newFeats);
    setHasChanges(true);
  };

  const handleMoveRowDown = (idx: number) => {
    if (idx === localFeatures.length - 1) return;
    const newFeats = [...localFeatures];
    [newFeats[idx], newFeats[idx + 1]] = [newFeats[idx + 1], newFeats[idx]];
    setLocalFeatures(newFeats);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await updateSettingMutation.mutateAsync({
        key: 'package_comparison_features',
        data: { value: localFeatures as unknown as Record<string, unknown> }
      });

      const promises = localPackages.map((pkg, idx) => 
        updateServiceMutation.mutateAsync({
          id: pkg.id,
          data: { sortOrder: idx }
        })
      );
      await Promise.all(promises);

      toast.success("Order saved successfully!");
      setHasChanges(false);
      setEditMode(false);
      refetchServices();
      refetchSettings();
    } catch (error) {
      toast.error("Failed to save order");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={isEditable
      ? 'w-full py-10 px-8'
      : 'w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8'
    }>
      {/* ── Admin Edit Controls ──────────────────────────────────────────────────────── */}
      {isEditable ? (
        <>
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#0B3D5E]">Table Order Configuration</h3>
              <p className="text-sm text-slate-500">Enable edit mode to arrange the comparison table packages and features.</p>
            </div>
            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => {
                    setEditMode(false);
                    refetchServices();
                    refetchSettings();
                  }}>
                    Cancel
                  </Button>
                  {hasChanges && (
                    <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700">
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Order
                    </Button>
                  )}
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Order
                </Button>
              )}
            </div>
          </div>

          {/* Admin Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 mb-4 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-[#0B3D5E]" />
              <span>Compare &amp; Choose</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] mb-4">
              Find Your Perfect Package
            </h2>
          </div>

          {/* Admin Table View */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="p-5 border-b border-slate-200 align-bottom sticky left-0 z-30 bg-white" style={{ width: `${Math.max(25, 100 - (localPackages.length * 25))}%` }}>
                    <h3 className="text-lg font-serif font-black text-[#0B3D5E]">What's Included</h3>
                    <p className="text-xs text-slate-400 font-medium">Use arrows in edit mode to reorder</p>
                  </th>
                  {localPackages.map((pkg, idx) => (
                    <th key={pkg.id} className="p-4 border-b border-slate-200 relative align-bottom" style={{ width: `${localPackages.length > 0 ? (Math.min(75, localPackages.length * 25) / localPackages.length) : 25}%` }}>
                      {editMode && (
                        <div className="absolute top-2 left-0 right-0 flex justify-center gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6" disabled={idx === 0} onClick={() => handleMoveColLeft(idx)}>
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-6 w-6" disabled={idx === localPackages.length - 1} onClick={() => handleMoveColRight(idx)}>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center space-y-2 mt-4">
                        <span className="text-3xl">{pkg.emoji}</span>
                        <h4 className="text-sm font-serif font-black text-[#0B3D5E]">{pkg.name}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{pkg.tag}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localFeatures.map((feat, itemIdx) => (
                  <tr key={feat} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 px-5 text-sm font-medium text-slate-700 sticky left-0 bg-white">
                      <div className="flex items-center gap-2">
                        {editMode && (
                          <div className="flex flex-col gap-1 shrink-0 mr-1">
                            <Button variant="ghost" size="icon" className="h-4 w-4" disabled={itemIdx === 0} onClick={() => handleMoveRowUp(itemIdx)}>
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-4 w-4" disabled={itemIdx === localFeatures.length - 1} onClick={() => handleMoveRowDown(itemIdx)}>
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <span>{feat}</span>
                      </div>
                    </td>
                    {localPackages.map((pkg, idx) => {
                      const val = (pkg.highlights || []).includes(feat) ? true : false;
                      return (
                        <td key={idx} className="py-3 px-4 text-center">
                          <CellValue val={val} pkg={pkg} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* ── Public Showcase View: Transparent Psychologically Attractive Box ── */
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-5 sm:p-8 md:p-10 lg:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(254,251,243,0.74) 45%, rgba(245,249,252,0.84) 100%)',
          }}
        >
          {/* Ambient shimmer sweep animation */}
          <motion.div
            className="absolute inset-0 w-[45%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-160%', '350%'] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Top golden hairline accent line */}
          <div
            className="absolute top-0 left-12 right-12 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
          />

          {/* Ambient corner radial warmth */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FBBF24]/16 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

          {/* ── Header ───────────────────────────────── */}
          <div className="text-center mb-10 sm:mb-14 relative z-10">
            {/* Pill Badge - Comes from right side */}
            <motion.div
              variants={compareBadgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-3.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
              <Layers className="w-3.5 h-3.5 text-[#0B3D5E]" />
              <span>Compare &amp; Choose</span>
            </motion.div>

            {/* Headline - Words come one by one from left side */}
            <motion.h2
              variants={packageWordsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] mb-3 leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            >
              <motion.span variants={packageWordItemVariants} className="inline-block">
                Find
              </motion.span>
              <motion.span variants={packageWordItemVariants} className="inline-block">
                Your
              </motion.span>
              <motion.span variants={packageWordItemVariants} className="inline-block">
                Perfect
              </motion.span>
              <motion.span
                variants={packageWordItemVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
              >
                Package
              </motion.span>
            </motion.h2>

            {/* Subtle Golden Accent Flourish */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mb-4"
            />

            {/* Description - Comes from right side */}
            <motion.p
              variants={compareDescVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              All packages include premium accommodation, daily meals, and
              the Ocean Air experience. Pick the one that matches your vibe.
            </motion.p>
          </div>

          {/* ── Mobile: Card View (Cascades in from Up) ───────────────────────── */}
          <div className="block lg:hidden space-y-6 relative z-10">
            {localPackages.map((pkg, pkgIdx) => {
              const isSelected = selectedMobileCard === pkg.id;
              return (
                <motion.div
                  key={pkg.id}
                  onClick={() => setSelectedMobileCard((prev) => (prev === pkg.id ? null : pkg.id))}
                  variants={{
                    hidden: { opacity: 0, y: -50, scale: 0.96, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1, 
                      transition: { 
                        delay: 0.2 + pkgIdx * 0.16, 
                        duration: 0.75, 
                        ease: [0.16, 1, 0.3, 1] 
                      } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  className={`relative rounded-3xl border overflow-hidden shadow-xl backdrop-blur-xl cursor-pointer select-none transition-all duration-300 active:scale-[0.99] ${
                    pkg.popular || isSelected
                      ? 'border-[#FBBF24] shadow-[0_18px_45px_rgba(251,191,36,0.25)] ring-2 ring-[#FBBF24]/50'
                      : 'border-white/80 shadow-md hover:border-[#FBBF24]/40'
                  }`}
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.85) 100%)' }}
                >
                  {/* Gradient Header */}
                  <div className={`relative bg-gradient-to-br ${pkg.popular ? 'from-[#0B3D5E] via-[#0B3D5E] to-[#124E78]' : 'from-[#0B3D5E] to-[#0A324E]'} px-6 py-8 text-white overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <path d="M0,50 C40,20 80,80 120,50 C160,20 180,70 200,50 L200,100 L0,100 Z" fill="white"/>
                      </svg>
                    </div>
                    {pkg.popular && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] text-[10px] font-black uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-[#F59E0B]/30">
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                      </div>
                    )}
                    <span className="text-4xl mb-3 block relative z-10">{pkg.emoji}</span>
                    <h3 className="text-xl font-serif font-black mb-1 relative z-10">{pkg.name}</h3>
                    <div className={`inline-flex items-center gap-1.5 mt-3 ${pkg.popular ? 'bg-[#FBBF24]/25 text-[#0B3D5E] border-[#FBBF24]/50 font-black' : 'bg-white/15 text-white border-white/20 font-bold'} px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border relative z-10`}>
                      <Star className="w-3 h-3 fill-current" /> {pkg.tag}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-5 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100/80">
                        <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#0B3D5E]">
                          <Layers className="w-3.5 h-3.5 text-[#0B3D5E]" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Package Inclusions
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {localFeatures.map(feat => {
                          const val = (pkg.highlights || []).includes(feat) ? true : false;
                          return (
                            <div key={feat} className="flex items-center justify-between py-1 px-1">
                              <span className="text-sm flex-1 pr-3 text-slate-600 font-medium">
                                {feat}
                              </span>
                              <div className="shrink-0 pointer-events-none">
                                <CellValue val={val} pkg={pkg} mini />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Desktop: Table View (Enters from Left side) ──────────────────── */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -80, scale: 0.98, transition: { duration: 0.2 } },
              visible: { 
                opacity: 1, 
                x: 0, 
                scale: 1, 
                transition: { delay: 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="hidden lg:block overflow-hidden rounded-[2rem] sm:rounded-[2.4rem] border border-white/85 shadow-[0_15px_40px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.15)] bg-white/85 backdrop-blur-xl relative z-10"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.85) 100%)' }}
          >
            <table 
              className="w-full text-left border-collapse table-fixed"
              onMouseLeave={() => setHoveredCol(null)}
            >
              {/* Table Header */}
              <thead>
                <tr>
                  <th 
                    className="p-5 lg:p-7 pb-8 border-b border-slate-100/80 align-bottom sticky left-0 z-30 bg-white/95 backdrop-blur-md"
                    style={{ width: `${Math.max(25, 100 - (localPackages.length * 25))}%` }}
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FBBF24]/15 border border-[#FBBF24]/35 text-[10px] font-black uppercase tracking-wider text-[#0B3D5E]">
                        <Star className="w-2.5 h-2.5 fill-[#FBBF24] text-[#D97706]" />
                        <span>All-Inclusive</span>
                      </div>
                      <h3 className="text-lg lg:text-xl font-serif font-black text-[#0B3D5E]">What's Included</h3>
                      <p className="text-xs text-slate-400 font-medium">Click or hover a column to explore</p>
                    </div>
                  </th>

                  {localPackages.map((pkg, idx) => {
                    const isHovered = hoveredCol === idx;
                    return (
                      <th
                        key={pkg.id}
                        className={`p-4 sm:p-5 lg:p-6 pb-8 border-b border-slate-100/80 relative transition-colors duration-200 align-bottom cursor-pointer select-none
                          ${pkg.popular ? 'border-t-4 border-t-[#FBBF24]' : (isHovered ? 'border-t-4 border-t-[#FBBF24]' : 'border-t-4 border-t-transparent')}
                        `}
                        style={{
                          width: `${localPackages.length > 0 ? (Math.min(75, localPackages.length * 25) / localPackages.length) : 25}%`,
                          background: pkg.popular
                            ? (isHovered
                                ? 'linear-gradient(180deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 100%)'
                                : 'linear-gradient(180deg, rgba(251,191,36,0.10) 0%, rgba(251,191,36,0.02) 100%)')
                            : (isHovered
                                ? 'linear-gradient(180deg, rgba(251,191,36,0.08) 0%, rgba(248,250,252,0.95) 100%)'
                                : 'transparent')
                        }}
                        onMouseEnter={() => {
                          setHoveredCol((current) => (current === idx ? current : idx));
                        }}
                        onClick={() => {
                          setHoveredCol((current) => (current === idx ? null : idx));
                        }}
                      >
                        {/* Golden bottom accent bar on active/hovered column (zero layout shift) */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent transition-opacity duration-300 pointer-events-none ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                        />

                        {/* Package Column Header - Cascades from Up one by one */}
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: -45, transition: { duration: 0.2 } },
                            visible: { 
                              opacity: 1, 
                              y: 0, 
                              transition: { 
                                delay: 0.35 + idx * 0.15, 
                                duration: 0.7, 
                                ease: [0.16, 1, 0.3, 1] 
                              } 
                            }
                          }}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false }}
                          className="flex flex-col items-center text-center space-y-2 relative z-10 pointer-events-none"
                        >
                          {pkg.popular && (
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_4px_14px_rgba(251,191,36,0.4)] uppercase tracking-[0.18em] mb-1 mt-2 border border-[#F59E0B]/30">
                              <Star className="w-3 h-3 fill-current" /> Most Popular
                            </div>
                          )}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border transition-all duration-300 mt-2 ${
                            pkg.popular 
                              ? 'bg-[#FBBF24]/20 border-[#FBBF24]/60 shadow-[0_4px_12px_rgba(251,191,36,0.25)]' 
                              : (isHovered ? 'bg-[#FBBF24]/15 border-[#FBBF24]/50 scale-105 shadow-[0_4px_14px_rgba(251,191,36,0.2)]' : 'bg-slate-50 border-slate-100')
                          }`}>
                            <span>{pkg.emoji}</span>
                          </div>
                          <div className={`w-12 h-1 rounded-full transition-colors duration-300 ${pkg.popular || isHovered ? 'bg-[#FBBF24]' : 'bg-[#0B3D5E]/20'}`} />
                          <h4 className="text-[13px] sm:text-[14px] lg:text-[15px] font-serif font-black text-[#0B3D5E] leading-tight px-1">{pkg.name}</h4>

                          <div className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-colors duration-300 ${
                            pkg.popular || isHovered ? 'bg-[#FBBF24]/25 text-[#0B3D5E] border-[#FBBF24]/50 font-black' : 'bg-slate-100 text-slate-600 border-slate-200/80'
                          }`}>
                            <Star className="w-3 h-3 fill-current" /> {pkg.tag}
                          </div>
                        </motion.div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body - Details cascade in from Up */}
              <tbody>
                <motion.tr
                  variants={{
                    hidden: { opacity: 0, y: -25, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { delay: 0.38, duration: 0.55, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                >
                  <td colSpan={localPackages.length + 1} className="py-3.5 px-6 border-y border-[#FBBF24]/20 bg-gradient-to-r from-[#FFFBEB]/90 via-white/95 to-[#FFFBEB]/90 sticky left-0 z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/25 border border-[#FBBF24]/50 flex items-center justify-center text-[#0B3D5E] shadow-sm">
                        <Layers className="w-3.5 h-3.5 text-[#0B3D5E]" />
                      </div>
                      <span className="text-[11px] font-black text-[#0B3D5E] uppercase tracking-[0.2em]">
                        Package Inclusions &amp; Amenities
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#FBBF24]/30 to-transparent" />
                    </div>
                  </td>
                </motion.tr>

                {localFeatures.map((feat, itemIdx) => (
                  <motion.tr
                    key={feat}
                    variants={{
                      hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        transition: { 
                          delay: 0.45 + itemIdx * 0.035, 
                          duration: 0.5, 
                          ease: [0.16, 1, 0.3, 1] 
                        } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="border-b border-slate-100/80 last:border-b-0 transition-colors duration-200 group"
                    style={{ background: itemIdx % 2 === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(254,252,246,0.65)' }}
                  >
                    <td 
                      className="py-4 px-5 lg:px-7 text-sm font-serif sticky left-0 transition-colors duration-200 z-20 shadow-[1px_0_0_0_rgba(226,232,240,0.8)] text-slate-700 font-medium bg-white/95 backdrop-blur-md"
                      style={{ width: `${Math.max(25, 100 - (localPackages.length * 25))}%` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="leading-snug">{feat}</span>
                      </div>
                    </td>

                    {localPackages.map((pkg, idx) => {
                      const val = (pkg.highlights || []).includes(feat) ? true : false;
                      const isHovered = hoveredCol === idx;
                      return (
                        <td
                          key={idx}
                          className="py-4 px-3 sm:px-4 text-sm text-center transition-colors duration-200 cursor-pointer select-none relative"
                          style={{
                            width: `${localPackages.length > 0 ? (Math.min(75, localPackages.length * 25) / localPackages.length) : 25}%`,
                            background: isHovered
                              ? (pkg.popular ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.05)')
                              : (pkg.popular ? 'rgba(251, 191, 36, 0.04)' : 'transparent')
                          }}
                          onMouseEnter={() => {
                            setHoveredCol((current) => (current === idx ? current : idx));
                          }}
                          onClick={() => {
                            setHoveredCol((current) => (current === idx ? null : idx));
                          }}
                        >
                          <div className="pointer-events-none">
                            <CellValue val={val} pkg={pkg} />
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ── Trust Badges (Cards arrive one by one from left side to right side) ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200/50 relative z-10">
            {[
              { text: 'Secure Booking' },
              { text: 'Direct WhatsApp Support' },
              { text: 'Customizable Add-ons' },
              { text: 'Flexible Cancellation' },
              { text: 'ISA Certified Surf Coaches' },
            ].map((badge, idx) => (
              <motion.div
                key={badge.text}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: -65,
                    transition: {
                      duration: 0.25,
                      ease: "easeOut",
                    },
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.08 + idx * 0.12,
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                style={{ willChange: "transform, opacity" }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 text-xs font-bold cursor-default px-4 py-2 rounded-full border border-white/90 bg-white/85 text-slate-700 hover:text-[#0B3D5E] hover:border-[#FBBF24] hover:shadow-[0_4px_16px_rgba(251,191,36,0.2)] hover:bg-white transition-colors duration-200 shadow-sm backdrop-blur-sm"
              >
                <div className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.8)] shrink-0" />
                <span>{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
