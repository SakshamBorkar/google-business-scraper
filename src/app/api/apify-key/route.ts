import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateApifyKey } from "@/lib/apify";

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 400 }
      );
    }

    const isValid = await validateApifyKey(apiKey.trim());
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid Apify API key. Please check and try again." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { apifyKey: apiKey.trim() },
    });

    return NextResponse.json({ success: true, message: "API key saved successfully" });
  } catch (error) {
    console.error("Save Apify key error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { apifyKey: null },
  });

  return NextResponse.json({ success: true, message: "API key removed" });
}
