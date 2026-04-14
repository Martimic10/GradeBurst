"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Zap,
  Star,
  Flame,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  Cpu,
  ImagePlus,
  RefreshCw,
} from "lucide-react";

/* ─── Types / data ─────────────────────────────────────────────────── */

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const fadeUp = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

type Plan = {
  id: string;
  name: string;
  price: number;
  scans: number;
  pricePerScan: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
  features: string[];
  highlighted: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    scans: 10,
    pricePerScan: "$0.90",
    icon: Zap,
    description: "Perfect for testing the waters or grading a small batch.",
    features: [
      "10 card scans",
      "PSA-style grade estimate (1–10)",
      "Full subgrade breakdown",
      "Detailed reasoning per card",
      "Downloadable results",
      "Credits never expire",
    ],
    highlighted: false,
  },
  {
    id: "collector",
    name: "Collector",
    price: 19,
    scans: 30,
    pricePerScan: "$0.63",
    icon: Star,
    badge: "Most Popular",
    description: "The sweet spot for serious collectors screening a set.",
    features: [
      "30 card scans",
      "PSA-style grade estimate (1–10)",
      "Full subgrade breakdown",
      "Detailed reasoning per card",
      "Downloadable results",
      "Credits never expire",
      "Priority processing",
    ],
    highlighted: true,
  },
  {
    id: "flipper",
    name: "Flipper",
    price: 39,
    scans: 75,
    pricePerScan: "$0.52",
    icon: Flame,
    description: "Built for resellers and high-volume collectors.",
    features: [
      "75 card scans",
      "PSA-style grade estimate (1–10)",
      "Full subgrade breakdown",
      "Detailed reasoning per card",
      "Downloadable results",
      "Credits never expire",
      "Priority processing",
      "Bulk upload (up to 10 at once)",
    ],
    highlighted: false,
  },
];

/* ─── Feature comparison ───────────────────────────────────────────── */

type FeatureRow = {
  label: string;
  icon: React.ElementType;
  starter: string | boolean;
  collector: string | boolean;
  flipper: string | boolean;
};

const features: FeatureRow[] = [
  {
    label: "Card scans included",
    icon: ImagePlus,
    starter: "10 scans",
    collector: "30 scans",
    flipper: "75 scans",
  },
  {
    label: "Price per scan",
    icon: BarChart3,
    starter: "$0.90",
    collector: "$0.63",
    flipper: "$0.52",
  },
  {
    label: "PSA-style grade (1–10)",
    icon: ShieldCheck,
    starter: true,
    collector: true,
    flipper: true,
  },
  {
    label: "Subgrade breakdown",
    icon: Cpu,
    starter: true,
    collector: true,
    flipper: true,
  },
  {
    label: "Credits never expire",
    icon: RefreshCw,
    starter: true,
    collector: true,
    flipper: true,
  },
  {
    label: "Priority processing",
    icon: Zap,
    starter: false,
    collector: true,
    flipper: true,
  },
  {
    label: "Bulk upload (10 at once)",
    icon: ImagePlus,
    starter: false,
    collector: false,
    flipper: true,
  },
];

