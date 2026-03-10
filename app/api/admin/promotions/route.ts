import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Fetch data from Promotions table
export async function GET() {
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM Promotions ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Add new promotion with image upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title1 = formData.get("title1") as string;
    const title2 = formData.get("title2") as string;
    const description = formData.get("description") as string;
    const flag = formData.get("flag") as string;
    const btn_text = formData.get("btn_text") as string; // අලුතින් එකතු කළා
    const btn_url = formData.get("btn_url") as string;   // අලුතින් එකතු කළා
    const image = formData.get("image") as File | null;

    if (!title1 || !image) {
      return NextResponse.json(
        { success: false, message: "Title1 and Image are required" },
        { status: 400 }
      );
    }

    // Save image to server
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = Date.now() + "_" + image.name.replace(/\s+/g, "_");
    const uploadDir = path.join(process.cwd(), "public/uploads/promotions");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {}

    await writeFile(path.join(uploadDir, filename), buffer);
    const imageUrl = `/uploads/promotions/${filename}`;

    // Insert to database (අලුත් columns දෙක මෙතනට එකතු කළා)
    const [result]: any = await db.execute(
      "INSERT INTO Promotions (title1, title2, description, flag, btn_text, btn_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title1, title2, description, flag, btn_text, btn_url, imageUrl]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Promotion saved successfully",
      id: result.insertId 
    });

  } catch (error: any) {
    console.error("Promotion POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}