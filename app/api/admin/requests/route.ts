import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: සියලුම Course Requests ලබා ගැනීම
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM course_requests ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

// POST: අලුත් Request එකක් ඇතුළත් කිරීම (ඔයාගේ Form එකෙන් එන දත්ත)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, mobile, email } = body;

    if (!fullName || !mobile || !email) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const [result]: any = await db.query(
      "INSERT INTO course_requests (fullName, mobile, email) VALUES (?, ?, ?)",
      [fullName, mobile, email]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Request submitted successfully",
      id: result.insertId 
    });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params එක await කරන්න අවශ්‍යයි (Next.js 15+ නම්)
    const id = params.id; 

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const [result]: any = await db.query("DELETE FROM course_requests WHERE id = ?", [id]);

    // Delete වුණාද කියලා check කරන්න
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}