import sys

ABOUT_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/about.tsx"

with open(ABOUT_FILE, "r") as f:
    content = f.read()

# 1. Add valuesConfig extraction
rooftop_end = """  const roofSunsetDockNote = rooftopConfig?.sunsetDockNote || "Weligama's premier sunset vista. Resident priority seating.";
  const roofSunsetDockTime = rooftopConfig?.sunsetDockTime || "5PM - 9:30PM";"""

values_config_code = """  const roofSunsetDockNote = rooftopConfig?.sunsetDockNote || "Weligama's premier sunset vista. Resident priority seating.";
  const roofSunsetDockTime = rooftopConfig?.sunsetDockTime || "5PM - 9:30PM";

  // Dynamic Family Values & Heritage Pillars (Section 6)
  const valuesConfig = (aboutSetting?.value as any)?.values;
  const valuesBadge = valuesConfig?.badge || "Our Founding Identity";
  const valuesHeadingLead = valuesConfig?.headingLead || "Rooted in Weligama,";
  const valuesHeadingHighlight = valuesConfig?.headingHighlight || "Driven by Family Values";
  const valuesSubtitle = valuesConfig?.subtitle || "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide. We combine authentic Southern Sri Lankan warmth with 5-star hospitality standards.";

  // Pillar 1: Pure Local Roots
  const valPillar1Badge = valuesConfig?.pillar1Badge || "Pure Local Roots";
  const valPillar1Tag = valuesConfig?.pillar1Tag || "INDEPENDENT HERITAGE";
  const valPillar1Title = valuesConfig?.pillar1Title || "100% Locally Owned & Run";
  const valPillar1Desc = valuesConfig?.pillar1Desc || "Proudly independent and family-operated. Every booking directly supports Weligama families, local fishermen, surf instructors, and the sustainable vitality of our coastal community.";
  const valPillar1Point1 = valuesConfig?.pillar1Point1 || "100% Sri Lankan family-owned & operated";
  const valPillar1Point2 = valuesConfig?.pillar1Point2 || "Local team hiring with fair living wages";
  const valPillar1Point3 = valuesConfig?.pillar1Point3 || "Direct reinvestment into Weligama village";

  // Pillar 2: Personal Host Care
  const valPillar2Badge = valuesConfig?.pillar2Badge || "Personal Host Care";
  const valPillar2Tag = valuesConfig?.pillar2Tag || "SOUTHERN HOSPITALITY";
  const valPillar2Title = valuesConfig?.pillar2Title || "Warm Family Atmosphere";
  const valPillar2Desc = valuesConfig?.pillar2Desc || "You are never just a room number here. Our family is on-site daily to share authentic homemade breakfast tips, hidden surf breaks, and heartfelt care from check-in to farewell.";
  const valPillar2Point1 = valuesConfig?.pillar2Point1 || "Genuine hosts living on-site 24/7";
  const valPillar2Point2 = valuesConfig?.pillar2Point2 || "Insider guidance for secret uncrowded spots";
  const valPillar2Point3 = valuesConfig?.pillar2Point3 || "True island home-away-from-home feeling";

  // Pillar 3: Dedicated Season Upgrades
  const valPillar3Badge = valuesConfig?.pillar3Badge || "Yearly Refinements";
  const valPillar3Tag = valuesConfig?.pillar3Tag || "UNCOMPROMISING COMFORT";
  const valPillar3Title = valuesConfig?.pillar3Title || "Dedicated Season Upgrades";
  const valPillar3Desc = valuesConfig?.pillar3Desc || "We continuously reinvest each season into high-pressure rain showers, whisper-quiet air conditioning, luxury orthopedic bedding, and fast fiber Wi-Fi across all spaces.";
  const valPillar3Point1 = valuesConfig?.pillar3Point1 || "Annual room comfort & amenity enhancements";
  const valPillar3Point2 = valuesConfig?.pillar3Point2 || "Whisper-quiet Daikin A/C & rain showers";
  const valPillar3Point3 = valuesConfig?.pillar3Point3 || "High-speed fiber connectivity in every space";

  // Host Signature Dock
  const valDockMonogram = valuesConfig?.dockMonogram || "OA";
  const valDockQuote = valuesConfig?.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const valDockByline = valuesConfig?.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const valDockGuarantee = valuesConfig?.dockGuarantee || "100% Genuine Hospitality";

  const dynamicValues = [
    {
      icon: ShieldCheck,
      highlight: valPillar1Badge,
      tag: valPillar1Tag,
      title: valPillar1Title,
      desc: valPillar1Desc,
      points: [valPillar1Point1, valPillar1Point2, valPillar1Point3]
    },
    {
      icon: HeartHandshake,
      highlight: valPillar2Badge,
      tag: valPillar2Tag,
      title: valPillar2Title,
      desc: valPillar2Desc,
      points: [valPillar2Point1, valPillar2Point2, valPillar2Point3]
    },
    {
      icon: TrendingUp,
      highlight: valPillar3Badge,
      tag: valPillar3Tag,
      title: valPillar3Title,
      desc: valPillar3Desc,
      points: [valPillar3Point1, valPillar3Point2, valPillar3Point3]
    }
  ];"""

