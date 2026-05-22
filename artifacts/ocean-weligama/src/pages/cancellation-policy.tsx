import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export default function CancellationPolicyPage() {
  return (
    <>
      <PageHero
        title="Payment & Cancellation Policy"
        description="Clear, transparent booking terms to give you total peace of mind"
      />

      <main className="bg-background min-h-screen">
        {/* Intro strip */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Payment Policy
                </h2>
              </div>

              <div className="bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 space-y-4">
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  To confirm your reservation at Ocean Air,{" "}
                  <span className="font-semibold text-foreground">
                    full payment is required in advance.
                  </span>
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  Once you send us your reservation request, we will send you a{" "}
                  <span className="font-semibold text-foreground">
                    secure payment link
                  </span>{" "}
                  with all booking details to complete your reservation confirmation.
                </p>
              </div>
            </motion.div>

            {/* Cancellation Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Cancellation &amp; Modification Policy
                </h2>
              </div>

              <div className="space-y-4">
                {/* Rule 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex gap-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-5 sm:p-6"
                >
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">30+ Days Before Arrival</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      Cancellations or booking modifications made{" "}
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        30 days or more before arrival
                      </span>{" "}
                      are{" "}
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        fully refundable.
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Rule 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="flex gap-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5 sm:p-6"
                >
                  <div className="mt-0.5 shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Within 30 Days of Arrival</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      Cancellations or modifications made{" "}
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        within 30 days of arrival
                      </span>{" "}
                      will be charged the{" "}
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        total reservation amount.
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Rule 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="flex gap-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-2xl p-5 sm:p-6"
                >
                  <div className="mt-0.5 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">No-Show</p>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      In case of a no-show, the{" "}
                      <span className="font-semibold text-rose-700 dark:text-rose-400">
                        full booking amount will be charged.
                      </span>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Closing note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary/5 border border-primary/15 rounded-2xl p-6 sm:p-8 text-center"
            >
              <p className="text-foreground/70 leading-relaxed text-sm sm:text-base italic">
                We appreciate your understanding and support, as every reservation helps us
                continue growing and providing the best experience for our guests.
              </p>
              <p className="mt-4 text-foreground/50 text-xs">
                If you have any questions about our policy, please don't hesitate to{" "}
                <a
                  href="/contact"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  contact us
                </a>
                .
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
