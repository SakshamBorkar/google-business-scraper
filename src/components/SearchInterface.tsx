"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Globe,
  Star,
  MessageSquare,
  Clock,
  Loader2,
  Building2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessResult } from "@/types";

const BUSINESS_TYPES = [
  "Schools",
  "Restaurants",
  "Hospitals",
  "Hotels",
  "Pharmacies",
  "Gyms",
  "Banks",
  "Salons",
  "Supermarkets",
  "Cafes",
  "Clinics",
  "Law Firms",
];

export default function SearchInterface() {
  const [typeOfBusiness, setTypeOfBusiness] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [location, setLocation] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const persistedResults = localStorage.getItem("bizfinder_search_results");
    const persistedSearched = localStorage.getItem("bizfinder_searched");
    const persistedType = localStorage.getItem("bizfinder_typeOfBusiness");
    const persistedSub = localStorage.getItem("bizfinder_subCategory");
    const persistedLoc = localStorage.getItem("bizfinder_location");
    const persistedMax = localStorage.getItem("bizfinder_maxResults");
    const persistedEmailSent = localStorage.getItem("bizfinder_email_sent");

    if (persistedResults) {
      try {
        setResults(JSON.parse(persistedResults));
      } catch (e) {
        console.error("Failed to parse persisted results", e);
      }
    }
    if (persistedSearched === "true") setSearched(true);
    if (persistedType) setTypeOfBusiness(persistedType);
    if (persistedSub) setSubCategory(persistedSub);
    if (persistedLoc) setLocation(persistedLoc);
    if (persistedMax) setMaxResults(Number(persistedMax));
    if (persistedEmailSent === "true") setEmailSent(true);
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResults([]);
    setSearched(false);
    setEmailSent(false);
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typeOfBusiness, subCategory, location, maxResults }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Search failed");
      } else {
        const foundResults = data.data || [];
        setResults(foundResults);
        setSearched(true);
        const sentFlag = data.emailSent || false;
        setEmailSent(sentFlag);
        // Persist to localStorage
        localStorage.setItem("bizfinder_search_results", JSON.stringify(foundResults));
        localStorage.setItem("bizfinder_searched", "true");
        localStorage.setItem("bizfinder_email_sent", sentFlag ? "true" : "false");
        localStorage.setItem("bizfinder_typeOfBusiness", typeOfBusiness);
        localStorage.setItem("bizfinder_subCategory", subCategory);
        localStorage.setItem("bizfinder_location", location);
        localStorage.setItem("bizfinder_maxResults", String(maxResults));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="card-surface p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Type of Business */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide font-medium">
              Type of Business <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                list="business-types"
                type="text"
                value={typeOfBusiness}
                onChange={(e) => setTypeOfBusiness(e.target.value)}
                placeholder="e.g. Schools, Restaurants, Clinics"
                className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
              <datalist id="business-types">
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Sub-category */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide font-medium">
              Sub-category{" "}
              <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g. Science, Italian, Pediatric"
              className="w-full bg-bg-elevated border border-bg-border rounded-lg px-4 py-3 text-white placeholder-slate-600 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide font-medium">
              Location <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pune, Mumbai, New Delhi"
                className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Max Results */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide font-medium">
              Max Results
              <span className="ml-2 text-slate-600 normal-case font-normal">(1–50)</span>
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full bg-bg-elevated border border-bg-border rounded-lg px-4 py-3 text-white text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-bg-base font-semibold py-3 rounded-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching... this may take a minute
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search Businesses
            </>
          )}
        </button>
      </form>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-elevated p-5 space-y-3">
              <div className="shimmer h-4 w-48 rounded" />
              <div className="shimmer h-3 w-64 rounded" />
              <div className="shimmer h-3 w-32 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && (
        <div>
          {emailSent && results.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-5">
              <Mail className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-white">Results Emailed!</p>
                <p className="text-xs text-slate-400 mt-0.5">An Excel-compatible CSV file containing all {results.length} results has been sent to your email.</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">
              {results.length > 0 ? (
                <>
                  <span className="text-amber-400">{results.length}</span> results found
                </>
              ) : (
                "No results found"
              )}
            </h2>
            {results.length > 0 && (
              <p className="text-xs text-slate-500">Click a card to expand details</p>
            )}
          </div>

          {results.length === 0 && (
            <div className="card-elevated p-10 text-center">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No businesses found for your search.</p>
              <p className="text-slate-500 text-sm mt-1">Try a different type or location.</p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((biz, index) => {
              const id = biz.placeId || String(index);
              const isExpanded = expandedId === id;
              const name = biz.title || biz.name || "Unknown Business";
              const rawRating = biz.rating || biz.totalScore;
              const rating = typeof rawRating === 'number' ? rawRating : (typeof rawRating === 'string' ? parseFloat(rawRating) : null);
              const rawReviews = biz.reviewsCount ?? biz.reviews;
              const reviews = typeof rawReviews === 'number' ? rawReviews : (typeof rawReviews === 'string' ? rawReviews : null);

              return (
                <div
                  key={id}
                  className={cn(
                    "card-surface transition-all cursor-pointer",
                    isExpanded ? "border-amber-500/20" : "hover:border-slate-700"
                  )}
                >
                  {/* Card Header */}
                  <div
                    className="p-5 flex items-start gap-4"
                    onClick={() => toggleExpand(id)}
                  >
                    {/* Index badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bg-elevated border border-bg-border flex items-center justify-center text-xs font-bold text-slate-500 font-display mt-0.5">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-white text-base leading-tight">
                            {name}
                          </h3>
                          {(biz.categoryName || biz.categories?.[0]) && (
                            <p className="text-xs text-amber-400/80 mt-0.5">
                              {biz.categoryName || biz.categories?.[0]}
                            </p>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        {biz.address && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {biz.address}
                          </span>
                        )}
                        {rating !== null && !isNaN(rating) && (
                          <span className="flex items-center gap-1 text-xs text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {rating.toFixed(1)}
                            {reviews !== null && (
                              <span className="text-slate-500">
                                ({typeof reviews === 'number' ? reviews.toLocaleString() : reviews})
                              </span>
                            )}
                          </span>
                        )}
                        {biz.phone && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Phone className="w-3 h-3" />
                            {biz.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-bg-border mt-0">
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {biz.website && (
                          <a
                            href={biz.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">{biz.website.replace(/^https?:\/\//, "")}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                        {biz.email && (
                          <a
                            href={`mailto:${biz.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {biz.email}
                          </a>
                        )}
                        {biz.phoneUnformatted && biz.phoneUnformatted !== biz.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Phone className="w-3.5 h-3.5" />
                            {biz.phoneUnformatted}
                          </div>
                        )}
                        {biz.googleMapsUrl && (
                          <a
                            href={biz.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            View on Google Maps
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {biz.description && (
                        <p className="text-sm text-slate-400 mt-3 leading-relaxed border-t border-bg-border pt-3">
                          {biz.description}
                        </p>
                      )}

                      {biz.openingHours && biz.openingHours.length > 0 && (
                        <div className="mt-3 border-t border-bg-border pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                              Opening Hours
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {biz.openingHours.map((oh, i) => (
                              <div key={i} className="flex justify-between text-xs text-slate-400">
                                <span className="text-slate-500">{oh.day}</span>
                                <span>{oh.hours}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(biz.temporarilyClosed || biz.permanentlyClosed) && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/20 text-red-400 text-xs">
                          {biz.permanentlyClosed ? "Permanently Closed" : "Temporarily Closed"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
