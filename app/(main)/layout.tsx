import { Navbar } from "@/components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16 rounded-t-[2rem] bg-slate-950/95 shadow-[0_40px_120px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base text-white">GradeBurst</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 text-sm">AI-powered card grading estimates</span>
              </div>
              <p className="text-sm text-slate-400 max-w-lg">
                Trusted by collectors for faster grading decisions, smarter submissions, and better ROI.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <a href="#features" className="transition-colors duration-200 hover:text-white">Features</a>
              <a href="/pricing" className="transition-colors duration-200 hover:text-white">Pricing</a>
              <a href="#contact" className="transition-colors duration-200 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 text-sm text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p>© {new Date().getFullYear()} GradeBurst. Not affiliated with PSA or Beckett.</p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
