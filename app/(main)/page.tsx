"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Upload,
  Cpu,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Play,
} from "lucide-react";

/* ─── Animation helpers ────────────────────────────────────────────── */

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const fadeUp = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Pain points ──────────────────────────────────────────────────── */

const problems = [
  {
    icon: DollarSign,
    label: "PSA charges $25–$150+ per card",
    sub: "Fees add up fast on large collections",
  },
  {
    icon: Clock,
    label: "Months of turnaround time",
    sub: "Even express service takes weeks",
  },
  {
    icon: TrendingUp,
    label: "No way to pre-screen your cards",
    sub: "You're guessing before you submit",
  },
];

const solutions = [
  "Instant results — no waiting",
  "Fraction of the cost",
  "Screen cards before you submit",
  "Know which cards are worth submitting",
];

const faqs = [
  {
    question: "How accurate are the grade estimates?",
    answer:
      "Our AI analyzes condition, centering, and visual cues to give a high-fidelity grading prediction, but official PSA grades still require submission.",
  },
  {
    question: "Do I need to ship my cards?",
    answer:
      "No shipping is required. You simply upload photos and receive an instant estimate so you can decide before committing to grading fees.",
  },
  {
    question: "What card types are supported?",
    answer:
      "We support sports cards, Pokémon, and other trading cards with standard front/back photo uploads.",
  },
  {
    question: "Can I use this for bulk collections?",
    answer:
      "Yes — our pricing works per scan so you can evaluate collections in batches without paying full grading fees upfront.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/60 rounded-3xl overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-muted/40 transition-colors duration-200"
      >
        <span className="font-medium text-sm text-foreground">{question}</span>
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
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── How It Works (interactive) ───────────────────────────────────── */

const howItWorksSteps = [
  {
    icon: Upload,
    title: "Upload Your Card",
    description:
      "Take a photo of your card — front and back — and upload it directly from your phone or desktop. No shipping, no waiting.",
    mock: (
      <div className="w-full max-w-65 mx-auto space-y-3">
        <div className="w-full aspect-3/4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center">
            <Upload className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Drop card image here</p>
          <span className="text-[10px] text-slate-300">PNG or JPG, up to 10 MB</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-16 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
              <Upload className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Front</span>
          </div>
          <div className="flex-1 h-16 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
              <Upload className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Back</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Cpu,
    title: "AI Analyzes It",
    description:
      "Our model inspects centering, corners, edges, and surface condition in seconds — the exact criteria PSA graders use.",
    mock: (
      <div className="w-full max-w-65 mx-auto space-y-3">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">Analyzing card…</span>
            <span className="text-[11px] font-bold text-cyan-500">87%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-cyan-400"
              initial={{ width: "0%" }}
              animate={{ width: "87%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="space-y-3 pt-1">
            {[
              { label: "Centering", val: "9.0", pct: "90%" },
              { label: "Corners",   val: "8.5", pct: "85%" },
              { label: "Edges",     val: "9.5", pct: "95%" },
              { label: "Surface",   val: "9.0", pct: "90%" },
            ].map(({ label, val, pct }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-700">{val}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-slate-300"
                    initial={{ width: "0%" }}
                    animate={{ width: pct }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 px-4 py-3 flex items-center gap-3">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="text-[11px] text-slate-300">AI model running visual inspection…</p>
        </div>
      </div>
    ),
  },
  {
    icon: TrendingUp,
    title: "Get Your Grade Estimate",
    description:
      "Receive a PSA-style grade from 1–10 with a full subgrade breakdown — centering, corners, edges, and surface — plus the reasoning behind it.",
    mock: (
      <div className="w-full max-w-65 mx-auto space-y-3">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Est. PSA Grade</p>
              <p className="text-5xl font-bold text-cyan-500 leading-none mt-0.5">9</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest">Confidence</p>
              <p className="text-xl font-bold text-slate-700 leading-none mt-0.5">87%</p>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            {[
              { label: "Centering", score: "9.0", w: "90%" },
              { label: "Corners",   score: "8.5", w: "85%" },
              { label: "Edges",     score: "9.5", w: "95%" },
              { label: "Surface",   score: "9.0", w: "90%" },
            ].map(({ label, score, w }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 w-14 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: w }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 w-5 text-right">{score}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">AI Confidence</span>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 4 ? "bg-cyan-400" : "bg-slate-600"}`} />
            ))}
            <span className="text-[11px] text-slate-300 ml-1">High</span>
          </div>
        </div>
      </div>
    ),
  },
];

function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-28 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="text-center mb-16 space-y-3"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Simple Steps
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight">
            How it works
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm max-w-md mx-auto">
            No confusion or delays. Just fast and reliable grading estimates.
          </motion.p>
        </motion.div>

        {/* Two-column */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          {/* Left: animated mock panel */}
          <motion.div
            variants={fadeUp}
            className="rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden h-130 flex items-center justify-center p-8 relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                exit={{ y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="w-full"
              >
                {howItWorksSteps[active].mock}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: clickable step list */}
          <motion.div variants={stagger} className="flex flex-col gap-0">
            {howItWorksSteps.map(({ icon: Icon, title, description }, i) => {
              const isActive = active === i;
              const isLast = i === howItWorksSteps.length - 1;
              return (
                <motion.button
                  key={title}
                  variants={fadeUp}
                  onClick={() => setActive(i)}
                  className="flex gap-5 text-left w-full group focus:outline-none"
                >
                  {/* Icon + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-200 shrink-0",
                        isActive
                          ? "bg-cyan-500 border border-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                          : "bg-white border border-slate-200 group-hover:border-cyan-300"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors duration-200", isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-500")} />
                    </div>
                    {!isLast && (
                      <div className={cn("w-px flex-1 my-2 transition-colors duration-300", isActive ? "bg-cyan-200" : "bg-slate-200")} />
                    )}
                  </div>

                  {/* Text */}
                  <div className={cn("pt-1.5 transition-all duration-200", isLast ? "pb-0" : "pb-10")}>
                    <h3 className={cn("font-semibold mb-1.5 transition-colors duration-200", isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700")}>
                      {title}
                    </h3>
                    <p className={cn("text-sm leading-relaxed transition-colors duration-200", isActive ? "text-slate-500" : "text-slate-300 group-hover:text-slate-400")}>
                      {description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] bg-white text-slate-900">
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-24 lg:pt-28 lg:pb-20 w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto text-center space-y-7"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.08]"
            >
              <span className="bg-linear-to-r from-blue-500 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Optimize Your Card Grading
              </span>
              <br />
              <span className="bg-linear-to-r from-blue-500 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                with AI-Driven Predictions
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              AI-driven insights to forecast card quality, optimize grading submissions, and
              boost ROI. Make smarter decisions with condition data in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700 shadow-md"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 hover:border-slate-400"
              >
                <Play className="w-4 h-4 fill-current" />
                View Pricing
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="relative mt-16 mx-auto flex justify-center"
          >
            <Image
              src="/gradeburst-mockup-removebg-preview.png"
              alt="GradeBurst app mockup"
              width={520}
              height={600}
              className="w-full max-w-lg drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-16 items-start"
          >
            {/* Problem */}
            <div className="space-y-8">
              <motion.div variants={fadeUp} className="space-y-3">
                <Badge
                  variant="outline"
                  className="border-rose-500/30 text-rose-500 bg-rose-500/8 px-3 py-1 text-xs"
                >
                  The Problem
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">
                  PSA grading is slow, expensive, and opaque.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Submitting cards blindly costs collectors hundreds in fees every year with no
                  way to know if a card is worth grading until it comes back.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="space-y-4">
                {problems.map(({ icon: Icon, label, sub }) => (
                  <motion.div
                    key={label}
                    variants={fadeUp}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border/60 bg-card"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Solution */}
            <div className="space-y-8">
              <motion.div variants={fadeUp} className="space-y-3">
                <Badge
                  variant="outline"
                  className="border-cyan-accent/40 text-cyan-accent bg-cyan-muted px-3 py-1 text-xs"
                >
                  The Solution
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">
                  GradeBurst gives you the answer first.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Know your card&apos;s grade estimate instantly. Screen your collection before
                  spending a dime on submissions.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="space-y-3">
                {solutions.map((text) => (
                  <motion.div
                    key={text}
                    variants={fadeUp}
                    className="flex items-center gap-3 p-4 rounded-xl border border-cyan-accent/20 bg-cyan-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── FAQs ── */}
      <section className="py-24 border-t border-border/50 bg-muted/30">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="space-y-10"
          >
            <motion.div variants={fadeUp} className="text-center space-y-3">
              <Badge variant="outline" className="border-cyan-accent/40 text-cyan-accent bg-cyan-muted px-3 py-1 text-xs">
                FAQs
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Common questions from collectors</h2>
              <p className="text-muted-foreground">
                Everything you need to know before you upload cards and start grading smarter.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-3">
              {faqs.map(({ question, answer }) => (
                <motion.div key={question} variants={fadeUp}>
                  <FaqItem question={question} answer={answer} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="relative overflow-hidden rounded-3xl border border-cyan-accent/20 bg-cyan-muted p-12 text-center"
          >
            <div className="absolute inset-0 bg-linear-to-br from-cyan-muted via-transparent to-transparent pointer-events-none" />
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to know what your cards are worth?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Start with 10 scans for $9. No subscriptions. Buy credits when you need them.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 mx-auto h-12 px-8 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors duration-200 shadow-md"
              >
                See Pricing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
