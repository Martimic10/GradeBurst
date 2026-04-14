"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ArrowLeft, Eye, EyeOff, Loader2, Orbit } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

type Tab = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await router.push("/app");
      }
    };

    checkSession();
  }, [router]);

  const reset = () => { setError(null); setSuccess(null); };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    reset();
    const supabase = createClient();

    if (tab === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        await router.push("/app");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/app` },
      });
      if (error) { setError(error.message); }
      else { setSuccess("Check your email to confirm your account, then sign in."); }
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    reset();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/app` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="relative w-full md:w-1/2 bg-white flex flex-col px-10 py-10 md:px-16 lg:px-24">

        {/* Back button — pinned top */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Centered content */}
        <div className="flex-1 flex flex-col justify-center">

        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Orbit className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold text-[15px] text-slate-900 tracking-tight">GradeBurst</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {tab === "signin" ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {tab === "signin" ? "We're happy to see you again." : "Start grading smarter today."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-6">
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); reset(); }}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                tab === t
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 pr-11 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {tab === "signin" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600" />
                <span className="text-xs text-slate-500">Remember me</span>
              </label>
              <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          {/* Errors / success */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2"
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-600/25"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tab === "signin" ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Log in with Google
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-8">
          By continuing you agree to our{" "}
          <span className="underline cursor-pointer hover:text-slate-600 transition-colors">Terms</span>
          {" "}and{" "}
          <span className="underline cursor-pointer hover:text-slate-600 transition-colors">Privacy Policy</span>.
        </p>

        </div>{/* end centered content */}
      </div>

      {/* ── Right panel — abstract fluid background ── */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-[#060818]" />

        {/* Large fluid blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/40 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[65%] h-[65%] rounded-full bg-cyan-500/30 blur-[130px]" />
        <div className="absolute top-[30%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/35 blur-[100px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] rounded-full bg-sky-400/25 blur-[90px]" />
        <div className="absolute top-[10%] right-[30%] w-[30%] h-[30%] rounded-full bg-violet-600/30 blur-[80px]" />

        {/* Subtle noise overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Animated floating blobs */}
        <motion.div
          className="absolute top-[20%] left-[20%] w-64 h-64 rounded-full bg-blue-500/20 blur-[80px]"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[25%] right-[20%] w-80 h-80 rounded-full bg-cyan-400/15 blur-[100px]"
          animate={{ x: [0, -30, 20, 0], y: [0, 25, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom caption */}
        <div className="absolute bottom-8 inset-x-0 text-center">
          <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} GradeBurst. Unauthorized use is prohibited.
          </p>
        </div>
      </div>

    </div>
  );
}