assert rooftop_end in content, "rooftop_end not found!"
content = content.replace(rooftop_end, values_config_code, 1)

# 2. Replace static Section 6 block with dynamic block
s_needle = "      {/* 100% Locally Owned & Family Heritage section */}"
e_needle = "      {/* Final Invitation Call to Action */}"

p1 = content.find(s_needle)
p2 = content.find(e_needle)
assert p1 != -1 and p2 != -1, "Section 6 boundaries not found!"

dynamic_section_6 = """      {/* 100% Locally Owned & Family Heritage section */}
      <section data-testid="public-about-values-section" className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}>
        {/* Soft ambient brand orbs */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-amber-200/20 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-200/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            {/* Eyebrow Badge - From Right Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-amber-200/60 text-[#D97706] text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-sm mb-4"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#D97706]" /> {valuesBadge}
            </motion.div>

            {/* Editorial Headline - Words One by One From Left Side */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E] tracking-tight">
              <span className="inline-block">
                {valuesHeadingLead.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-3.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              {" "}
              <span className="inline-block">
                {valuesHeadingHighlight.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.33 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-3.5 italic font-normal text-[#D97706]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h2>

            {/* Subtitle Paragraph - From Down to Up */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-slate-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal"
            >
              {valuesSubtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4 pb-4">
            {dynamicValues.map((val, idx) => {
              const Icon = val.icon;
              const isUp = idx === 0 || idx === 2; // Up, Down, Up pattern

              return (
                <motion.div
                  key={`${val.title}-${idx}`}
                  initial={{ opacity: 0, y: isUp ? -80 : 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: 0.12 + idx * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className={isUp ? "md:-translate-y-5" : "md:translate-y-6"}
                >
                  <div
                    className="group relative h-full flex flex-col justify-between text-left p-8 sm:p-9 rounded-[2.5rem] border border-white/90 backdrop-blur-2xl shadow-[0_16px_45px_rgba(11,61,94,0.06)] hover:shadow-[0_28px_65px_rgba(11,61,94,0.12)] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1.5 overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                      willChange: 'transform, box-shadow'
                    }}
                  >
                    {/* Subtle top amber hairline glow on hover */}
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Ambient radial glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"
                      style={{ background: 'radial-gradient(circle at top center, rgba(251, 191, 36, 0.12) 0%, transparent 70%)' }}
                    />

                    <div className="relative z-10">
                      {/* Top row: Icon emblem & Highlight badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-[#D97706] shadow-sm group-hover:scale-105 group-hover:bg-[#0B3D5E] group-hover:text-[#FBBF24] group-hover:border-[#0B3D5E] transition-all duration-300">
                          <Icon className="w-6 h-6 transition-colors duration-300" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] border border-[#0B3D5E]/10 group-hover:border-amber-400/40 group-hover:bg-amber-50 group-hover:text-[#D97706] transition-all duration-300">
                          {val.highlight}
                        </span>
                      </div>

                      {/* Category Micro-tag */}
                      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D97706] block mb-2">
                        {val.tag}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B3D5E] mb-3 leading-snug">
                        {val.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal mb-6">
                        {val.desc}
                      </p>
                    </div>

                    {/* Structured Proof Points Checklist */}
                    <div className="relative z-10 pt-5 border-t border-slate-100/90 space-y-2.5 mt-auto">
                      {val.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#0B3D5E] font-medium leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Family Host Signature & Reassurance Dock */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-[2rem] bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_16px_45px_rgba(11,61,94,0.06)] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            <div className="flex items-center gap-4 text-left flex-1 min-w-0">
              {/* OA Monogram Badge - Smooth Pop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] flex items-center justify-center text-[#FBBF24] font-serif font-bold text-lg shadow-md shrink-0"
              >
                {valDockMonogram}
              </motion.div>
              <div className="min-w-0">
                {/* Quote Text - From Right Side */}
                <motion.p
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-xs sm:text-sm font-serif italic text-[#0B3D5E] font-medium leading-snug"
                >
                  {valDockQuote}
                </motion.p>
                {/* Family Byline - From Left Side */}
                <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mt-1"
                >
                  {valDockByline}
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
              {/* 5 Stars - Filling Little by Little Slowly with Golden Yellow */}
              <div className="relative inline-flex items-center">
                {/* Background: Unfilled Base Stars */}
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-3.5 h-3.5 fill-slate-200/70 text-slate-300" 
                    />
                  ))}
                </div>

                {/* Foreground: Golden Yellow Stars Filling Smoothly and Slowly from Left to Right */}
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ 
                    duration: 1.9, 
                    delay: 0.45, 
                    ease: "easeInOut" 
                  }}
                  style={{ willChange: "width" }}
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                >
                  <div className="flex items-center gap-1.5 w-max">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]" 
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
              {/* Guarantee text */}
              <motion.span
                initial={{ opacity: 0, x: 45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-xs font-bold text-[#0B3D5E] whitespace-nowrap"
              >
                {valDockGuarantee}
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>\n\n"""

content = content[:p1] + dynamic_section_6 + content[p2:]

with open(ABOUT_FILE, "w") as f:
    f.write(content)

print("Updated about.tsx successfully with Section 6 dynamic bindings!")
