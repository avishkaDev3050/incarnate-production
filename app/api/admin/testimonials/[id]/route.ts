import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // params දැන් Promise එකක්
) {
  try {
    // 1. params ටික await කරලා id එක ලබා ගැනීම
    const { id } = await params;

    // 2. Database එකෙන් image එක තියෙනවාදැයි බැලීම
    const [rows]: any = await db.execute("SELECT image_url FROM testimonials WHERE id = ?", [id]);
    
    if (rows.length > 0 && rows[0].image_url) {
      const filePath = path.join(process.cwd(), "public", rows[0].image_url);
      try {
        await unlink(filePath);
      } catch (err) {
        console.log("File not found or already deleted");
      }
    }

    // 3. Database එකෙන් record එක delete කිරීම
    await db.execute("DELETE FROM testimonials WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}