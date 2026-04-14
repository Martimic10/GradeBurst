"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Zap, LogOut, User, ChevronDown, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

interface AppNavbarProps {
  credits: number;
  userEmail?: string;
}

export function AppNavbar({ credits, userEmail }: AppNavbarProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const creditsLow = credits <= 3;
  const creditsEmpty = credits === 0;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm supports-backdrop-filter:bg-white/60">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <Link href="/app" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Orbit className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">GradeBurst</span>
        </Link>

        {/* Right: Credits + User */}
        <div className="flex items-center gap-3">

          {/* Credits badge */}
          <Link
            href="/pricing"
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 border",
              creditsEmpty
                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                : creditsLow
                ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
            )}
          >
            <Zap className={cn(
              "w-3 h-3",
              creditsEmpty ? "text-rose-500" : creditsLow ? "text-amber-500" : "text-cyan-500"
            )} />
            {creditsEmpty ? "0 Bursts — Buy more" : `${credits} Burst${credits === 1 ? "" : "s"} left`}
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <ChevronDown className={cn(
                "w-3 h-3 text-slate-500 transition-transform duration-200",
                menuOpen && "rotate-180"
              )} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.15, ease }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden"
                  >
                    {/* Account info */}
                    {userEmail && (
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Signed in as</p>
                        <p className="text-xs font-medium text-slate-700 truncate mt-0.5">{userEmail}</p>
                      </div>
                    )}

                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link
                        href="/pricing"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        Buy Credits
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
}
