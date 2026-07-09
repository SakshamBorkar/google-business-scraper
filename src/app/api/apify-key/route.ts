import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateApifyKey } from "@/lib/apify";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return corsResponse(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      req
    );
  }

  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string") {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "API key is required" },
          { status: 400 }
        ),
        req
      );
    }

    const isValid = await validateApifyKey(apiKey.trim());
    if (!isValid) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Invalid Apify API key. Please check and try again." },
          { status: 400 }
        ),
        req
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { apifyKey: apiKey.trim() },
    });

    return corsResponse(
      NextResponse.json({ success: true, message: "API key saved successfully" }),
      req
    );
  } catch (error) {
    console.error("Save Apify key error:", error);
    return corsResponse(
      NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 }),
      req
    );
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return corsResponse(
      NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
      req
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { apifyKey: null },
  });

  return corsResponse(
    NextResponse.json({ success: true, message: "API key removed" }),
    req
  );
}
