"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, ImagePlus, X, Zap, Loader2, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

export type UploadedFile = {
  id: string;
  name: string;
  preview: string;
  side: "front" | "back";
};

interface UploadCardProps {
  files: UploadedFile[];
  dragOver: "front" | "back" | null;
  isAnalyzing: boolean;
  credits: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => void;
  onDrop: (e: React.DragEvent, side: "front" | "back") => void;
  onDragOver: (side: "front" | "back") => void;
  onDragLeave: () => void;
  onRemove: (id: string) => void;
  onReplace: (side: "front" | "back") => void;
  onAnalyze: () => void;
}

export function UploadCard({
  files,
  dragOver,
  isAnalyzing,
  credits,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  onReplace,
  onAnalyze,
}: UploadCardProps) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const front = files.find((f) => f.side === "front");
  const back = files.find((f) => f.side === "back");
  const canAnalyze = !!front && !isAnalyzing && credits > 0;
  const noCredits = credits === 0;

  function inputRef(side: "front" | "back") {
    return side === "front" ? frontInputRef : backInputRef;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-slate-900">Upload Card</h2>
        <p className="text-xs text-slate-500">Front is required · Back improves accuracy</p>
      </div>

      {/* Upload zones */}
      <div className="grid grid-cols-2 gap-3">
        {(["front", "back"] as const).map((side) => {
          const file = side === "front" ? front : back;
          const isDragging = dragOver === side;

          return (
            <div key={side} className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {side}{side === "front" && <span className="text-rose-400 ml-0.5">*</span>}
              </p>

              <div
                onDragOver={(e) => { e.preventDefault(); onDragOver(side); }}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, side)}
                onClick={() => !file && inputRef(side).current?.click()}
                className={cn(
                  "relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden",
                  "flex items-center justify-center aspect-3/4",
                  isDragging
                    ? "border-cyan-400 bg-cyan-50"
                    : file
                    ? "border-slate-200 bg-slate-50"
                    : "border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50/40 cursor-pointer"
                )}
              >
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2, ease }}
                      className="w-full h-full relative"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.preview}
                        alt={`Card ${side}`}
                        className="w-full h-full object-contain p-3"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onReplace(side); inputRef(side).current?.click(); }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:bg-white shadow-sm transition-colors whitespace-nowrap"
                      >
                        <ImagePlus className="w-2.5 h-2.5" />
                        Replace
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2 p-4 text-center"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isDragging ? "bg-cyan-100" : "bg-white border border-slate-200"
                      )}>
                        {isDragging
                          ? <ScanLine className="w-5 h-5 text-cyan-500" />
                          : side === "front"
                          ? <Upload className="w-5 h-5 text-slate-400" />
                          : <Camera className="w-5 h-5 text-slate-400" />
                        }
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {isDragging ? "Drop here" : side === "front" ? "Upload or take photo" : "Upload or take photo"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tap to use camera on mobile</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* accept="image/*" shows both gallery and camera on mobile */}
              <input
                ref={inputRef(side)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileSelect(e, side)}
              />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="space-y-2.5">
        <button
          type="button"
          disabled={!canAnalyze}
          onClick={onAnalyze}
          className={cn(
            "w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200",
            canAnalyze
              ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Zap className={cn("w-4 h-4", canAnalyze ? "text-cyan-400" : "text-slate-400")} />
              Burst This Card
            </>
          )}
        </button>

        {noCredits ? (
          <p className="text-center text-xs text-rose-500 font-medium">
            You&apos;re out of Bursts —{" "}
            <a href="/pricing" className="underline hover:text-rose-600 transition-colors">
              buy more credits
            </a>
          </p>
        ) : !front ? (
          <p className="text-center text-[11px] text-slate-400">
            Upload the front of your card to continue
          </p>
        ) : (
          <p className="text-center text-[11px] text-slate-400">
            Uses <span className="font-semibold text-slate-600">1 Burst</span> · {credits} remaining
          </p>
        )}
      </div>
    </div>
  );
}
