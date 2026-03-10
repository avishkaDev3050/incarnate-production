import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveImage } from "@/lib/imageUpload";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM gallery ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No image uploaded" }, { status: 400 });
    }

    const dbPath = await saveImage(file, "gallery");
    const [result]: any = await db.execute("INSERT INTO gallery (image_url) VALUES (?)", [dbPath]);

    return NextResponse.json({ 
      success: true, 
      message: "Image added to gallery",
      data: { id: result.insertId, image_url: dbPath }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}