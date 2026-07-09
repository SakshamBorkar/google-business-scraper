import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";
import { createSession, getSessionCookieName, getSessionDuration } from "@/lib/auth";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Email and code are required" },
          { status: 400 }
        ),
        req
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        ),
        req
      );
    }

    const valid = await verifyOtp(user.id, code);
    if (!valid) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Invalid or expired verification code" },
          { status: 401 }
        ),
        req
      );
    }

    const token = await createSession(user.id);

    const res = NextResponse.json({
      success: true,
      token, // Return token so mobile/Capacitor client can save it in localStorage
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        apifyKey: user.apifyKey,
      },
    });

    res.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Required for cross-site requests (Capacitor)
      maxAge: getSessionDuration() / 1000,
      path: "/",
    });

    return corsResponse(res, req);
  } catch (error) {
    console.error("Verify OTP error:", error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: "Something went wrong" },
        { status: 500 }
      ),
      req
    );
  }
}
