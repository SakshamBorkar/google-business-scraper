import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function GET(req: NextRequest) {
  const user = await getSession();

  if (!user) {
    return corsResponse(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      req
    );
  }

  return corsResponse(
    NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        apifyKey: user.apifyKey,
      },
    }),
    req
  );
}
