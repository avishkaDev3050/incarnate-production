import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

// GET: දත්ත ලබා ගැනීම
export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM training_explore LIMIT 1");
    const data = rows[0] || null;

    // JSON විදිහට තියෙන features string එක array එකක් බවට පත් කිරීම
    if (data && typeof data.features === "string") {
      data.features = JSON.parse(data.features);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: දත්ත Update කිරීම හෝ Insert කිරීම
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const journey_text = formData.get("journey_text") as string;
    const title_main = formData.get("title_main") as string;
    const title_highlight = formData.get("title_highlight") as string;
    const quote = formData.get("quote") as string;
    const description = formData.get("description") as string;
    const features = formData.get("features") as string; // JSON string
    let image_url = formData.get("image_url") as string || "";

    // Image Upload Logic
    const imageFile = formData.get("image") as File | null;
    if (imageFile && typeof imageFile !== "string") {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      // Folder එක නැත්නම් සාදන්න
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      await writeFile(path.join(uploadDir, filename), buffer);
      image_url = `/uploads/${filename}`;
    }

    // DB එකේ දැනට record එකක් තියෙනවාද බලන්න
    const [existing]: any = await db.execute("SELECT id FROM training_explore LIMIT 1");

    if (existing.length > 0) {
      // තිබේ නම් UPDATE කරන්න
      await db.execute(
        `UPDATE training_explore SET 
         journey_text=?, title_main=?, title_highlight=?, image_url=?, quote=?, description=?, features=? 
         WHERE id=?`,
        [journey_text, title_main, title_highlight, image_url, quote, description, features, existing[0].id]
      );
    } else {
      // නැත්නම් අලුතින් INSERT කරන්න
      await db.execute(
        `INSERT INTO training_explore 
         (journey_text, title_main, title_highlight, image_url, quote, description, features) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [journey_text, title_main, title_highlight, image_url, quote, description, features]
      );
    }

    return NextResponse.json({ success: true, message: "Successfully updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}