/* ─── FAQ data ─────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "How accurate is the grade estimate?",
    a: "GradeBurst uses a computer vision model trained on thousands of professionally graded cards. Our estimates are typically within 0.5–1 grade point of the actual PSA result. Think of it as a high-confidence pre-screen, not a certified grade.",
  },
  {
    q: "What counts as one scan?",
    a: "One scan = one card analysis. Upload a front image (and optionally a back image) of a single card, and we'll consume one credit from your balance.",
  },
  {
    q: "Do my credits expire?",
    a: "Never. Credits you purchase are yours to use whenever you're ready — no monthly resets, no expiry dates.",
  },
  {
    q: "Can I use this for Pokémon cards and sports cards?",
    a: "Yes. GradeBurst is trained on both Pokémon cards (Base Set through modern era) and major sports card brands including Topps, Panini, Upper Deck, and Bowman.",
  },
  {
    q: "Is this the same as PSA or Beckett grading?",
    a: "No — GradeBurst provides AI-generated estimates only. We are not affiliated with PSA, Beckett, or any grading company. Our grades are meant to help you decide which cards are worth submitting, not to replace official graded slabs.",
  },
  {
    q: "What image quality do I need?",
    a: "A clear, well-lit photo taken in natural light works best. Avoid glare, shadows, and blur. Most modern smartphone cameras produce sufficient quality.",
  },
];

/* ─── Sub-components ───────────────────────────────────────────────── */

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
  const Icon = plan.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 transition-all duration-300",
        plan.highlighted
          ? "border-cyan-accent/50 bg-card shadow-2xl shadow-cyan-glow scale-[1.02]"
          : "border-border/60 bg-card hover:border-cyan-accent/30"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-cyan-accent text-white border-0 px-3 py-0.5 text-xs font-semibold shadow-md">
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center border",
            plan.highlighted
              ? "bg-cyan-muted border-cyan-accent/50"
              : "bg-muted border-border"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              plan.highlighted ? "text-cyan-accent" : "text-muted-foreground"
            )}
          />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-[15px]">{plan.name}</h3>
          <p className="text-xs text-muted-foreground">{plan.scans} scans</p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">${plan.price}</span>
          <span className="text-sm text-muted-foreground">one-time</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{plan.pricePerScan} per scan</p>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>

      {/* CTA */}
      <Link
        href="/auth"
        className={cn(
          "w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold mb-6 transition-all duration-200",
          plan.highlighted
            ? "bg-slate-900 text-white hover:bg-slate-700 shadow-md"
            : "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200"
        )}
      >
        Get {plan.scans} Scans
      </Link>

      {/* Features */}
      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <CheckCircle2 className="w-4 h-4 text-cyan-accent mx-auto" />;
  }
  if (value === false) {
    return <span className="text-muted-foreground/40 text-lg mx-auto block text-center">—</span>;
  }
  return <span className="text-sm text-foreground font-medium">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-muted/40 transition-colors duration-200"
      >
        <span className="font-medium text-sm text-foreground">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-64 bg-cyan-muted rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-3xl mx-auto px-6 text-center space-y-5"
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="border-cyan-accent/40 text-cyan-accent bg-cyan-muted px-3 py-1 text-xs font-medium"
            >
              No subscriptions. Ever.
            </Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Simple, credit-based pricing
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            Buy scans when you need them. Credits never expire. No monthly fees, no surprises.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid md:grid-cols-3 gap-5 items-start"
          >
            {plans.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} />
            ))}
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ y: 8 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-8 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-accent" />
            Secure checkout · Credits never expire · Not affiliated with PSA or Beckett
          </motion.p>
        </div>
      </section>

      {/* ── Feature comparison ── */}
      <section className="py-24 border-t border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-12"
          >
            <motion.div variants={fadeUp} className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Compare plans</h2>
              <p className="text-muted-foreground">Everything you get with each tier</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="overflow-x-auto rounded-2xl border border-border/60 bg-card"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground w-1/2">
                      Feature
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.id}
                        className={cn(
                          "px-4 py-4 font-semibold text-center",
                          p.highlighted ? "text-cyan-accent" : "text-foreground"
                        )}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map(({ label, icon: Icon, starter, collector, flipper }, i) => (
                    <tr
                      key={label}
                      className={cn(
                        "border-b border-border/40 last:border-0",
                        i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                      )}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-foreground text-sm">{label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <FeatureCell value={starter} />
                      </td>
                      <td className="px-4 py-3.5 text-center bg-cyan-muted/40">
                        <FeatureCell value={collector} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <FeatureCell value={flipper} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know before you burst your first card.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-3">
              {faqs.map((faq) => (
                <motion.div key={faq.q} variants={fadeUp}>
                  <FaqItem q={faq.q} a={faq.a} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Still have questions?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start with 10 scans for $9 and see the results for yourself.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors duration-200 shadow-md"
              >
                <Zap className="w-4 h-4" />
                Start with Starter — $9
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center h-12 px-5 rounded-full text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200"
              >
                Learn how it works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
