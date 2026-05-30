import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveImage, deleteImage } from "@/lib/imageUpload"; 

// 1. POST: Save slider data
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

// 2. GET: Fetch all sliders
export async function GET() {
  try {
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

// 3. PUT: Update slider data
export async function PUT(req: Request) {
  try {
    const data = await req.formData();
    
    const id = data.get("id");
    const title = data.get("title");
    const subTitle = data.get("subTitle");
    const file: File | null = data.get("image") as unknown as File;

    if (!id) {
      return NextResponse.json({ success: false, message: "Slider ID is required" }, { status: 400 });
    }

    // Parana slider eka database eken gannawa image URL eka checkpoint karanna
    const [rows]: any = await db.execute("SELECT image_url FROM slider WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Slider not found" }, { status: 404 });
    }
    
    let imageUrl = rows[0].image_url;

    // Aluth image ekak ewala thiyenam vitharak parana eka delete karala aluth eka save karanawa
    if (file && file.size > 0) {
      if (imageUrl) {
        await deleteImage(imageUrl); // Parana image eka path eken ain kireema
      }
      imageUrl = await saveImage(file, "slider"); // Aluth image eka save kireema
    }

    // Database update eka rankireema
    await db.execute(
      "UPDATE slider SET main_title = ?, sub_title = ?, image_url = ? WHERE id = ?",
      [title, subTitle, imageUrl, id]
    );

    return NextResponse.json({
      success: true,
      message: "Slider updated successfully",
      data: { id, main_title: title, sub_title: subTitle, image_url: imageUrl }
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Update failed: " + error.message 
    }, { status: 500 });
  }
}

// 4. DELETE: Delete slider and its image
export async function DELETE(req: Request) {
  try {
    // URL eken hari request body eken hari ID eka ganna puluwani (Methana URL search params valin gani)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Slider ID is required" }, { status: 400 });
    }

    // Delete karanna kalin image URL eka hoyagන්නවා file eka delete karanna
    const [rows]: any = await db.execute("SELECT image_url FROM slider WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Slider not found" }, { status: 404 });
    }

    const imageUrl = rows[0].image_url;

    // 1. Disk/Storage eken image eka ain karanawa
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    // 2. Database record eka delete karanawa
    await db.execute("DELETE FROM slider WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Slider and associated image deleted successfully"
    });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Deletion failed: " + error.message 
    }, { status: 500 });
  }
}