import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: "Mobile number is required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
      "SELECT id, module, created_at FROM instructor_modules WHERE teacher = ? ORDER BY created_at DESC",
      [mobile]
    );

    return NextResponse.json({ 
      success: true, 
      count: rows.length,
      data: rows 
    });

  } catch (error: any) {
    console.error("Module Search Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}