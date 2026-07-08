import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Key, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/auth");

  const hasApiKey = Boolean(user.apifyKey);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-amber-400 text-sm font-medium mb-1">
          Welcome back 👋
        </p>
        <h1 className="font-display font-bold text-3xl text-white">{user.name}</h1>
        <p className="text-slate-400 mt-1 text-sm">{user.email}</p>
      </div>

      {/* Setup Banner */}
      {!hasApiKey && (
        <div className="mb-8 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-white text-sm mb-1">Action needed</p>
            <p className="text-slate-400 text-sm">
              Add your Apify API key to start searching for businesses.
            </p>
          </div>
          <Link
            href="/settings/apify-key"
            className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-bg-base font-semibold text-sm rounded-lg transition-colors"
          >
            Add Key
          </Link>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-bg-border flex items-center justify-center">
              <Key className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Apify Connector</span>
          </div>
          {hasApiKey ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Not connected</span>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2">
            {hasApiKey ? "Ready to search businesses" : "Required to run searches"}
          </p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-bg-border flex items-center justify-center">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Business Search</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Available</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Google Maps data, up to 100 results
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/search"
            className={`group p-5 card-surface hover:border-amber-500/30 transition-all flex items-center justify-between ${!hasApiKey ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Search Businesses</p>
                <p className="text-xs text-slate-500">Find any business type</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/settings/apify-key"
            className="group p-5 card-surface hover:border-slate-600 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center">
                <Key className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Manage API Key</p>
                <p className="text-xs text-slate-500">
                  {hasApiKey ? "Update your Apify key" : "Connect Apify account"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
