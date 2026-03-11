import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveImage } from "@/lib/imageUpload";

// Save slider data
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    
    const file: File | null = data.get("image") as unknown as File;
    const title = data.get("title");
    const subTitle = data.get("subTitle");

    let imageUrl = "";

    if (file && file.size > 0) {
      imageUrl = await saveImage(file, "slider");
    }

    const [result]: any = await db.execute(
      "INSERT INTO slider (main_title, sub_title, image_url) VALUES (?, ?, ?)",
      [title, subTitle, imageUrl]
    );

    return NextResponse.json({ 
      success: true, 
      message: "New slide inserted successfully", 
      data: { id: result.insertId, main_title: title, sub_title: subTitle, image_url: imageUrl }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Insert failed: " + error.message 
    }, { status: 500 });
  }
}

// GET handler to fetch all sliders
export async function GET() {
  try {
    // Fetch sliders ordered by the newest first
    const [rows] = await db.execute(
      "SELECT id, main_title, sub_title, image_url FROM slider ORDER BY id DESC"
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}
