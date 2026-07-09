import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl(path: string): string {
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Next.js trailingSlash config causes redirects on API paths, which fails CORS preflights.
  // We append a trailing slash to API paths to avoid redirects.
  if (cleanPath.startsWith("/api/") && !cleanPath.endsWith("/")) {
    cleanPath = `${cleanPath}/`;
  }

  if (typeof window !== "undefined") {
    // Check if running inside Capacitor (Android/iOS webviews)
    const isCapacitor =
      (window as any).Capacitor ||
      window.location.protocol.startsWith("capacitor") ||
      (window.location.hostname === "localhost" && !window.location.port);

    if (!isCapacitor) {
      // Return relative path for web browsers (local development & production Vercel)
      return cleanPath;
    }
  }

  // Mobile / Capacitor requires absolute backend URL
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://google-business-scraper-amber.vercel.app";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}${cleanPath}`;
}
