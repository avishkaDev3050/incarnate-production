import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

// 1. Fetch Logic (සියලුම Testimonials ලබා ගැනීම)
export async function GET() {
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM testimonials ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 2. Save Logic (අලුත් Testimonial එකක් ඇතුළත් කිරීම)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;
    let image_url = "";

    // Image Upload Logic
    const imageFile = formData.get("image") as File | null;
    if (imageFile && typeof imageFile !== "string") {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(uploadPath, buffer);
      image_url = `/uploads/${filename}`;
    }

    // Database Insert
    await db.execute(
      "INSERT INTO testimonials (name, position, description, image_url) VALUES (?, ?, ?, ?)",
      [name, position, description, image_url]
    );

    return NextResponse.json({ success: true, message: "Testimonial saved successfully!" });
  } catch (error: any) {
    console.error("TESTIMONIAL ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}