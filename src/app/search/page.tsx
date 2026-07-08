import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SearchInterface from "@/components/SearchInterface";
import { AlertCircle } from "lucide-react";

export default async function SearchPage() {
  const user = await getSession();
  if (!user) redirect("/auth");

  if (!user.apifyKey) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-2xl text-white mb-2">Search Businesses</h1>
        <p className="text-slate-400 text-sm mb-8">Find businesses anywhere using Google Maps data.</p>

        <div className="card-elevated p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-display font-semibold text-white mb-2">API Key Required</h3>
          <p className="text-slate-400 text-sm mb-6">
            Add your Apify API key to start searching.
          </p>
          <Link
            href="/settings/apify-key"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-bg-base font-semibold rounded-lg text-sm transition-colors"
          >
            Add API Key →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-white mb-1">Search Businesses</h1>
        <p className="text-slate-400 text-sm">
          Real-time Google Maps data via Apify.
        </p>
      </div>
      <SearchInterface />
    </div>
  );
}
