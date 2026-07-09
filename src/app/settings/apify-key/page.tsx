"use client";

import ApifyKeyForm from "@/components/ApifyKeyForm";
import { useUser } from "@/components/AppShell";

export default function ApifyKeyPage() {
  const { user } = useUser();

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Apify API Key</h1>
        <p className="text-slate-400 text-sm">
          Connect your Apify account to enable business searching.
        </p>
      </div>

      {/* Why do I need this */}
      <div className="card-elevated p-5 mb-6 border-l-2 border-l-amber-500">
        <h3 className="font-semibold text-white text-sm mb-2">Why do I need this?</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          BizFinder uses Apify's infrastructure to scrape Google Maps in real time.
          You'll need your own Apify token — new accounts get <strong className="text-white">$5 free credit</strong>, enough for dozens of searches.
        </p>
        <ol className="space-y-1.5 text-sm text-slate-400">
          {[
            "Go to apify.com and create a free account",
            'Click "Integrations" in the left sidebar',
            'Click "API" → "Manage Tokens" → "Create a new Token"',
            "Copy the token and paste it below",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <a
          href="https://apify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-bg-border text-slate-300 hover:text-white hover:border-slate-600 text-sm transition-colors"
        >
          Sign up on Apify →
        </a>
      </div>

      <ApifyKeyForm hasKey={Boolean(user.apifyKey)} />
    </div>
  );
}
