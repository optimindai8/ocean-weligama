import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

needle = """                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#0B3D5E]">
                            {aboutForm.values.dockGuarantee || "100% Genuine Hospitality"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "contact" ? ("""

assert needle in content, "needle not found!"

sec7_and_8_ui = """                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#0B3D5E]">
                            {aboutForm.values.dockGuarantee || "100% Genuine Hospitality"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: FAMILY HOST SIGNATURE & REASSURANCE DOCK */}
              <div data-testid="admin-about-signature-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FBBF24]/10 via-[#0B3D5E]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3D5E]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Quote className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 7</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Family Host Signature &amp; Hospitality Guarantee Dock
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure resident monogram emblem, authentic host quotation, family byline, review stars, and island hospitality guarantee.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutSignatureDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[140px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutSignatureSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Host Signature</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Resident Host Family Content
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Monogram Letters
                        </label>
                        <Input
                          value={aboutForm.signature.monogram}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              signature: { ...prev.signature, monogram: e.target.value },
                            }))
                          }
                          placeholder="OA"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Guarantee Badge Text
                        </label>
                        <Input
                          value={aboutForm.signature.guarantee}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              signature: { ...prev.signature, guarantee: e.target.value },
                            }))
                          }
                          placeholder="100% Genuine Hospitality"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold text-[#0B3D5E]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Family Host Byline
                        </label>
                        <Input
                          value={aboutForm.signature.byline}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              signature: { ...prev.signature, byline: e.target.value },
                            }))
                          }
                          placeholder="The Ocean Air Family • Weligama Bay, Sri Lanka"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Authentic Family Host Quotation
                      </label>
                      <Textarea
                        value={aboutForm.signature.quote}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            signature: { ...prev.signature, quote: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"
                        className="rounded-xl bg-white border-slate-200 text-xs font-serif italic"
                      />
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 7 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Host Signature Dock Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Exact Floating Island Replica
                      </span>
                    </div>

                    <div
                      className="p-8 sm:p-12 rounded-3xl border border-white/90 shadow-xl overflow-hidden flex items-center justify-center"
                      style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}
                    >
                      <div className="p-6 sm:p-8 rounded-[2rem] bg-white/95 backdrop-blur-2xl border border-white/95 shadow-[0_16px_45px_rgba(11,61,94,0.06)] max-w-3xl w-full flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
                        <div className="flex items-center gap-4 text-left flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] flex items-center justify-center text-[#FBBF24] font-serif font-bold text-lg shadow-md shrink-0">
                            {aboutForm.signature.monogram || "OA"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-serif italic text-[#0B3D5E] font-medium leading-snug">
                              {aboutForm.signature.quote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"}
                            </p>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mt-1">
                              {aboutForm.signature.byline || "The Ocean Air Family • Weligama Bay, Sri Lanka"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] drop-shadow-xs" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#0B3D5E] whitespace-nowrap">
                            {aboutForm.signature.guarantee || "100% Genuine Hospitality"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 8: FINAL INVITATION CTA */}
              <div data-testid="admin-about-invitation-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 8</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Final Invitation CTA • "Ready to Discover Southern Sri Lanka?"
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure high-converting dusk invitation header, two-tone typography, lead narrative, action button, and 3 booking assurance perks.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutInvitationDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[140px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutInvitationSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Invitation CTA</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Header & Typography Controls */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Headline &amp; Lead Narrative
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Eyebrow Badge Text
                        </label>
                        <Input
                          value={aboutForm.invitation.badge}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, badge: e.target.value },
                            }))
                          }
                          placeholder="Your Weligama Escape"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Lead
                        </label>
                        <Input
                          value={aboutForm.invitation.headingLead}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, headingLead: e.target.value },
                            }))
                          }
                          placeholder="Ready to Discover"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Highlight (Italic Gold)
                        </label>
                        <Input
                          value={aboutForm.invitation.headingHighlight}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, headingHighlight: e.target.value },
                            }))
                          }
                          placeholder="Southern Sri Lanka?"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Lead Narrative Paragraph
                      </label>
                      <Textarea
                        value={aboutForm.invitation.subtitle}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            invitation: { ...prev.invitation, subtitle: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts..."
                        className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Button & 3 Reassurance Perks */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Call-to-Action Button &amp; 3 Booking Perks
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Button Label
                        </label>
                        <Input
                          value={aboutForm.invitation.ctaText}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, ctaText: e.target.value },
                            }))
                          }
                          placeholder="Book Your Experience"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Button Destination Link
                        </label>
                        <Input
                          value={aboutForm.invitation.ctaLink}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, ctaLink: e.target.value },
                            }))
                          }
                          placeholder="/book?new=1"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B3D5E] block mb-2">
                        3 Psychological Reassurance Perks
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 1</label>
                          <Input
                            value={aboutForm.invitation.perk1}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk1: e.target.value },
                              }))
                            }
                            placeholder="Best Direct Rates Guaranteed"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 2</label>
                          <Input
                            value={aboutForm.invitation.perk2}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk2: e.target.value },
                              }))
                            }
                            placeholder="Free 3-Min Beach Walk Location"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 3</label>
                          <Input
                            value={aboutForm.invitation.perk3}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk3: e.target.value },
                              }))
                            }
                            placeholder="100% Flexible Booking Options"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 8 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Final Invitation CTA Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Exact Dusk Card Replica
                      </span>
                    </div>

                    <div
                      className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center text-white border border-amber-400/30 shadow-2xl"
                      style={{ background: 'linear-gradient(145deg, rgba(7,30,46,0.97) 0%, rgba(11,46,70,0.94) 45%, rgba(18,57,84,0.96) 100%)' }}
                    >
                      {/* Top Gold Accent */}
                      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

                      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.25em]">
                          <Compass className="w-3 h-3 text-amber-300" />
                          <span>{aboutForm.invitation.badge || "Your Weligama Escape"}</span>
                        </div>

                        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                          <span>{aboutForm.invitation.headingLead || "Ready to Discover"} </span>
                          <span className="italic font-normal text-amber-300">
                            {aboutForm.invitation.headingHighlight || "Southern Sri Lanka?"}
                          </span>
                        </h3>

                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">
                          {aboutForm.invitation.subtitle || "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts..."}
                        </p>

                        <div className="pt-2 flex flex-col items-center gap-4">
                          <button
                            type="button"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                          >
                            <span>{aboutForm.invitation.ctaText || "Book Your Experience"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-amber-200/80 font-medium pt-1">
                            {[aboutForm.invitation.perk1, aboutForm.invitation.perk2, aboutForm.invitation.perk3].map((item, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-amber-400" /> {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "contact" ? ("""

content = content.replace(needle, sec7_and_8_ui, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Section 7 and Section 8 UI successfully inserted into settings.tsx!")
