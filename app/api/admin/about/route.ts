import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // MySQL query returns [rows, fields]
    const [rows]: any = await db.query("SELECT * FROM about_content WHERE id = 1");
    
    // Check if rows array has data
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    const about = rows[0]; // Get the first row
    let paragraphs = [];

    if (about.paragraph) {
      try {
        // Try to parse JSON if it's a JSON string
        const parsed = JSON.parse(about.paragraph);
        paragraphs = Array.isArray(parsed) ? parsed : [{ content: about.paragraph }];
      } catch (e) {
        // If it's just plain text
        paragraphs = [{ content: about.paragraph }];
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        ...about, 
        paragraphs 
      } 
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title1 = (formData.get("title1") as string) || "";
    const title2 = (formData.get("title2") as string) || "";
    const paragraphsRaw = formData.get("paragraphs") as string;
    
    let image_url = (formData.get("image_url") as string) || "";
    const file = formData.get("image") as File;

    if (file && typeof file !== "string" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      image_url = `/uploads/${filename}`;
    }

    // Paragraph column eka TEXT nisa kelinma string eka yawanna
    await db.query(
      `INSERT INTO about_content (id, title1, title2, image_url, paragraph) 
       VALUES (1, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE title1=?, title2=?, image_url=?, paragraph=?`,
      [title1, title2, image_url, paragraphsRaw, title1, title2, image_url, paragraphsRaw]
    );

    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}