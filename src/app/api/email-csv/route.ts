import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendCsvEmail } from "@/lib/email";
import { corsResponse, handleOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return corsResponse(
        NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
        req
      );
    }

    const body = await req.json();
    const { csvContent, filename } = body;

    if (!csvContent || !filename) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "csvContent and filename are required" },
          { status: 400 }
        ),
        req
      );
    }

    const sent = await sendCsvEmail(user.email, user.name, csvContent, filename);

    if (!sent) {
      return corsResponse(
        NextResponse.json(
          { success: false, error: "Failed to send email" },
          { status: 500 }
        ),
        req
      );
    }

    return corsResponse(
      NextResponse.json({
        success: true,
        message: "CSV file sent to your email successfully",
      }),
      req
    );
  } catch (error) {
    console.error("Email CSV error:", error);
    return corsResponse(
      NextResponse.json(
        { success: false, error: "Something went wrong" },
        { status: 500 }
      ),
      req
    );
  }
}
