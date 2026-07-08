import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runApifyActor } from "@/lib/apify";
import type { SearchParams } from "@/types";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!user.apifyKey) {
    return NextResponse.json(
      { success: false, error: "Please add your Apify API key in Settings first" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { typeOfBusiness, subCategory, location, maxResults } = body;

    if (!typeOfBusiness || !location) {
      return NextResponse.json(
        { success: false, error: "Type of business and location are required" },
        { status: 400 }
      );
    }

    const params: SearchParams = {
      typeOfBusiness: typeOfBusiness.trim(),
      subCategory: subCategory?.trim() || undefined,
      location: location.trim(),
      maxResults: Math.min(Math.max(parseInt(maxResults) || 20, 1), 100),
    };

    const results = await runApifyActor(user.apifyKey, params);

    return NextResponse.json({ success: true, data: results, count: results.length });
  } catch (error) {
    console.error("Search error:", error);
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
