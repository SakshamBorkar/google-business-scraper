import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await getSession();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-bg-base bg-grid flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-bg-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-bg-base font-bold text-sm font-display">B</span>
          </div>
          <span className="font-display font-bold text-lg text-white">
            Biz<span className="text-amber-500">Finder</span>
          </span>
        </div>
        <Link
          href="/auth"
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-bg-base font-semibold text-sm transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Powered by Apify & Google Maps
        </div>

        <h1 className="font-display font-bold text-5xl md:text-7xl text-white leading-[1.1] mb-6 max-w-3xl">
          Find any business,{" "}
          <span className="text-gradient-amber">anywhere.</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Search schools, restaurants, clinics, shops — any business type in any city.
          Powered by real-time Google Maps data.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/auth"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-bg-base font-semibold transition-all glow-amber"
          >
            Start for free
          </Link>
          <a
            href="https://apify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-bg-border hover:border-slate-600 text-slate-300 hover:text-white font-medium transition-all text-sm"
          >
            Learn about Apify →
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center gap-3 mt-16 justify-center">
          {["Phone & Email", "Address & Location", "Ratings & Reviews", "Opening Hours", "Up to 100 results"].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-full bg-bg-surface border border-bg-border text-slate-400 text-xs"
            >
              {f}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
