with open("Ocean-Weligama/artifacts/ocean-weligama/src/pages/about.tsx", "r") as f:
    content = f.read()

target1 = """  // Host Signature Dock (Section 6 & 7)
  const signatureConfig = (aboutSetting?.value as any)?.signature;
  const sigMonogram = signatureConfig?.monogram || valuesConfig?.dockMonogram || "OA";
  const sigQuote = signatureConfig?.quote || valuesConfig?.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const sigByline = signatureConfig?.byline || valuesConfig?.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const sigGuarantee = signatureConfig?.guarantee || valuesConfig?.dockGuarantee || "100% Genuine Hospitality";"""

replacement1 = """  // Host Signature Dock (Section 6 & 7)
  const signatureConfig = (aboutSetting?.value as any)?.signature;
  const sigMonogram = signatureConfig?.monogram || valuesConfig?.dockMonogram || "OA";
  const sigQuote = signatureConfig?.quote || valuesConfig?.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const sigByline = signatureConfig?.byline || valuesConfig?.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const sigGuarantee = signatureConfig?.guarantee || valuesConfig?.dockGuarantee || "100% Genuine Hospitality";

  // Dynamic Final Invitation CTA (Section 8)
  const invitationConfig = (aboutSetting?.value as any)?.invitation;
  const invBadge = invitationConfig?.badge || "Your Weligama Escape";
  const invHeadingLead = invitationConfig?.headingLead || "Ready to Discover";
  const invHeadingHighlight = invitationConfig?.headingHighlight || "Southern Sri Lanka?";
  const invSubtitle = invitationConfig?.subtitle || "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts, or unwinding under starlit coastal skies—your unforgettable island story begins at Ocean Air.";
  const invCtaText = invitationConfig?.ctaText || "Book Your Experience";
  const invCtaLink = invitationConfig?.ctaLink || "/book?new=1";
  const invPerk1 = invitationConfig?.perk1 || "Best Direct Rates Guaranteed";
  const invPerk2 = invitationConfig?.perk2 || "Free 3-Min Beach Walk Location";
  const invPerk3 = invitationConfig?.perk3 || "100% Flexible Booking Options";"""

assert target1 in content, "target1 not found!"
content = content.replace(target1, replacement1, 1)

s_needle = "      {/* Final Invitation Call to Action */}"
e_needle = "      <Footer />"

p1 = content.find(s_needle)
p2 = content.find(e_needle)
assert p1 != -1 and p2 != -1, "Section 8 boundaries not found!"

sec8_dynamic = """      {/* Final Invitation Call to Action */}
      <section data-testid="public-about-invitation-section" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #EEF5FA 100%)' }}>
        {/* Subtle background ambient glows matching brand */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0B3D5E]/10 blur-[130px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center text-white shadow-[0_36px_90px_rgba(7,30,46,0.45)] border border-amber-400/25 backdrop-blur-2xl"
          style={{ background: 'linear-gradient(145deg, rgba(7,30,46,0.97) 0%, rgba(11,46,70,0.94) 45%, rgba(18,57,84,0.96) 100%)' }}
        >
          {/* Top Gold Accent Line */}
          <div className="absolute top-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

          {/* Golden Sunset Halo at Top */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-transparent blur-[80px] pointer-events-none rounded-full" />

          {/* OCEAN AIR LOGO WATERMARK - Centered in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.12, 0.18, 0.12]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] flex items-center justify-center"
            >
              <TransparentLogo 
                src="/logo.jpg" 
                className="w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_50px_rgba(251,191,36,0.35)]" 
              />
            </motion.div>
          </div>

          {/* Decorative Corner Nautical Wave & Sun Vectors */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 4, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-8 sm:top-12 sm:left-12 text-amber-400/10 pointer-events-none"
          >
            <Waves className="w-28 h-28 sm:w-40 sm:h-40" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -4, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-[#FBBF24]/10 pointer-events-none"
          >
            <Sun className="w-32 h-32 sm:w-48 sm:h-48" />
          </motion.div>

          {/* Shimmer sweep overlay across card body */}
          <motion.div
            className="absolute inset-0 w-[40%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(251,191,36,0.06) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-200%', '350%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 5 }}
          />

          <div className="relative z-10 px-6 sm:px-12 py-18 sm:py-24 max-w-4xl mx-auto">
            {/* Eyebrow Badge - From Right Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-[0.25em] backdrop-blur-md shadow-sm">
                <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span>{invBadge}</span>
              </div>
            </motion.div>

            {/* Editorial Dynamic Headline - Words One by One From Left Side */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight leading-[1.15] drop-shadow-md">
              <span className="inline-block mr-3">
                {invHeadingLead.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.14 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <br className="hidden sm:inline" />
              <span className="inline-block italic font-normal text-amber-300 drop-shadow-sm pr-4">
                {invHeadingHighlight.split(" ").map((word, i) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.36 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className={`inline-block mr-2.5 sm:mr-4 ${i === invHeadingHighlight.split(" ").length - 1 ? "pr-4" : ""}`}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h2>
            
            {/* Lead Narrative - From Down to Up */}
            <motion.p 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ delay: 0.55, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-slate-200 text-sm sm:text-base md:text-lg mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto font-light"
            >
              {invSubtitle}
            </motion.p>
            
            {/* High-Converting Radiant CTA Button & Reassurance Strip */}
            <div className="flex flex-col items-center gap-6">
              {/* Button - From Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: 0.68, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative inline-block"
              >
                <Link href={invCtaLink} className="inline-block">
                  <button type="button" className="animated-cta-button">
                    <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      />
                    </svg>
                    <span className="text">{invCtaText}</span>
                    <span className="circle" />
                    <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      />
                    </svg>
                  </button>
                </Link>
              </motion.div>

              {/* Psychological Reassurance Strip below Button */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-amber-200/80 font-medium pt-2">
                {[invPerk1, invPerk2, invPerk3].map((item, idx) => (
                  <motion.span
                    key={`${item}-${idx}`}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.65, delay: 0.78 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-400" /> {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>\n\n"""

content = content[:p1] + sec8_dynamic + content[p2:]

with open("Ocean-Weligama/artifacts/ocean-weligama/src/pages/about.tsx", "w") as f:
    f.write(content)

print("Updated about.tsx successfully with Section 8 dynamic bindings!")
