import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Name and email are required" },
          { status: 400 }
        ),
        req
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Invalid email address" },
          { status: 400 }
        ),
        req
      );
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      create: { name, email },
      update: { name },
    });

    const otp = await createOtp(user.id);
    const sent = await sendOtpEmail(email, name, otp);

    if (!sent) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Failed to send verification email" },
          { status: 500 }
        ),
        req
      );
    }

    return corsResponse(
      NextResponse.json({
        success: true,
        message: "Verification code sent to your email",
      }),
      req
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: "Something went wrong" },
        { status: 500 }
      ),
      req
    );
  }
}
