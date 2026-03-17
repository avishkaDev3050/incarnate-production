import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Promise එකක් ලෙස අර්ථ දක්වන්න
) {
  try {
    // params එක await කරන්න
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ success: false, error: "ID missing" }, { status: 400 });
    }

    const [result]: any = await db.query("DELETE FROM course_requests WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}