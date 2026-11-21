import sys

SETTINGS_FILE = "Ocean-Weligama/artifacts/ocean-weligama/src/pages/admin/settings.tsx"

with open(SETTINGS_FILE, "r") as f:
    content = f.read()

needle = """                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "contact" ? ("""

assert needle in content, "needle not found!"

sec5_ui = """                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: THE ROOFTOP CAFÉ • ATMOSPHERE SHIFT SIMULATOR */}
              <div data-testid="admin-about-rooftop-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-[#0B3D5E]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Coffee className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 5</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        The Rooftop Café • Atmosphere Shift Simulator
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure morning roasts vs golden hour atmospheres, time windows, signature culinary cards, atmosphere badges, and floating vista photography.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutRooftopDefaults}
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
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[130px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutRooftopSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Rooftop Café</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Common Headline & Dual Atmosphere Switcher Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Section Headline Lead (Common)
                      </label>
                      <Input
                        value={aboutForm.rooftop.headingLead}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, headingLead: e.target.value },
                          }))
                        }
                        placeholder="The Rooftop Café"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Day Mode Tab Label
                      </label>
                      <Input
                        value={aboutForm.rooftop.tab1Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, tab1Label: e.target.value },
                          }))
                        }
                        placeholder="Morning Vibes"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Dusk Mode Tab Label
                      </label>
                      <Input
                        value={aboutForm.rooftop.tab2Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, tab2Label: e.target.value },
                          }))
                        }
                        placeholder="Golden Hour"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Active Atmosphere Tab Selector for Editing */}
                  <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 max-w-md">
                    <button
                      type="button"
                      onClick={() => setAdminActiveAtmosphereTab("morning")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        adminActiveAtmosphereTab === "morning"
                          ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                          : "text-slate-600 hover:text-[#0B3D5E]"
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-500" />
                      <span>{aboutForm.rooftop.tab1Label || "Morning Vibes"} Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminActiveAtmosphereTab("sunset")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        adminActiveAtmosphereTab === "sunset"
                          ? "bg-[#0B3D5E] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#0B3D5E]"
                      }`}
                    >
                      <Sunset className="w-3.5 h-3.5 text-[#FBBF24]" />
                      <span>{aboutForm.rooftop.tab2Label || "Golden Hour"} Editor</span>
                    </button>
                  </div>

                  {/* TAB 1: MORNING VIBES FORM */}
                  {adminActiveAtmosphereTab === "morning" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-amber-50/40 border border-amber-200/60">
                      {/* Left: Content & Cards */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Morning Mode Atmosphere & Curations
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Morning Eyebrow Badge
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningBadge: e.target.value },
                                }))
                              }
                              placeholder="Scenic Culinary Rooftop"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Morning Heading Highlight
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningHeadingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningHeadingHighlight: e.target.value },
                                }))
                              }
                              placeholder="• Sunrise Roasts & Vistas"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-amber-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Morning Subtitle Narrative
                          </label>
                          <Textarea
                            value={aboutForm.rooftop.morningSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                rooftop: { ...prev.rooftop, morningSubtitle: e.target.value },
                              }))
                            }
                            rows={3}
                            placeholder="Wake up to freshly roasted Sri Lankan highland espresso..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                          />
                        </div>

                        {/* Morning Card 1 */}
                        <div className="p-4 rounded-2xl bg-white border border-amber-200/70 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Coffee className="w-3.5 h-3.5 text-amber-500" /> Morning Feature Card 1 (Artisan Roasts)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Time Tag</label>
                              <Input
                                value={aboutForm.rooftop.morningCard1Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard1Tag: e.target.value },
                                  }))
                                }
                                placeholder="7:00 AM – 11:30 AM"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.morningCard1Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard1Title: e.target.value },
                                  }))
                                }
                                placeholder="Artisan Roasts & Bowls"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.morningCard1Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningCard1Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Fresh single-origin Ceylon espresso..."
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Morning Card 2 */}
                        <div className="p-4 rounded-2xl bg-white border border-amber-200/70 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Waves className="w-3.5 h-3.5 text-sky-500" /> Morning Feature Card 2 (Dawn Surf Conditions)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Vantage Tag</label>
                              <Input
                                value={aboutForm.rooftop.morningCard2Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard2Tag: e.target.value },
                                  }))
                                }
                                placeholder="180° Panoramic Vantage"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.morningCard2Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard2Title: e.target.value },
                                  }))
                                }
                                placeholder="Dawn Surf Conditions"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.morningCard2Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningCard2Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Check Weligama Bay wave sets..."
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Morning Bottom Micro-Strip Perks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Micro Perk 1</label>
                            <Input
                              value={aboutForm.rooftop.morningPerk1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningPerk1: e.target.value },
                                }))
                              }
                              placeholder="Organic local ingredients"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Micro Perk 2</label>
                            <Input
                              value={aboutForm.rooftop.morningPerk2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningPerk2: e.target.value },
                                }))
                              }
                              placeholder="High-speed terrace Wi-Fi"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Morning Showcase & Photo */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                          <ImageIcon className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Morning Vista Media & Reassurance Dock
                          </span>
                        </div>

                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-amber-200/80 shadow-md bg-slate-100">
                          <img
                            src={aboutForm.rooftop.morningImageUrl || "/morning-vibe.png"}
                            alt="Morning Vibes Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-[#0B3D5E]">
                              {aboutForm.rooftop.morningImageTag || "Morning Sunrise Service"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Status Badge Text
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningImageTag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningImageTag: e.target.value },
                                }))
                              }
                              placeholder="Morning Sunrise Service"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/morning-vibe.png"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold font-mono"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#0B3D5E]/30 bg-white hover:bg-[#0B3D5E]/5 text-xs font-semibold text-[#0B3D5E] cursor-pointer transition-colors">
                              {isUploadingMorningImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Morning Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingMorningImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadMorningImage(f);
                                }}
                              />
                            </label>
                          </div>

                          <div className="pt-2 border-t border-amber-200/60 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Bottom Reassurance Note
                              </label>
                              <Input
                                value={aboutForm.rooftop.morningDockNote}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningDockNote: e.target.value },
                                  }))
                                }
                                placeholder="Complimentary breakfast & espresso for resident bookings."
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Reassurance Hours Tag
                              </label>
                              <Input
                                value={aboutForm.rooftop.morningDockTime}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningDockTime: e.target.value },
                                  }))
                                }
                                placeholder="7AM - 11:30AM"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: GOLDEN HOUR FORM */}
                  {adminActiveAtmosphereTab === "sunset" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-slate-900/90 text-white border border-amber-400/30">
                      {/* Left: Content & Cards */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                          <Sunset className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Golden Hour Dusk Mode & Curations
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Sunset Eyebrow Badge
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetBadge: e.target.value },
                                }))
                              }
                              placeholder="Sunset Horizon Deck"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Sunset Heading Highlight
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetHeadingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetHeadingHighlight: e.target.value },
                                }))
                              }
                              placeholder="• Golden Hour Rhythms"
                              className="rounded-xl bg-slate-800 border-slate-700 text-amber-400 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Sunset Subtitle Narrative
                          </label>
                          <Textarea
                            value={aboutForm.rooftop.sunsetSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                rooftop: { ...prev.rooftop, sunsetSubtitle: e.target.value },
                              }))
                            }
                            rows={3}
                            placeholder="As the sun dips below the Indian Ocean horizon..."
                            className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-medium leading-relaxed"
                          />
                        </div>

                        {/* Sunset Card 1 */}
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-400/20 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" /> Sunset Feature Card 1 (Craft Sun-Downers)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Time Tag</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard1Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard1Tag: e.target.value },
                                  }))
                                }
                                placeholder="5:00 PM – 9:30 PM"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard1Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard1Title: e.target.value },
                                  }))
                                }
                                placeholder="Craft Sun-Downers"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.sunsetCard1Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetCard1Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Signature island-infused mocktails..."
                              className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Sunset Card 2 */}
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-400/20 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <Sunset className="w-3.5 h-3.5 text-amber-400" /> Sunset Feature Card 2 (Golden Hour Ocean Vista)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Vantage Tag</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard2Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard2Tag: e.target.value },
                                  }))
                                }
                                placeholder="360° Sunset Horizon"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard2Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard2Title: e.target.value },
                                  }))
                                }
                                placeholder="Golden Hour Ocean Vista"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.sunsetCard2Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetCard2Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Watch the southern sky ignite..."
                              className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Sunset Bottom Micro-Strip Perks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Micro Perk 1</label>
                            <Input
                              value={aboutForm.rooftop.sunsetPerk1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetPerk1: e.target.value },
                                }))
                              }
                              placeholder="Ambient dusk acoustics"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Micro Perk 2</label>
                            <Input
                              value={aboutForm.rooftop.sunsetPerk2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetPerk2: e.target.value },
                                }))
                              }
                              placeholder="Resident VIP seating"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Sunset Showcase & Photo */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Dusk Vista Media & Reassurance Dock
                          </span>
                        </div>

                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-amber-400/30 shadow-md bg-slate-800">
                          <img
                            src={aboutForm.rooftop.sunsetImageUrl || "/gallery-sunset.png"}
                            alt="Golden Hour Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/95 backdrop-blur-md shadow-xs border border-amber-400/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-white">
                              {aboutForm.rooftop.sunsetImageTag || "Golden Hour Vista Deck"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Status Badge Text
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetImageTag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetImageTag: e.target.value },
                                }))
                              }
                              placeholder="Golden Hour Vista Deck"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/gallery-sunset.png"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold font-mono"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-400/40 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 cursor-pointer transition-colors">
                              {isUploadingSunsetImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Golden Hour Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingSunsetImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadSunsetImage(f);
                                }}
                              />
                            </label>
                          </div>

                          <div className="pt-2 border-t border-white/10 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1">
                                Bottom Reassurance Note
                              </label>
                              <Input
                                value={aboutForm.rooftop.sunsetDockNote}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetDockNote: e.target.value },
                                  }))
                                }
                                placeholder="Weligama's premier sunset vista. Resident priority seating."
                                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1">
                                Reassurance Hours Tag
                              </label>
                              <Input
                                value={aboutForm.rooftop.sunsetDockTime}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetDockTime: e.target.value },
                                  }))
                                }
                                placeholder="5PM - 9:30PM"
                                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LIVE INTERACTIVE ATMOSPHERE SHIFT SIMULATOR PREVIEW */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Atmosphere Shift Simulator Preview
                        </h4>
                      </div>
                      {/* Interactive toggle for the preview */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setPreviewActiveAtmosphereTab("morning")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                            previewActiveAtmosphereTab === "morning"
                              ? "bg-[#0B3D5E] text-white shadow-xs"
                              : "text-slate-600 hover:text-[#0B3D5E]"
                          }`}
                        >
                          <Coffee className="w-3 h-3 text-amber-400" />
                          <span>{aboutForm.rooftop.tab1Label || "Morning Vibes"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewActiveAtmosphereTab("sunset")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                            previewActiveAtmosphereTab === "sunset"
                              ? "bg-amber-500 text-slate-950 shadow-xs"
                              : "text-slate-600 hover:text-[#0B3D5E]"
                          }`}
                        >
                          <Sunset className="w-3 h-3 text-slate-900" />
                          <span>{aboutForm.rooftop.tab2Label || "Golden Hour"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview Container mirroring Section 5 */}
                    <div
                      className={`relative p-6 sm:p-10 rounded-3xl transition-all duration-700 shadow-xl overflow-hidden border ${
                        previewActiveAtmosphereTab === "sunset"
                          ? "border-amber-400/25 shadow-[0_24px_60px_rgba(7,30,46,0.45)] text-white"
                          : "border-white/85 shadow-[0_24px_60px_rgba(11,61,94,0.08)] text-slate-800"
                      }`}
                      style={{
                        background: previewActiveAtmosphereTab === "sunset"
                          ? "linear-gradient(140deg, rgba(7,30,46,0.96) 0%, rgba(11,46,70,0.93) 50%, rgba(18,57,84,0.95) 100%)"
                          : "linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.92) 50%, rgba(240,247,253,0.94) 100%)",
                      }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left: Copy & Cards */}
                        <div className="lg:col-span-7 space-y-6">
                          {/* Eyebrow */}
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md"
                            style={{
                              background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.12)" : "#FEF3C7",
                              borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.3)" : "#FDE68A",
                              color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#B45309",
                            }}
                          >
                            {previewActiveAtmosphereTab === "sunset" ? (
                              <Sunset className="w-3.5 h-3.5" />
                            ) : (
                              <Coffee className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetBadge || "Sunset Horizon Deck"
                                : aboutForm.rooftop.morningBadge || "Scenic Culinary Rooftop"}
                            </span>
                          </div>

                          {/* Headline */}
                          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight">
                            <span>{aboutForm.rooftop.headingLead || "The Rooftop Café"} </span>
                            <span className="italic font-serif" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#D97706" }}>
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetHeadingHighlight || "• Golden Hour Rhythms"
                                : aboutForm.rooftop.morningHeadingHighlight || "• Sunrise Roasts & Vistas"}
                            </span>
                          </h2>

                          {/* Subtitle */}
                          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#94A3B8" : "#475569" }}>
                            {previewActiveAtmosphereTab === "sunset"
                              ? aboutForm.rooftop.sunsetSubtitle || "As the sun dips below the Indian Ocean horizon..."
                              : aboutForm.rooftop.morningSubtitle || "Wake up to freshly roasted Sri Lankan highland espresso..."}
                          </p>

                          {/* Atmosphere Shift Badge Simulator */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#94A3B8" : "#64748B" }}>
                              Atmosphere Shift:
                            </span>
                            <div className="inline-flex items-center p-1 rounded-full border border-slate-300/40 bg-black/10 backdrop-blur-md">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                previewActiveAtmosphereTab === "morning"
                                  ? "bg-[#0B3D5E] text-white shadow-xs"
                                  : "text-slate-400"
                              }`}>
                                ☀️ {aboutForm.rooftop.tab1Label || "Morning Vibes"}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                previewActiveAtmosphereTab === "sunset"
                                  ? "bg-amber-500 text-slate-950 shadow-xs"
                                  : "text-slate-400"
                              }`}>
                                🌅 {aboutForm.rooftop.tab2Label || "Golden Hour"}
                              </span>
                            </div>
                          </div>

                          {/* Dual Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Card 1 */}
                            <div
                              className="p-4 rounded-2xl border transition-all"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.6)" : "rgba(255,255,255,0.8)",
                                borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "#E2E8F0",
                              }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5"
                                style={{
                                  background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.15)" : "#FEF3C7",
                                  color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#B45309",
                                }}
                              >
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Tag || "5:00 PM – 9:30 PM"
                                  : aboutForm.rooftop.morningCard1Tag || "7:00 AM – 11:30 AM"}
                              </span>
                              <h4 className="text-sm font-bold font-serif mb-1" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FFFFFF" : "#0B3D5E" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Title || "Craft Sun-Downers"
                                  : aboutForm.rooftop.morningCard1Title || "Artisan Roasts & Bowls"}
                              </h4>
                              <p className="text-[11px] leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#CBD5E1" : "#64748B" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Desc || "Signature island-infused mocktails..."
                                  : aboutForm.rooftop.morningCard1Desc || "Fresh single-origin Ceylon espresso..."}
                              </p>
                            </div>

                            {/* Card 2 */}
                            <div
                              className="p-4 rounded-2xl border transition-all"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.6)" : "rgba(255,255,255,0.8)",
                                borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "#E2E8F0",
                              }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5"
                                style={{
                                  background: previewActiveAtmosphereTab === "sunset" ? "rgba(56,189,248,0.15)" : "#E0F2FE",
                                  color: previewActiveAtmosphereTab === "sunset" ? "#38BDF8" : "#0369A1",
                                }}
                              >
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Tag || "360° Sunset Horizon"
                                  : aboutForm.rooftop.morningCard2Tag || "180° Panoramic Vantage"}
                              </span>
                              <h4 className="text-sm font-bold font-serif mb-1" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FFFFFF" : "#0B3D5E" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Title || "Golden Hour Ocean Vista"
                                  : aboutForm.rooftop.morningCard2Title || "Dawn Surf Conditions"}
                              </h4>
                              <p className="text-[11px] leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#CBD5E1" : "#64748B" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Desc || "Watch the southern sky ignite..."
                                  : aboutForm.rooftop.morningCard2Desc || "Check Weligama Bay wave sets..."}
                              </p>
                            </div>
                          </div>

                          {/* Micro-perks strip */}
                          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-bold" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#E2E8F0" : "#475569" }}>
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetPerk1 || "Ambient dusk acoustics"
                                : aboutForm.rooftop.morningPerk1 || "Organic local ingredients"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Wifi className="w-3.5 h-3.5 text-[#0B3D5E]" />
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetPerk2 || "Resident VIP seating"
                                : aboutForm.rooftop.morningPerk2 || "High-speed terrace Wi-Fi"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Floating Media & Reassurance Dock */}
                        <div className="lg:col-span-5 relative">
                          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                            <img
                              src={
                                previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetImageUrl || "/gallery-sunset.png"
                                  : aboutForm.rooftop.morningImageUrl || "/morning-vibe.png"
                              }
                              alt="Rooftop Vista Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span className="text-[10px] font-bold text-white">
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetImageTag || "Golden Hour Vista Deck"
                                  : aboutForm.rooftop.morningImageTag || "Morning Sunrise Service"}
                              </span>
                            </div>
                          </div>

                          {/* Floating Dock */}
                          <div
                            className="mt-3 p-3 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 shadow-lg"
                            style={{
                              background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.85)" : "rgba(255,255,255,0.9)",
                              borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.3)" : "#E2E8F0",
                            }}
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#F1F5F9" : "#0B3D5E" }}>
                              <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-[11px] truncate">
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetDockNote || "Weligama's premier sunset vista. Resident priority seating."
                                  : aboutForm.rooftop.morningDockNote || "Complimentary breakfast & espresso for resident bookings."}
                              </span>
                            </div>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] shrink-0"
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

content = content.replace(needle, sec5_ui, 1)

with open(SETTINGS_FILE, "w") as f:
    f.write(content)

print("Section 5 UI successfully inserted into settings.tsx!")
