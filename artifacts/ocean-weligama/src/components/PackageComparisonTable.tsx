import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Waves, Dumbbell, Coffee, Star, Gift, Users, Sparkles, ArrowRight } from 'lucide-react';

/* ─── Package Definitions ─────────────────────────────────────────────────── */
const packages = [
  {
    name: 'Surfer Starter Package',
    subtitle: 'Beginner',
    tag: 'Perfect Start',
    gradient: 'from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',
    lightBg: 'bg-blue-50/60',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-600',
    checkBg: 'bg-blue-100',
    checkText: 'text-blue-600',
    popular: false,
    emoji: '🏄',
  },
  {
    name: 'Surfer Advance Package',
    subtitle: 'Intermediate / Advanced',
    tag: 'Most Popular',
    gradient: 'from-[#0891B2] via-[#06B6D4] to-[#22D3EE]',
    lightBg: 'bg-cyan-50/60',
    accentBorder: 'border-cyan-200',
    accentText: 'text-cyan-600',
    checkBg: 'bg-cyan-100',
    checkText: 'text-cyan-600',
    popular: true,
    emoji: '🌊',
  },
  {
    name: 'Yoga & Surf Retreat',
    subtitle: 'All Levels',
    tag: 'Mind & Body',
    gradient: 'from-[#0D9488] via-[#14B8A6] to-[#2DD4BF]',
    lightBg: 'bg-teal-50/60',
    accentBorder: 'border-teal-200',
    accentText: 'text-teal-600',
    checkBg: 'bg-teal-100',
    checkText: 'text-teal-600',
    popular: false,
    emoji: '🧘',
  },
];

/* ─── Feature Categories ──────────────────────────────────────────────────── */
type FeatureValue = boolean | string;
interface FeatureItem {
  name: string;
  values: [FeatureValue, FeatureValue, FeatureValue];
}
interface FeatureSection {
  category: string;
  icon: React.ElementType;
  items: FeatureItem[];
}

