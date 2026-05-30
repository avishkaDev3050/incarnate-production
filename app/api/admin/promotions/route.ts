import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM promotions ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const title1 = formData.get("title1") as string;
    const title2 = formData.get("title2") as string;
    const description = formData.get("description") as string;
    const flag = formData.get("flag") as string;
    const btn_text = formData.get("btn_text") as string; 
    const btn_url = formData.get("btn_url") as string;   
    const image = formData.get("image") as File | null;

    if (!title1 || !image) {
      return NextResponse.json(
        { success: false, message: "Title1 and Image are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = Date.now() + "_" + image.name.replace(/\s+/g, "_");
    const uploadDir = path.join(process.cwd(), "public/uploads/promotions");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {}

    await writeFile(path.join(uploadDir, filename), buffer);
    const imageUrl = `/uploads/promotions/${filename}`;

    const [result]: any = await db.execute(
      "INSERT INTO promotions (title1, title2, description, flag, btn_text, btn_url, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
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

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const title1 = formData.get("title1") as string;
    const title2 = formData.get("title2") as string;
    const description = formData.get("description") as string;
    const flag = formData.get("flag") as string;
    const btn_text = formData.get("btn_text") as string;
    const btn_url = formData.get("btn_url") as string;
    const image = formData.get("image") as File | null;

    if (!id || !title1) {
      return NextResponse.json(
        { success: false, message: "ID and Title1 are required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.execute("SELECT image_url FROM promotions WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Promotion not found" }, { status: 404 });
    }

    let imageUrl = rows[0].image_url;

    if (image && image.size > 0) {
      if (imageUrl) {
        try {
          const oldFilePath = path.join(process.cwd(), "public", imageUrl);
          await unlink(oldFilePath);
        } catch (err) {
          console.error("Old image deletion failed:", err);
        }
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + "_" + image.name.replace(/\s+/g, "_");
      const uploadDir = path.join(process.cwd(), "public/uploads/promotions");

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {}

      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/promotions/${filename}`;
    }

    await db.execute(
      "UPDATE promotions SET title1 = ?, title2 = ?, description = ?, flag = ?, btn_text = ?, btn_url = ?, image_url = ? WHERE id = ?",
      [title1, title2, description, flag, btn_text, btn_url, imageUrl, id]
    );

    return NextResponse.json({ success: true, message: "Promotion updated successfully" });

  } catch (error: any) {
    console.error("Promotion PUT Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Promotion ID is required" }, { status: 400 });
    }

    const [rows]: any = await db.execute("SELECT image_url FROM promotions WHERE id = ?", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Promotion not found" }, { status: 404 });
    }

    const imageUrl = rows[0].image_url;

    if (imageUrl) {
      try {
        const filePath = path.join(process.cwd(), "public", imageUrl);
        await unlink(filePath);
      } catch (err) {
        console.error("Image file deletion failed:", err);
      }
    }

    await db.execute("DELETE FROM promotions WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Promotion and image deleted successfully" });

  } catch (error: any) {
    console.error("Promotion DELETE Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}