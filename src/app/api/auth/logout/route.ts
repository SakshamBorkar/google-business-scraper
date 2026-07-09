import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSessionCookieName } from "@/lib/auth";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  await deleteSession();

  const res = NextResponse.json({ success: true });
  res.cookies.delete(getSessionCookieName());
  return corsResponse(res, req);
}
