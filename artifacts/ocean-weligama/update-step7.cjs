const fs = require('fs');
const filePath = '/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/artifacts/ocean-weligama/src/pages/booking.tsx';

let content = fs.readFileSync(filePath, 'utf8');

const oldStep7Regex = /\{\/\* ══════════════════════════════════════════════════════════════\n\s*STEP 7 — Confirm & Pay\n\s*══════════════════════════════════════════════════════════════ \*\/\}\n\s*\{step === 7 && \([\s\S]*?\}\n\s*\)\}\n\n\s*<\/AnimatePresence>/;

const newStep7 = `            {/* ══════════════════════════════════════════════════════════════
                STEP 7 — Confirm & Pay
            ══════════════════════════════════════════════════════════════ */}
            {step === 7 && (
              <motion.div
                key="s7" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="max-w-4xl mx-auto"
              >
                <StepHeader
                  n={7} iconBg="bg-primary/10"
                  icon={<CreditCard className="w-9 h-9 text-primary" />}
                  title="Review & Confirm"
                  sub="Please review your island journey details before completing your booking."
                />

                <div className="space-y-10">
                  {/* ── BIG CONFIRMATION BOX ── */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] border border-border shadow-xl p-6 md:p-10 space-y-8"
                  >
                    <div className="flex items-center justify-between pb-6 border-b border-border/50">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Booking Summary</h2>
                        <span className="font-serif font-black text-primary text-3xl">Your Island Sanctuary</span>
                      </div>
                    </div>

                    {/* Room & Stay */}
                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        <Home className="w-4 h-4" /> Stay Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="flex gap-4 items-center">
                          {selectedRoom?.heroImageUrl && (
                            <img src={selectedRoom.heroImageUrl} alt={selectedRoom.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Room</p>
                            <p className="font-bold text-foreground text-lg leading-tight mb-1">{selectedRoom?.name}</p>
                            <p className="text-sm text-muted-foreground">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</p>
                          </div>
                        </div>
                        <div className="flex gap-6 md:justify-end">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-in</p>
                            <p className="font-bold text-lg">{fmt(dateRange.from)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-out</p>
                            <p className="font-bold text-lg">{fmt(dateRange.to)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Packages & Experiences */}
                    {selectedDbServiceIds.length > 0 && (
                      <div className="bg-emerald-50/30 border border-emerald-100/50 p-6 rounded-3xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Add-Ons & Packages
                        </h3>
                        <div className="space-y-4">
                          {selectedDbServiceIds.map(id => {
                            const svc = Array.isArray(services) ? services.find(s => s.id === id) : null;
                            if (!svc) return null;
                            const isPackage = svc.type === "main" || svc.category?.toLowerCase()?.includes("package");
                            
                            const basePrice = parseFloat(svc.basePrice || "0");
                            let qty = 1;
                            if (svc.unit === "per_person") qty = guestCount;
                            else if (svc.unit === "per_day") qty = nights;
                            const svcSubtotal = basePrice * qty;

                            if (isPackage) {
                              const tag = svc.category ? (svc.category.toLowerCase().includes("surf") ? "SURF" : svc.category.toUpperCase()) : "SURF";
                              return (
                                <div key={id} className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 p-6">
                                  <div className="relative w-full md:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-emerald-50">
                                    {svc.imageUrl || svc.heroImageUrl ? (
                                      <img src={svc.imageUrl || svc.heroImageUrl} alt={svc.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Award className="w-8 h-8 text-emerald-200" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                      <h4 className="text-lg font-serif font-black text-[#0B3D5E] leading-tight">{svc.name}</h4>
                                      <span className="font-black text-xl text-[#0B3D5E]">€{svcSubtotal.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mb-2">{svc.slug || svc.name.toLowerCase().replace(/ /g, "-")}</p>
                                    <div className="mt-2 text-xs text-slate-500 font-bold">Quantity: {qty}</div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div key={id} className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 items-center">
                                {svc.heroImageUrl && (
                                  <img src={svc.heroImageUrl} alt={svc.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                )}
                                <div className="flex-1">
                                  <p className="font-bold text-emerald-900 text-base">{svc.name}</p>
                                  <p className="text-xs text-emerald-700 font-bold mt-1">Quantity: {qty}</p>
                                </div>
                                <span className="font-bold text-lg text-emerald-700">€{svcSubtotal.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Airport Transfers */}
                    {(watchPickup || watchDrop) && (
                      <div className="bg-sky-50/30 border border-sky-100/50 p-6 rounded-3xl">
                        <h3 className="text-sm font-black uppercase tracking-widest text-sky-800 mb-6 flex items-center gap-2">
                          <Plane className="w-4 h-4" /> Airport Transfer (Pay on Arrival)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {watchPickup && (
                            <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                                  <Plane className="w-4 h-4 text-sky-600" /> Pick-up
                                </span>
                                <span className="font-bold text-sky-800">€{ap.pickup}</span>
                              </div>
                              <div className="text-xs text-sky-900/80 space-y-1">
                                <p><strong>Flight:</strong> {form.watch("flightNumber") || "TBA"}</p>
                                <p><strong>Arrival:</strong> {form.watch("flightDate") || "TBA"} at {form.watch("flightTime") || "TBA"}</p>
                                <p><strong>Surfboard:</strong> {watchSurfboard ? "Yes" : "No"}</p>
                              </div>
                            </div>
                          )}
                          {watchDrop && (
                            <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                                  <Plane className="w-4 h-4 text-indigo-600 rotate-180" /> Drop-off
                                </span>
                                <span className="font-bold text-indigo-800">€{ap.drop}</span>
                              </div>
                              <p className="text-xs text-indigo-900/80">Scheduled return to CMB Airport.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-sm mt-8">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Payment Summary
                      </h3>
                      <div className="space-y-4 pb-6 border-b border-border text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground font-medium">Room ({nights} nights)</span>
                          <span className="font-bold text-foreground text-base">€{priceData?.roomSubtotal || "0.00"}</span>
                        </div>
                        {parseFloat(priceData?.cleaningFee || "0") > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium">Cleaning Fee</span>
                            <span className="font-bold text-foreground text-base">€{priceData?.cleaningFee}</span>
                          </div>
                        )}
                        {selectedDbServiceIds.length > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium">Add-ons & Packages</span>
                            <span className="font-bold text-foreground text-base">
                              €{(parseFloat(computedTotal) - parseFloat(priceData?.roomSubtotal || "0") - parseFloat(priceData?.cleaningFee || "0")).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-6 gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full md:w-auto">
                          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Best Price Guaranteed</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-lg text-foreground mb-1">Total Online Payment</span>
                          <span className="font-black text-5xl text-primary">€{computedTotal} <span className="text-sm text-muted-foreground font-bold ml-1">EUR</span></span>
                          {airportTotal > 0 && (
                            <p className="text-xs text-muted-foreground mt-2 font-bold">+ €{airportTotal} Airport Transfer (Pay on Arrival)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ── FORM SECTIONS ── */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                  >
                    <form className="space-y-8">
                      {/* Details card */}
                      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                          <Users className="w-5 h-5" /> Your Details
                        </h3>

                        <FormField control={form.control} name="guestFullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Maria Santos" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <div className="grid sm:grid-cols-2 gap-5">
                          <FormField control={form.control} name="guestEmail" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="maria@example.com" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="guestPhone" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Phone / WhatsApp</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 555 000 0000" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="guestNationality" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Nationality</FormLabel>
                            <FormControl>
                              <Input placeholder="Spanish" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="specialRequests" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Special Requests (optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Early check-in, dietary needs, surf level…" rows={3} className="rounded-2xl border-muted bg-muted/20 focus:bg-white p-5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {/* Payment card */}
                      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" /> Payment Method
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { v: "bank_transfer", label: "Bank Transfer",  desc: "Secure wire"     },
                            { v: "cash",          label: "Pay on Arrival", desc: "Island payment"  },
                            { v: "online_card",   label: "Online Card",    desc: "Link to email"   },
                          ].map(opt => (
                            <button
                              key={opt.v}
                              type="button"
                              onClick={() => form.setValue("paymentMethod", opt.v as any)}
                              className={\`p-6 rounded-2xl border-2 text-center transition-all duration-300 \${
                                form.watch("paymentMethod") === opt.v
                                  ? "border-primary bg-primary/5 shadow-lg scale-[1.03]"
                                  : "border-border hover:border-primary/20 bg-muted/5"
                              }\`}
                            >
                              <p className="font-bold text-base mb-1">{opt.label}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Terms + Submit card */}
                      <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 space-y-8">
                        <FormField control={form.control} name="agreeTerms" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <input
                                  type="checkbox"
                                  checked={field.value === true}
                                  onChange={e => field.onChange(e.target.checked ? true : undefined)}
                                  className="w-5 h-5 rounded border-muted accent-primary"
                                />
                                <span className="text-sm font-bold text-foreground">
                                  I agree to the{" "}
                                  <span className="text-primary underline cursor-pointer hover:text-primary/80">terms and island policies</span>.
                                </span>
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-border">
                          <button
                            type="button"
                            onClick={() => goTo(6)}
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted w-full sm:w-auto justify-center"
                          >
                            <ChevronLeft className="w-4 h-4" /> Back
                          </button>

                          <button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={createBook.isPending || !form.watch("agreeTerms")}
                            className="w-full sm:w-auto px-10 bg-accent text-primary hover:bg-yellow-300 rounded-full h-16 text-xl font-bold shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                          >
                            {createBook.isPending ? "Confirming…" : "Confirm My Sanctuary"}
                            <Check className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </motion.div>
            )}

            </AnimatePresence>`;

if (!oldStep7Regex.test(content)) {
  console.log("Could not find step 7 block!");
  process.exit(1);
}

content = content.replace(oldStep7Regex, newStep7);

fs.writeFileSync(filePath, content);
console.log("Updated step 7");
