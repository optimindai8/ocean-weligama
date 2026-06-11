import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check, Minus, Star, Sparkles, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Save, Loader2, Edit2
} from 'lucide-react';
import { useListServices, useGetSetting, useAdminUpdateSetting, useAdminUpdateService, type Service } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ─── Package Color Schemes ─────────────────────────────────────────────────── */
const COLOR_SCHEMES = [
  {
    gradient: 'from-[#1565C0] via-[#1976D2] to-[#42A5F5]',
    headerGrad: 'from-[#0D47A1] to-[#1976D2]',
    lightBg: 'bg-blue-50/70',
    accentBorder: 'border-blue-300',
    accentText: 'text-blue-700',
    checkBg: 'bg-blue-100',
    checkText: 'text-blue-700',
    pillBg: 'bg-blue-600',
  },
  {
    gradient: 'from-[#006064] via-[#00838F] to-[#26C6DA]',
    headerGrad: 'from-[#004D40] to-[#00838F]',
    lightBg: 'bg-teal-50/70',
    accentBorder: 'border-teal-300',
    accentText: 'text-teal-700',
    checkBg: 'bg-teal-100',
    checkText: 'text-teal-700',
    pillBg: 'bg-teal-600',
  },
  {
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#66BB6A]',
    headerGrad: 'from-[#1B5E20] to-[#388E3C]',
    lightBg: 'bg-green-50/70',
    accentBorder: 'border-green-300',
    accentText: 'text-green-700',
    checkBg: 'bg-green-100',
    checkText: 'text-green-700',
    pillBg: 'bg-green-600',
  },
  {
    gradient: 'from-[#E65100] via-[#EF6C00] to-[#FFA726]',
    headerGrad: 'from-[#E65100] to-[#F57C00]',
    lightBg: 'bg-orange-50/70',
    accentBorder: 'border-orange-300',
    accentText: 'text-orange-700',
    checkBg: 'bg-orange-100',
    checkText: 'text-orange-700',
    pillBg: 'bg-orange-600',
  }
];

