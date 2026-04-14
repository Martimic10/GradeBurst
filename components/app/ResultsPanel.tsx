"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubgradeBar } from "./SubgradeBar";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export type GradeResult = {
  grade: number;
  confidence: number;
  subgrades: {
    centering: number;
    corners: number;
    edges: number;
    surface: number;
  };
  recommendation?: "grade" | "sell_raw" | "hold"; // kept for compatibility, no longer displayed
  reasons: string[];
};

type PanelState = "idle" | "loading" | "result";

interface ResultsPanelProps {
  state: PanelState;
  result?: GradeResult;
  onReset: () => void;
}

function gradeColor(grade: number) {
  if (grade >= 9) return "text-emerald-400";
  if (grade >= 8) return "text-cyan-400";
  if (grade >= 7) return "text-blue-400";
  if (grade >= 6) return "text-yellow-400";
  return "text-rose-400";
}

function gradeGlowBg(grade: number) {
  if (grade >= 9) return "bg-emerald-500";
  if (grade >= 8) return "bg-cyan-500";
  if (grade >= 7) return "bg-blue-500";
  if (grade >= 6) return "bg-yellow-500";
  return "bg-rose-500";
}

function gradeBadge(grade: number) {
  if (grade >= 9) return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
  if (grade >= 8) return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25";
  if (grade >= 7) return "bg-blue-500/15 text-blue-400 border border-blue-500/25";
  if (grade >= 6) return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25";
  return "bg-rose-500/15 text-rose-400 border border-rose-500/25";
}

function gradeRingStroke(grade: number) {
  if (grade >= 9) return "rgb(52,211,153)";
  if (grade >= 8) return "rgb(34,211,238)";
  if (grade >= 7) return "rgb(96,165,250)";
  if (grade >= 6) return "rgb(251,191,36)";
  return "rgb(251,113,133)";
}

function gradeLabel(grade: number) {
  if (grade >= 9.5) return "Gem Mint";
  if (grade >= 9) return "Mint";
  if (grade >= 8.5) return "NM-MT+";
  if (grade >= 8) return "Near Mint-Mint";
  if (grade >= 7) return "Near Mint";
  if (grade >= 6) return "Excellent-Mint";
  return "Excellent";
}

function ConfidenceRing({ confidence, grade }: { confidence: number; grade: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (confidence / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-15 h-15">
      <svg width="60" height="60" viewBox="0 0 60 60" className="absolute">
        <circle cx="30" cy="30" r={r} fill="none" stroke="rgb(30,41,59)" strokeWidth="3.5" />
        <motion.circle
          cx="30" cy="30" r={r}
          fill="none"
          stroke={gradeRingStroke(grade)}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          transform="rotate(-90 30 30)"
        />
      </svg>
      <div className="relative flex flex-col items-center leading-none z-10">
        <span className="text-sm font-black text-white tabular-nums">{confidence}%</span>
        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">conf</span>
      </div>
    </div>
  );
}

export function ResultsPanel({ state, result, onReset }: ResultsPanelProps) {
  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/40 h-full min-h-96">
      <AnimatePresence mode="wait">

        {/* ── Idle ── */}
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="h-full min-h-96 flex flex-col items-center justify-center gap-4 p-10 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-700" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-400">Upload a card to see your GradeBurst result</p>
              <p className="text-xs text-slate-700 max-w-52 leading-relaxed mx-auto">
                Front + back photos give the most accurate estimate.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Loading ── */}
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="h-full min-h-96 flex flex-col items-center justify-center gap-6 p-10 text-center"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="absolute -inset-1.5 rounded-2xl border-2 border-cyan-500/25 animate-ping" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                <p className="text-sm font-semibold text-slate-300">Analyzing card…</p>
              </div>
              <p className="text-xs text-slate-600">Inspecting centering, corners, edges &amp; surface</p>
            </div>
            <div className="w-full max-w-52 space-y-3">
              {["Centering", "Corners", "Edges", "Surface"].map((label, i) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-16 rounded-full bg-slate-800 animate-pulse" />
                    <div className="h-2.5 w-7 rounded-full bg-slate-800 animate-pulse" />
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-slate-700 to-slate-600"
                      initial={{ width: "0%" }}
                      animate={{ width: ["0%", "65%", "40%", "80%"] }}
                      transition={{ duration: 1.6, delay: i * 0.15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Result ── */}
        {state === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease }}
            className="flex flex-col"
          >

            {/* ─ Grade Hero ─ */}
            <div className="relative px-6 pt-8 pb-7 overflow-hidden">
              {/* Ambient glow */}
              <motion.div
                className={cn(
                  "absolute -top-6 left-0 w-80 h-48 rounded-full blur-3xl pointer-events-none",
                  gradeGlowBg(result.grade)
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.11 }}
                transition={{ duration: 1.2, ease }}
              />

              {/* "Estimated Grade" label + confidence ring */}
              <div className="relative flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                    Estimated Grade
                  </p>
                  <p className="text-[10px] text-slate-700 mt-0.5">PSA-style estimate</p>
                </div>
                <ConfidenceRing confidence={result.confidence} grade={result.grade} />
              </div>

              {/* Big number */}
              <div className="relative flex items-end gap-2.5 leading-none">
                <motion.span
                  className={cn(
                    "text-[92px] font-black leading-none tabular-nums tracking-tighter",
                    gradeColor(result.grade)
                  )}
                  initial={{ scale: 0.82, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.08, ease }}
                >
                  {result.grade.toFixed(1)}
                </motion.span>
                <span className="text-xl font-bold text-slate-700 mb-3">/ 10</span>
              </div>

              {/* Grade label pill */}
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease }}
              >
                <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold", gradeBadge(result.grade))}>
                  {gradeLabel(result.grade)}
                </span>
              </motion.div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-800 mx-6" />

            {/* ─ Subgrades ─ */}
            <motion.div
              className="px-6 py-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Subgrades</p>
              <div className="space-y-3.5">
                <SubgradeBar label="Centering" score={result.subgrades.centering} delay={0.18} />
                <SubgradeBar label="Corners"   score={result.subgrades.corners}   delay={0.26} />
                <SubgradeBar label="Edges"     score={result.subgrades.edges}     delay={0.34} />
                <SubgradeBar label="Surface"   score={result.subgrades.surface}   delay={0.42} />
              </div>
            </motion.div>

            {/* ─ Why This Grade ─ */}
            {result.reasons.length > 0 && (
              <>
                <div className="h-px bg-slate-800 mx-6" />
                <motion.div
                  className="px-6 py-6 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Why this grade?
                  </p>
                  <ul className="space-y-2.5">
                    {result.reasons.map((reason, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 + i * 0.07, ease }}
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/60 shrink-0" />
                        <p className="text-xs text-slate-400 leading-relaxed">{reason}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </>
            )}

            {/* Separator */}
            <div className="h-px bg-slate-800 mx-6" />

            {/* ─ Reset ─ */}
            <div className="px-6 py-5">
              <button
                type="button"
                onClick={onReset}
                className="w-full h-10 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800/80 text-xs font-semibold text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Analyze Another Card
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
