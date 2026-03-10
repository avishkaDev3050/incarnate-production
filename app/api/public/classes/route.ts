import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // select all approved classes
    const [rows]: any = await db.execute(
      "SELECT * FROM classes WHERE approved = 1 ORDER BY event_date DESC"
    );

    // If no data is found, we still return a 200 with an empty array
    return NextResponse.json({ 
      success: true, 
      count: rows.length,
      data: rows 
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Database connection error" }, 
      { status: 500 }
    );
  }
}
