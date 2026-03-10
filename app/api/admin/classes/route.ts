import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // select all pending classes
    const [rows]: any = await db.execute(
      "SELECT * FROM classes WHERE approved = 0 ORDER BY id DESC"
    );

    // if not data
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

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    // Updates the 'approved' column for the specific instructor
    const [result]: any = await db.execute(
      "UPDATE classes SET approved = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Instructor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}