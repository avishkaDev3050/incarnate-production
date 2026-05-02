import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM become_trainer LIMIT 1");
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}