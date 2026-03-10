import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const [rows]: any = await db.execute(
      "SELECT image_url FROM Slider WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: "Slide not found" }, { status: 404 });
    }

    const imageUrl = rows[0].image_url;

    await db.execute("DELETE FROM Slider WHERE id = ?", [id]);

    if (imageUrl) {
      const filePath = path.join(process.cwd(), "public", imageUrl);
      try {
        await unlink(filePath);
      } catch (err) {
        console.error("File deletion error:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}