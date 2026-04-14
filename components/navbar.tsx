"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Menu, X, Orbit } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (mounted) setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isSignedIn = Boolean(session?.user);
  const actionHref = isSignedIn ? "/app" : "/auth";
  const actionLabel = isSignedIn ? "App" : "Get Started";

  return (
    <header className="sticky top-4 z-50 w-full px-4">
      <div className="relative max-w-6xl mx-auto h-14 rounded-full bg-white/95 border border-slate-200 px-3 sm:px-4 flex items-center justify-between gap-4 shadow-xl shadow-slate-200/80 backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-600 via-sky-400 to-cyan-300 border border-slate-200 flex items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.25)]">
            <Orbit className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
            GradeBurst
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map(({ href, label }) => {
            const isActive =
              (href === "/" && pathname === "/") || (href === "/pricing" && pathname === "/pricing");

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 w-5 rounded-full bg-cyan-300"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="absolute inset-x-4 top-full mt-3 rounded-3xl border border-slate-200/70 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
            <div className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
                >
                  {label}
                </Link>
              ))}
              <Link
                href={actionHref}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
              >
                {actionLabel}
              </Link>
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 transition-colors duration-200 hover:bg-slate-100 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href={actionHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 rounded-full border-0 transition-all duration-200"
            )}
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
