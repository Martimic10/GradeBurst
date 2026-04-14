"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppNavbar } from "@/components/app/AppNavbar";
import { UploadCard, type UploadedFile } from "@/components/app/UploadCard";
import { ResultsPanel, type GradeResult } from "@/components/app/ResultsPanel";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

// ── Mock data ────────────────────────────────────────────────
const MOCK_RESULT: GradeResult = {
  grade: 8.5,
  confidence: 82,
  subgrades: {
    centering: 9,
    corners: 8,
    edges: 8.5,
    surface: 9,
  },
  recommendation: "grade",
  reasons: [
    "Slight whitening on bottom-left corner under UV light",
    "Minor centering shift toward the left (~55/45)",
    "Surface appears clean with no visible scratches",
    "Edges show minimal wear consistent with a PSA 8–9 range",
  ],
};

type PanelState = "idle" | "loading" | "result";

export default function AppPage() {
  const [user, setUser] = useState<User | null>(null);
  // ── Upload state ─────────────────────────────────────────
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState<"front" | "back" | null>(null);

  // ── Analysis state ───────────────────────────────────────
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [result, setResult] = useState<GradeResult | undefined>();

  // ── Credits (mock — will come from Supabase later) ───────
  const [credits, setCredits] = useState(12);

  // ── Get user data ────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // ── File helpers ─────────────────────────────────────────
  function addFile(file: File, side: "front" | "back") {
    const preview = URL.createObjectURL(file);
    setFiles((prev) => {
      const existing = prev.find((f) => f.side === side);
      if (existing) URL.revokeObjectURL(existing.preview);
      return [...prev.filter((f) => f.side !== side), { id: crypto.randomUUID(), name: file.name, preview, side }];
    });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") {
    const file = e.target.files?.[0];
    if (!file) return;
    addFile(file, side);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent, side: "front" | "back") {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) addFile(file, side);
  }

  function handleRemove(id: string) {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((f) => f.id !== id);
    });
  }

  function handleReplace(_side: "front" | "back") {
    // The UploadCard already opens the file picker — nothing extra needed here
  }

  // ── Analysis ─────────────────────────────────────────────
  async function handleAnalyze() {
    if (credits <= 0) return;
    setPanelState("loading");
    setResult(undefined);

    // Simulate AI processing delay (replace with real API call later)
    await new Promise((res) => setTimeout(res, 2500));

    setCredits((c) => Math.max(0, c - 1));
    setResult(MOCK_RESULT);
    setPanelState("result");
  }

  function handleReset() {
    // Revoke all blob URLs
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setResult(undefined);
    setPanelState("idle");
  }

  const isAnalyzing = panelState === "loading";

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar credits={credits} userEmail={user?.email} />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="mb-8 space-y-1"
        >
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Card Analyzer</h1>
          <p className="text-sm text-slate-500">
            Upload front &amp; back · get an instant PSA-style grade estimate
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-5 items-start">

          {/* Left — Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease }}
          >
            <UploadCard
              files={files}
              dragOver={dragOver}
              isAnalyzing={isAnalyzing}
              credits={credits}
              onFileSelect={handleFileSelect}
              onDrop={handleDrop}
              onDragOver={(side) => setDragOver(side)}
              onDragLeave={() => setDragOver(null)}
              onRemove={handleRemove}
              onReplace={handleReplace}
              onAnalyze={handleAnalyze}
            />
          </motion.div>

          {/* Right — Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16, ease }}
          >
            <ResultsPanel
              state={panelState}
              result={result}
              onReset={handleReset}
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
