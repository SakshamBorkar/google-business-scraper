import { NextResponse } from "next/server";
import { deleteSession, getSessionCookieName } from "@/lib/auth";

export async function POST() {
  await deleteSession();

  const res = NextResponse.json({ success: true });
  res.cookies.delete(getSessionCookieName());
  return res;
}
