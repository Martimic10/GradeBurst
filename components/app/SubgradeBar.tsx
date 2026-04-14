"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubgradeBarProps {
  label: string;
  score: number; // 1–10
  delay?: number;
}

function scoreBarColor(score: number) {
  if (score >= 9) return "from-emerald-500 to-emerald-400";
  if (score >= 8) return "from-cyan-500 to-cyan-400";
  if (score >= 7) return "from-blue-500 to-blue-400";
  if (score >= 6) return "from-yellow-500 to-yellow-400";
  return "from-rose-500 to-rose-400";
}

function scorePillColor(score: number) {
  if (score >= 9) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  if (score >= 8) return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
  if (score >= 7) return "bg-blue-500/15 text-blue-400 border-blue-500/25";
  if (score >= 6) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
  return "bg-rose-500/15 text-rose-400 border-rose-500/25";
}

export function SubgradeBar({ label, score, delay = 0 }: SubgradeBarProps) {
  const pct = (score / 10) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={cn("text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full border", scorePillColor(score))}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-linear-to-r", scoreBarColor(score))}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