const features: FeatureSection[] = [
  {
    category: 'Accommodation & Meals',
    icon: Coffee,
    items: [
      { name: '7 nights accommodation', values: [true, true, true] },
      { name: 'Daily breakfast', values: [true, true, true] },
      { name: 'Daily dinner', values: [true, true, true] },
    ],
  },
  {
    category: 'Surfing & Coaching',
    icon: Waves,
    items: [
      { name: 'Surf lessons', values: ['6 Lessons', '11 Lessons', 'Included'] },
      { name: 'Surf theory sessions', values: [true, 'Theory & Coaching', true] },
      { name: 'Local surf guidance & support', values: [true, false, false] },
    ],
  },
  {
    category: 'Yoga & Wellness',
    icon: Dumbbell,
    items: [
      { name: 'Yoga sessions', values: ['Complimentary 2 Daily', 'Complimentary 2 Daily', 'Daily Sessions'] },
      { name: 'Sunrise or sunset yoga experiences', values: [false, false, true] },
    ],
  },
  {
    category: 'Community & Activities',
    icon: Users,
    items: [
      { name: 'Social activities & community events', values: [true, true, false] },
      { name: 'Social activities & wellness gatherings', values: [false, false, true] },
    ],
  },
  {
    category: 'Free Inclusions',
    icon: Gift,
    items: [
      { name: 'Free water bottles during the stay', values: [true, true, true] },
      { name: 'Free surfboard use during the stay', values: [true, true, true] },
      { name: 'Free Ocean Air surf jersey', values: [true, true, true] },
    ],
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export function PackageComparisonTable() {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (category: string) => {
    setExpandedSection(prev => (prev === category ? null : category));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-[#0B3D5E]/5 px-5 py-2 rounded-full mb-5"
        >
          <Sparkles className="w-4 h-4 text-[#4BBCCC]" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
            Compare & Choose
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-serif font-bold text-[#0B3D5E] mb-4 leading-tight"
        >
          Find Your Perfect{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4BBCCC] to-[#0891B2]">
            Surf Package
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
        >
          Every package includes premium accommodation, daily meals, and the Ocean Weligama experience.
          Pick the one that matches your vibe.
        </motion.p>
      </div>

      {/* ── Mobile: Card View ──────────────────────────────────── */}
      <div className="block lg:hidden space-y-6">
        {packages.map((pkg, pkgIdx) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: pkgIdx * 0.1 }}
            className={`relative bg-white rounded-3xl border-2 overflow-hidden shadow-lg ${
              pkg.popular ? 'border-cyan-300 shadow-cyan-100/50' : 'border-slate-100'
            }`}
          >
            {/* Package Header */}
            <div className={`relative bg-gradient-to-r ${pkg.gradient} px-6 py-8 text-white`}>
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/30">
                  ⭐ Most Popular
                </div>
              )}
              <span className="text-4xl mb-3 block">{pkg.emoji}</span>
              <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
              <p className="text-white/80 text-sm font-medium">{pkg.subtitle}</p>
            </div>

            {/* Features */}
            <div className="p-5">
              {features.map(section => (
                <div key={section.category} className="mb-4 last:mb-0">
                  <button
                    onClick={() => toggleSection(`${pkg.name}-${section.category}`)}
                    className="w-full flex items-center justify-between py-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {section.category}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedSection === `${pkg.name}-${section.category}` ? 180 : 0 }}
                      className="text-slate-400 text-xs"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {(expandedSection === `${pkg.name}-${section.category}` || expandedSection === null) && (
                      <motion.div
                        initial={expandedSection !== null ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {section.items.map(item => {
                          const val = item.values[pkgIdx];
                          return (
                            <div
                              key={item.name}
                              className="flex items-center justify-between py-2.5 px-1 border-b border-slate-50 last:border-0"
                            >
                              <span className="text-sm text-slate-600 flex-1 pr-3">{item.name}</span>
                              <div className="shrink-0">
                                {typeof val === 'boolean' ? (
                                  val ? (
                                    <div className={`w-6 h-6 rounded-full ${pkg.checkBg} flex items-center justify-center`}>
                                      <Check size={12} className={pkg.checkText} strokeWidth={3} />
                                    </div>
                                  ) : (
                                    <Minus size={16} className="text-slate-300" strokeWidth={2} />
                                  )
                                ) : (
                                  <span className={`text-xs font-bold ${pkg.accentText} bg-slate-50 px-2.5 py-1 rounded-lg`}>
                                    {val}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-5 pb-6">
              <a
                href="/book"
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${pkg.gradient} text-white rounded-xl py-3.5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              >
                Book This Package <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Desktop: Table View ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="hidden lg:block overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]"
      >
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr>
              <th className="p-6 pb-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 w-[28%] align-bottom">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#0B3D5E]">Features Included</h3>
                  <p className="text-xs text-slate-400 font-medium">Hover over a column to highlight</p>
                </div>
              </th>
              {packages.map((pkg, idx) => (
                <th
                  key={pkg.name}
                  className={`p-6 pb-8 border-b w-[24%] relative transition-all duration-500 ease-out align-bottom
                    ${hoveredCol === idx ? `${pkg.lightBg} ${pkg.accentBorder} border-b-2` : 'bg-white border-slate-100'}
                    ${pkg.popular ? 'border-t-4 border-t-cyan-400' : ''}
                  `}
                  onMouseEnter={() => setHoveredCol(idx)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <motion.div
                    className="flex flex-col items-center text-center space-y-2"
                    animate={{ y: hoveredCol === idx ? -4 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {pkg.popular && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-cyan-200/50 uppercase tracking-[0.15em] mb-1 flex items-center gap-1.5"
                      >
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                      </motion.div>
                    )}
                    <span className="text-3xl">{pkg.emoji}</span>
                    <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${pkg.gradient}`} />
                    <h4 className="text-base font-bold text-[#0B3D5E] leading-tight">{pkg.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pkg.subtitle}</span>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {features.map((section, sectionIdx) => (
              <React.Fragment key={section.category}>
                {/* Category Header Row */}
                <tr>
                  <td
                    colSpan={4}
                    className="bg-gradient-to-r from-slate-50/80 to-white py-4 px-6 border-b border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0B3D5E]/5 flex items-center justify-center">
                        <section.icon className="w-4 h-4 text-[#0B3D5E]" />
                      </div>
                      <span className="text-[11px] font-black text-[#0B3D5E] uppercase tracking-[0.15em]">
                        {section.category}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Feature Rows */}
                {section.items.map((item, itemIdx) => (
                  <motion.tr
                    key={item.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: sectionIdx * 0.08 + itemIdx * 0.04 }}
                    className="border-b border-slate-50 last:border-slate-100 group hover:bg-slate-50/40 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {item.name}
                    </td>
                    {item.values.map((val, idx) => (
                      <td
                        key={idx}
                        className={`py-4 px-6 text-sm text-center transition-all duration-500 ease-out ${
                          hoveredCol === idx ? packages[idx].lightBg : ''
                        }`}
                        onMouseEnter={() => setHoveredCol(idx)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {typeof val === 'boolean' ? (
                          val ? (
                            <motion.div
                              className="flex justify-center"
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <div
                                className={`w-7 h-7 rounded-full ${packages[idx].checkBg} flex items-center justify-center shadow-sm`}
                              >
                                <Check size={14} className={packages[idx].checkText} strokeWidth={3} />
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                                <Minus size={14} className="text-slate-300" strokeWidth={2} />
                              </div>
                            </div>
                          )
                        ) : (
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-block font-bold text-xs px-3 py-1.5 rounded-lg ${packages[idx].lightBg} ${packages[idx].accentText} shadow-sm`}
                          >
                            {val}
                          </motion.span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}

            {/* CTA Row */}
            <tr>
              <td className="p-6 bg-gradient-to-br from-slate-50 to-white" />
              {packages.map((pkg, idx) => (
                <td
                  key={pkg.name}
                  className={`p-6 text-center transition-all duration-500 ${
                    hoveredCol === idx ? pkg.lightBg : 'bg-white'
                  }`}
                  onMouseEnter={() => setHoveredCol(idx)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <motion.a
                    href="/book"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${pkg.gradient} text-white rounded-xl px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    Book Now <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* ── Bottom Trust Badges ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-6 mt-12 text-slate-400"
      >
        {[
          { icon: '🛡️', text: 'Secure Booking' },
          { icon: '💬', text: 'WhatsApp Support' },
          { icon: '✨', text: 'Customizable Add-ons' },
          { icon: '🔄', text: 'Flexible Cancellation' },
        ].map(badge => (
          <div key={badge.text} className="flex items-center gap-2 text-xs font-medium">
            <span className="text-base">{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