function CellValue({
  val,
  pkg,
  mini = false,
}: {
  val: boolean | string;
  pkg: any;
  mini?: boolean;
}) {
  if (typeof val === 'boolean') {
    if (val) {
      return (
        <motion.div
          className="flex justify-center"
          whileHover={{ scale: 1.25 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <div
            className={`${mini ? 'w-6 h-6' : 'w-8 h-8'} rounded-full ${pkg.scheme.checkBg} flex items-center justify-center shadow-sm`}
          >
            <Check size={mini ? 12 : 15} className={pkg.scheme.checkText} strokeWidth={3} />
          </div>
        </motion.div>
      );
    }
    return (
      <div className="flex justify-center">
        <div className={`${mini ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-slate-100 flex items-center justify-center`}>
          <Minus size={mini ? 12 : 14} className="text-slate-300" strokeWidth={2} />
        </div>
      </div>
    );
  }
  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      className={`inline-block font-bold ${mini ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1.5'} rounded-lg ${pkg.scheme.lightBg} ${pkg.scheme.accentText} shadow-sm border ${pkg.scheme.accentBorder}/30`}
    >
      {val}
    </motion.span>
  );
}

export function PackageComparisonTable({ isEditable = false }: { isEditable?: boolean }) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
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
      .map((s, idx) => ({
        ...s,
        emoji: s.iconEmoji || '🏄',
        subtitle: s.category || 'Premium',
        tag: s.comparisonLabel || (s.isFeatured ? 'Most Popular' : 'Premium'),
        popular: s.isFeatured,
        scheme: COLOR_SCHEMES[idx % COLOR_SCHEMES.length]
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
    setLocalPackages(newPkgs.map((p, i) => ({ ...p, scheme: COLOR_SCHEMES[i % COLOR_SCHEMES.length] })));
    setHasChanges(true);
  };

  const handleMoveColRight = (idx: number) => {
    if (idx === localPackages.length - 1) return;
    const newPkgs = [...localPackages];
    [newPkgs[idx], newPkgs[idx + 1]] = [newPkgs[idx + 1], newPkgs[idx]];
    setLocalPackages(newPkgs.map((p, i) => ({ ...p, scheme: COLOR_SCHEMES[i % COLOR_SCHEMES.length] })));
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
      : 'w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8'
    }>
      {/* ── Admin Edit Controls ──────────────────────────────────────────────────────── */}
      {isEditable && (
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
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="inline-flex items-center gap-2 bg-[#0B3D5E]/8 px-5 py-2 rounded-full mb-5 border border-[#0B3D5E]/10"
        >
          <Sparkles className="w-4 h-4 text-[#4BBCCC]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
            Compare &amp; Choose
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif font-bold text-[#0B3D5E] mb-4 leading-tight"
        >
          Find Your Perfect{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] to-[#0B3D5E]">
            Package
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          All packages include premium accommodation, daily meals, and
          the Ocean Air experience. Pick the one that matches your vibe.
        </motion.p>
      </div>

      {/* ── Mobile: Card View ────────────────────────────────────────────── */}
      <div className="block lg:hidden space-y-6">
        {localPackages.map((pkg, pkgIdx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: pkgIdx * 0.12 }}
            className={`relative bg-white rounded-3xl border-2 overflow-hidden shadow-xl ${
              pkg.popular ? 'border-teal-400 shadow-teal-100/60' : 'border-slate-100'
            }`}
          >
            {/* Gradient Header */}
            <div className={`relative bg-gradient-to-br ${pkg.scheme.headerGrad} px-6 py-8 text-white overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <path d="M0,50 C40,20 80,80 120,50 C160,20 180,70 200,50 L200,100 L0,100 Z" fill="white"/>
                </svg>
              </div>
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Most Popular
                </div>
              )}
              <span className="text-4xl mb-3 block relative z-10">{pkg.emoji}</span>
              <h3 className="text-xl font-serif font-bold mb-1 relative z-10">{pkg.name}</h3>
              <p className="text-white/80 text-xs font-medium relative z-10 uppercase tracking-widest">{pkg.subtitle}</p>
              <div className={`inline-flex items-center gap-1.5 mt-3 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20 relative z-10`}>
                <Star className="w-3 h-3" /> {pkg.tag}
              </div>
            </div>

            {/* Features */}
            <div className="p-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-[#0B3D5E]/5 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-[#0B3D5E]" />
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
                        <span className={`text-sm flex-1 pr-3 text-slate-600`}>
                          {feat}
                        </span>
                        <div className="shrink-0">
                          <CellValue val={val} pkg={pkg} mini />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: Table View ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className={isEditable
          ? 'hidden lg:block overflow-x-auto'
          : 'hidden lg:block overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] overflow-x-auto'
        }
      >
        <table className={`w-full text-left border-collapse ${isEditable ? 'table-fixed' : 'min-w-max'}`}>
          {/* Table Header */}
          <thead>
            <tr>
              <th className={`p-6 pb-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 align-bottom sticky left-0 z-30 ${isEditable ? 'w-[28%]' : 'w-1/4'}`}>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#0B3D5E]">What's Included</h3>
                  <p className="text-xs text-slate-400 font-medium">{isEditable ? 'Use arrows in edit mode to reorder' : 'Hover a column to explore'}</p>
                </div>
              </th>

              {localPackages.map((pkg, idx) => (
                <th
                  key={pkg.id}
                  className={`p-6 pb-8 border-b relative transition-all duration-500 ease-out align-bottom cursor-pointer ${isEditable ? 'min-w-[220px]' : 'min-w-[200px]'}
                    ${hoveredCol === idx && !editMode ? `${pkg.scheme.lightBg} border-b-2 ${pkg.scheme.accentBorder}` : 'bg-white border-slate-100'}
                    ${pkg.popular ? 'border-t-4 border-t-teal-400' : ''}
                  `}
                  onMouseEnter={() => !editMode && setHoveredCol(idx)}
                  onMouseLeave={() => !editMode && setHoveredCol(null)}
                >
                  {pkg.popular && hoveredCol === idx && !editMode && (
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 to-transparent pointer-events-none rounded-t-none" />
                  )}

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

                  <motion.div
                    className="flex flex-col items-center text-center space-y-2 relative z-10"
                    animate={{ y: hoveredCol === idx && !editMode ? -5 : 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    {pkg.popular && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`flex items-center gap-1.5 bg-gradient-to-r ${pkg.scheme.gradient} text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-teal-200/50 uppercase tracking-[0.15em] mb-1 mt-6`}
                      >
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                      </motion.div>
                    )}
                    <span className="text-3xl mt-4">{pkg.emoji}</span>
                    <div className={`w-14 h-1 rounded-full bg-gradient-to-r ${pkg.scheme.gradient} opacity-80`} />
                    <h4 className="text-[14px] font-serif font-bold text-[#0B3D5E] leading-tight">{pkg.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pkg.subtitle}</span>

                    <div className={`inline-flex items-center gap-1 ${pkg.scheme.checkBg} ${pkg.scheme.accentText} text-[9px] font-bold px-2.5 py-1 rounded-full`}>
                      <Star className="w-3 h-3" /> {pkg.tag}
                    </div>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            <tr>
              <td colSpan={localPackages.length + 1} className="bg-gradient-to-r from-slate-50 to-white py-4 px-6 border-b border-t border-slate-100/80 sticky left-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0B3D5E]/8 flex items-center justify-center shadow-sm">
                    <Star className="w-4 h-4 text-[#0B3D5E]" />
                  </div>
                  <span className="text-[11px] font-black text-[#0B3D5E] uppercase tracking-[0.18em]">
                    Package Inclusions
                  </span>
                </div>
              </td>
            </tr>

            {localFeatures.map((feat, itemIdx) => (
              <motion.tr
                key={feat}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10px" }}
                className={`border-b border-slate-50 last:border-slate-100 transition-colors duration-200 hover:bg-slate-50 group`}
              >
                <td className={`py-5 px-8 text-sm font-serif sticky left-0 bg-white group-hover:bg-slate-50 transition-colors duration-200 z-20 shadow-[1px_0_0_0_#e2e8f0] text-slate-600 font-medium ${isEditable ? 'w-[28%]' : ''}`}>
                  <div className="flex items-center gap-3">
                    {editMode && (
                      <div className="flex flex-col gap-1 shrink-0 mr-2">
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
                    <td
                      key={idx}
                      className={`${isEditable ? 'py-5 px-8' : 'py-4 px-6'} text-sm text-center transition-all duration-500 ease-out ${
                        hoveredCol === idx && !editMode ? pkg.scheme.lightBg : ''
                      }`}
                      onMouseEnter={() => !editMode && setHoveredCol(idx)}
                      onMouseLeave={() => !editMode && setHoveredCol(null)}
                    >
                      <CellValue val={val} pkg={pkg} />
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── Trust Badges ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-5 mt-4 pb-12 text-slate-400"
      >
        {[
          { icon: '🛡️', text: 'Secure Booking' },
          { icon: '💬', text: 'WhatsApp Support' },
          { icon: '✨', text: 'Customizable Add-ons' },
          { icon: '🔄', text: 'Flexible Cancellation' },
          { icon: '🏆', text: 'ISA Certified Instructors' },
        ].map(badge => (
          <motion.div
            key={badge.text}
            whileHover={{ scale: 1.08, color: '#0B3D5E' }}
            className="flex items-center gap-2 text-xs font-semibold cursor-default transition-colors duration-200"
          >
            <span className="text-base">{badge.icon}</span>
            <span>{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
