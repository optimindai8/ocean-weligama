import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Check, Minus, Star, Sparkles
} from 'lucide-react';
import { useListServices, type Service } from "@workspace/api-client-react";

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

export function PackageComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const { data: rawServices, isLoading } = useListServices();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  if (isLoading) {
    return <div className="py-24 text-center text-slate-500 font-bold">Loading comparison...</div>;
  }

  const activePackages = (rawServices as Service[] || [])
    .filter(s => s.type === "main" && s.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((s, idx) => ({
      ...s,
      emoji: s.iconEmoji || '🏄',
      subtitle: s.category || 'Premium',
      tag: s.isFeatured ? 'Most Popular' : 'Premium',
      popular: s.isFeatured,
      scheme: COLOR_SCHEMES[idx % COLOR_SCHEMES.length]
    }));

  if (activePackages.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-2xl font-serif text-[#0B3D5E] mb-2">No Packages Available</h3>
        <p className="text-slate-500">Check back later for our exclusive retreat packages.</p>
      </div>
    );
  }

  // Extract unique highlights dynamically
  const allHighlights = new Set<string>();
  activePackages.forEach(pkg => {
    (pkg.highlights || []).forEach(h => allHighlights.add(h));
  });
  const uniqueHighlights = Array.from(allHighlights);

  const features = uniqueHighlights.length > 0 ? [
    {
      category: 'Package Inclusions',
      icon: Star,
      items: uniqueHighlights.map(h => ({
        name: h,
        highlight: false,
        values: activePackages.map(pkg => (pkg.highlights || []).includes(h) ? true : false)
      }))
    }
  ] : [];

  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="inline-flex items-center gap-2 bg-[#0B3D5E]/8 px-5 py-2 rounded-full mb-5 border border-[#0B3D5E]/10"
        >
          <Sparkles className="w-4 h-4 text-[#4BBCCC]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
            Compare &amp; Choose
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          All packages include premium accommodation, daily meals, and
          the Ocean Air experience. Pick the one that matches your vibe.
        </motion.p>
      </div>

      {/* ── Mobile: Card View ────────────────────────────────────────────── */}
      <div className="block lg:hidden space-y-6">
        {activePackages.map((pkg, pkgIdx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: pkgIdx * 0.12 }}
            className={`relative bg-white rounded-3xl border-2 overflow-hidden shadow-xl ${
              pkg.popular ? 'border-teal-400 shadow-teal-100/60' : 'border-slate-100'
            }`}
          >
            {/* Gradient Header */}
            <div className={`relative bg-gradient-to-br ${pkg.scheme.headerGrad} px-6 py-8 text-white overflow-hidden`}>
              {/* Background wave pattern */}
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
              <h3 className="text-xl font-bold mb-1 relative z-10">{pkg.name}</h3>
              <p className="text-white/80 text-sm font-medium relative z-10">{pkg.subtitle}</p>

              <div className={`inline-flex items-center gap-1.5 mt-3 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20 relative z-10`}>
                <Star className="w-3 h-3" /> {pkg.tag}
              </div>
            </div>

            {/* Features */}
            <div className="p-5 space-y-5">
              {features.map(section => (
                <div key={section.category}>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-[#0B3D5E]/5 flex items-center justify-center">
                      <section.icon className="w-3.5 h-3.5 text-[#0B3D5E]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {section.category}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {section.items.map(item => {
                      const val = item.values[pkgIdx];
                      return (
                        <div key={item.name} className="flex items-center justify-between py-1 px-1">
                          <span className={`text-sm flex-1 pr-3 ${item.highlight ? 'font-semibold text-[#0B3D5E]' : 'text-slate-600'}`}>
                            {item.name}
                          </span>
                          <div className="shrink-0">
                            <CellValue val={val} pkg={pkg} mini />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: Table View ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="hidden lg:block overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] overflow-x-auto"
      >
        <table className="w-full min-w-max text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr>
              <th className="p-6 pb-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 w-1/4 align-bottom sticky left-0 z-20">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#0B3D5E]">What's Included</h3>
                  <p className="text-xs text-slate-400 font-medium">Hover a column to explore</p>
                </div>
              </th>

              {activePackages.map((pkg, idx) => (
                <th
                  key={pkg.id}
                  className={`p-6 pb-8 border-b min-w-[200px] relative transition-all duration-500 ease-out align-bottom cursor-pointer
                    ${hoveredCol === idx ? `${pkg.scheme.lightBg} border-b-2 ${pkg.scheme.accentBorder}` : 'bg-white border-slate-100'}
                    ${pkg.popular ? 'border-t-4 border-t-teal-400' : ''}
                  `}
                  onMouseEnter={() => setHoveredCol(idx)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {pkg.popular && hoveredCol === idx && (
                    <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 to-transparent pointer-events-none rounded-t-none" />
                  )}

                  <motion.div
                    className="flex flex-col items-center text-center space-y-2 relative z-10"
                    animate={{ y: hoveredCol === idx ? -5 : 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    {pkg.popular && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`flex items-center gap-1.5 bg-gradient-to-r ${pkg.scheme.gradient} text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-teal-200/50 uppercase tracking-[0.15em] mb-1`}
                      >
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                      </motion.div>
                    )}
                    <span className="text-3xl">{pkg.emoji}</span>
                    <div className={`w-14 h-1 rounded-full bg-gradient-to-r ${pkg.scheme.gradient} opacity-80`} />
                    <h4 className="text-[15px] font-bold text-[#0B3D5E] leading-tight">{pkg.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pkg.subtitle}</span>

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
            {features.map((section, sectionIdx) => (
              <React.Fragment key={section.category}>
                <tr>
                  <td
                    colSpan={activePackages.length + 1}
                    className="bg-gradient-to-r from-slate-50/90 to-white py-4 px-6 border-b border-t border-slate-100/80 sticky left-0 z-10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#0B3D5E]/8 flex items-center justify-center shadow-sm">
                        <section.icon className="w-4 h-4 text-[#0B3D5E]" />
                      </div>
                      <span className="text-[11px] font-black text-[#0B3D5E] uppercase tracking-[0.18em]">
                        {section.category}
                      </span>
                    </div>
                  </td>
                </tr>

                {section.items.map((item, itemIdx) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + sectionIdx * 0.06 + itemIdx * 0.03 }}
                    className={`border-b border-slate-50 last:border-slate-100 transition-colors duration-200 ${
                      item.highlight ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50/50'
                    } group`}
                  >
                    <td className={`py-4 px-6 text-sm font-medium sticky left-0 bg-white group-hover:bg-slate-50/50 transition-colors duration-200 z-10 shadow-[1px_0_0_0_#e2e8f0] ${item.highlight ? 'text-[#0B3D5E] font-semibold' : 'text-slate-600'}`}>
                      {item.highlight && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4BBCCC] mr-2 mb-0.5" />
                      )}
                      {item.name}
                    </td>

                    {item.values.map((val, idx) => (
                      <td
                         key={idx}
                        className={`py-4 px-6 text-sm text-center transition-all duration-500 ease-out ${
                          hoveredCol === idx ? activePackages[idx].scheme.lightBg : ''
                        }`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <CellValue val={val} pkg={activePackages[idx]} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* ── Trust Badges ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
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
