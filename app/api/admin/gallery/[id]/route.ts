import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [rows]: any = await db.execute("SELECT image_url FROM gallery WHERE id = ?", [id]);
    
    if (rows.length > 0) {
      const filePath = path.join(process.cwd(), "public", rows[0].image_url);
      try {
        await unlink(filePath); // File එක server එකෙන් delete කරනවා
      } catch (err) {
        console.log("File not found on server");
      }
    }

    await db.execute("DELETE FROM gallery WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Image removed from gallery" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}