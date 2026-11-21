with open("Ocean-Weligama/artifacts/ocean-weligama/src/pages/about.tsx", "r") as f:
    content = f.read()

target1 = """  // Host Signature Dock
  const valDockMonogram = valuesConfig?.dockMonogram || "OA";
  const valDockQuote = valuesConfig?.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const valDockByline = valuesConfig?.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const valDockGuarantee = valuesConfig?.dockGuarantee || "100% Genuine Hospitality";"""

replacement1 = """  // Host Signature Dock (Section 6 & 7)
  const signatureConfig = (aboutSetting?.value as any)?.signature;
  const sigMonogram = signatureConfig?.monogram || valuesConfig?.dockMonogram || "OA";
  const sigQuote = signatureConfig?.quote || valuesConfig?.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const sigByline = signatureConfig?.byline || valuesConfig?.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const sigGuarantee = signatureConfig?.guarantee || valuesConfig?.dockGuarantee || "100% Genuine Hospitality";"""

assert target1 in content, "target1 not found!"
content = content.replace(target1, replacement1, 1)

target2 = """          {/* Family Host Signature & Reassurance Dock */}
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
            </div>"""

replacement2 = """          {/* Family Host Signature & Reassurance Dock */}
          <motion.div
            data-testid="public-about-signature-dock"
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
                {sigMonogram}
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
                  {sigQuote}
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
                  {sigByline}
                </motion.p>
              </div>
            </div>"""

assert target2 in content, "target2 not found!"
content = content.replace(target2, replacement2, 1)

target3 = "{valDockGuarantee}"
replacement3 = "{sigGuarantee}"
assert target3 in content, "target3 not found!"
content = content.replace(target3, replacement3, 1)

with open("Ocean-Weligama/artifacts/ocean-weligama/src/pages/about.tsx", "w") as f:
    f.write(content)

print("Updated about.tsx with signature data bindings!")
