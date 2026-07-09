import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendCsvEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { csvContent, filename } = body;

    if (!csvContent || !filename) {
      return NextResponse.json(
        { success: false, error: "csvContent and filename are required" },
        { status: 400 }
      );
    }

    const sent = await sendCsvEmail(user.email, user.name, csvContent, filename);

    if (!sent) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "CSV file sent to your email successfully",
    });
  } catch (error) {
    console.error("Email CSV error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
