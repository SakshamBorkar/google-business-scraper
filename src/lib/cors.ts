import { NextRequest, NextResponse } from "next/server";

export function corsResponse(res: NextResponse, req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  // Allow the specific capacitor origin or the website itself
  const allowedOrigins = [
    "capacitor://localhost",
    "https://localhost",
    "http://localhost",
    "http://localhost:3000",
    "https://google-business-scraper-amber.vercel.app"
  ];

  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else if (origin.endsWith(".vercel.app")) {
    // Also allow preview deployments
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}

export function handleOptions(req: NextRequest) {
  return corsResponse(new NextResponse(null, { status: 204 }), req);
}
