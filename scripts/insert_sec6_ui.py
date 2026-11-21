import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

needle = """                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] shrink-0"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "rgba(11,61,94,0.1)",
                                color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#0B3D5E",
                              }}
                            >
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetDockTime || "5PM - 9:30PM"
                                : aboutForm.rooftop.morningDockTime || "7AM - 11:30AM"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "contact" ? ("""

assert needle in content, "needle not found!"

sec6_ui = """                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] shrink-0"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "rgba(11,61,94,0.1)",
                                color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#0B3D5E",
                              }}
                            >
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetDockTime || "5PM - 9:30PM"
                                : aboutForm.rooftop.morningDockTime || "7AM - 11:30AM"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: FAMILY VALUES & HERITAGE PILLARS */}
              <div data-testid="admin-about-values-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 6</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Rooted in Weligama • Family Values &amp; Heritage Pillars
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure independent heritage identity, 3 core proof pillars, proof points, and family host signature reassurance dock.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutValuesDefaults}
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
                        ) : isAboutValuesSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Values &amp; Heritage</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Section Eyebrow, Two-Tone Headline & Subtitle */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Section Header &amp; Mission Narrative
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Eyebrow Badge Text
                        </label>
                        <Input
                          value={aboutForm.values.badge}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, badge: e.target.value },
                            }))
                          }
                          placeholder="Our Founding Identity"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Lead
                        </label>
                        <Input
                          value={aboutForm.values.headingLead}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, headingLead: e.target.value },
                            }))
                          }
                          placeholder="Rooted in Weligama,"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Highlight (Italic Amber)
                        </label>
                        <Input
                          value={aboutForm.values.headingHighlight}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, headingHighlight: e.target.value },
                            }))
                          }
                          placeholder="Driven by Family Values"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Subtitle Paragraph Narrative
                      </label>
                      <Textarea
                        value={aboutForm.values.subtitle}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            values: { ...prev.values, subtitle: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide..."
                        className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 3 Heritage Pillars Editor Tabs */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 max-w-xl">
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(1)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 1
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pillar 1: Roots</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(2)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 2
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                        <span>Pillar 2: Host Care</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(3)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 3
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                        <span>Pillar 3: Refinements</span>
                      </button>
                    </div>

                    {/* PILLAR 1 FORM */}
                    {adminActivePillarTab === 1 && (
                      <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Pillar 1: Pure Local Roots &amp; Independent Heritage
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar1Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Badge: e.target.value },
                                }))
                              }
                              placeholder="Pure Local Roots"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar1Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Tag: e.target.value },
                                }))
                              }
                              placeholder="INDEPENDENT HERITAGE"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar1Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Title: e.target.value },
                                }))
                              }
                              placeholder="100% Locally Owned & Run"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar1Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar1Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="Proudly independent and family-operated. Every booking directly supports..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-amber-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar1Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point1: e.target.value },
                                  }))
                                }
                                placeholder="100% Sri Lankan family-owned & operated"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar1Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point2: e.target.value },
                                  }))
                                }
                                placeholder="Local team hiring with fair living wages"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar1Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point3: e.target.value },
                                  }))
                                }
                                placeholder="Direct reinvestment into Weligama village"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PILLAR 2 FORM */}
                    {adminActivePillarTab === 2 && (
                      <div className="p-6 rounded-3xl bg-rose-50/40 border border-rose-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
                          <HeartHandshake className="w-4 h-4 text-rose-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                            Pillar 2: Personal Host Care &amp; Southern Hospitality
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar2Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Badge: e.target.value },
                                }))
                              }
                              placeholder="Personal Host Care"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar2Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Tag: e.target.value },
                                }))
                              }
                              placeholder="SOUTHERN HOSPITALITY"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar2Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Title: e.target.value },
                                }))
                              }
                              placeholder="Warm Family Atmosphere"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar2Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar2Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="You are never just a room number here. Our family is on-site daily..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-rose-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar2Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point1: e.target.value },
                                  }))
                                }
                                placeholder="Genuine hosts living on-site 24/7"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar2Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point2: e.target.value },
                                  }))
                                }
                                placeholder="Insider guidance for secret uncrowded spots"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar2Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point3: e.target.value },
                                  }))
                                }
                                placeholder="True island home-away-from-home feeling"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PILLAR 3 FORM */}
                    {adminActivePillarTab === 3 && (
                      <div className="p-6 rounded-3xl bg-sky-50/40 border border-sky-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-sky-200/60">
                          <TrendingUp className="w-4 h-4 text-sky-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                            Pillar 3: Dedicated Season Upgrades &amp; Uncompromising Comfort
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar3Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Badge: e.target.value },
                                }))
                              }
                              placeholder="Yearly Refinements"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar3Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Tag: e.target.value },
                                }))
                              }
                              placeholder="UNCOMPROMISING COMFORT"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar3Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Title: e.target.value },
                                }))
                              }
                              placeholder="Dedicated Season Upgrades"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar3Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar3Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="We continuously reinvest each season into high-pressure rain showers..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-sky-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar3Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point1: e.target.value },
                                  }))
                                }
                                placeholder="Annual room comfort & amenity enhancements"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar3Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point2: e.target.value },
                                  }))
                                }
                                placeholder="Whisper-quiet Daikin A/C & rain showers"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar3Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point3: e.target.value },
                                  }))
                                }
                                placeholder="High-speed fiber connectivity in every space"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Family Host Signature & Reassurance Dock Editor */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Family Host Signature &amp; Reassurance Dock
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Monogram
                        </label>
                        <Input
                          value={aboutForm.values.dockMonogram}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockMonogram: e.target.value },
                            }))
                          }
                          placeholder="OA"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Family Host Quote
                        </label>
                        <Input
                          value={aboutForm.values.dockQuote}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockQuote: e.target.value },
                            }))
                          }
                          placeholder="“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"
                          className="rounded-xl bg-white border-slate-200 text-xs font-serif italic"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Guarantee Label
                        </label>
                        <Input
                          value={aboutForm.values.dockGuarantee}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockGuarantee: e.target.value },
                            }))
                          }
                          placeholder="100% Genuine Hospitality"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold text-[#0B3D5E]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Family Host Byline
                      </label>
                      <Input
                        value={aboutForm.values.dockByline}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            values: { ...prev.values, dockByline: e.target.value },
                          }))
                        }
                        placeholder="The Ocean Air Family • Weligama Bay, Sri Lanka"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                      />
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 6 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Family Values &amp; Heritage Pillars Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Live Desktop &amp; Mobile Replica
                      </span>
                    </div>

                    <div
                      className="p-8 sm:p-12 rounded-3xl border border-white/90 shadow-xl overflow-hidden"
                      style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}
                    >
                      {/* Centered Header */}
                      <div className="text-center mb-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-amber-200/60 text-[#D97706] text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-xs mb-3">
                          <HeartHandshake className="w-3 h-3 text-[#D97706]" />
                          <span>{aboutForm.values.badge || "Our Founding Identity"}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3D5E] tracking-tight leading-tight">
                          <span>{aboutForm.values.headingLead || "Rooted in Weligama,"} </span>
                          <span className="italic font-normal text-[#D97706]">
                            {aboutForm.values.headingHighlight || "Driven by Family Values"}
                          </span>
                        </h3>
                        <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed">
                          {aboutForm.values.subtitle || "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide..."}
                        </p>
                      </div>

                      {/* 3 Pillars Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-10">
                        {/* Card 1 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar1Badge || "Pure Local Roots"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar1Tag || "INDEPENDENT HERITAGE"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar1Title || "100% Locally Owned & Run"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar1Desc || "Proudly independent and family-operated..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar1Point1, aboutForm.values.pillar1Point2, aboutForm.values.pillar1Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left md:translate-y-2"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <HeartHandshake className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar2Badge || "Personal Host Care"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar2Tag || "SOUTHERN HOSPITALITY"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar2Title || "Warm Family Atmosphere"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar2Desc || "You are never just a room number here..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar2Point1, aboutForm.values.pillar2Point2, aboutForm.values.pillar2Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card 3 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <TrendingUp className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar3Badge || "Yearly Refinements"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar3Tag || "UNCOMPROMISING COMFORT"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar3Title || "Dedicated Season Upgrades"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar3Desc || "We continuously reinvest each season into high-pressure rain showers..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar3Point1, aboutForm.values.pillar3Point2, aboutForm.values.pillar3Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Host Signature Dock Preview */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] flex items-center justify-center text-[#FBBF24] font-serif font-bold text-sm shadow-xs shrink-0">
                            {aboutForm.values.dockMonogram || "OA"}
                          </div>
                          <div>
                            <p className="text-xs font-serif italic text-[#0B3D5E] font-medium leading-tight">
                              {aboutForm.values.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] mt-0.5">
                              {aboutForm.values.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="flex items-center gap-1">
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

content = content.replace(needle, sec6_ui, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Section 6 UI successfully inserted into settings.tsx!")
