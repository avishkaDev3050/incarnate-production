import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

// 1. FETCH LOGIC (සියලුම Testimonials ලබා ගැනීම)
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

// 2. SAVE LOGIC (අලුත් Testimonial එකක් ඇතුළත් කිරීම)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;
    let image_url = "";

    // Image Upload Logic
    const imageFile = formData.get("image") as File | null;
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
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
    console.error("TESTIMONIAL POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 3. UPDATE LOGIC (තිබෙන Testimonial එකක් Update කිරීම)
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const description = formData.get("description") as string;

    if (!id) {
      return NextResponse.json({ success: false, message: "Testimonial ID is required" }, { status: 400 });
    }

    // දැනට තියෙන image url එක හොයාගන්නවා (අලුත් image එකක් නොදැම්මොත් පරණ එකම තියාගන්න)
    const [currentRows]: any = await db.execute("SELECT image_url FROM testimonials WHERE id = ?", [id]);
    if (currentRows.length === 0) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }
    let image_url = currentRows[0].image_url;

    // අලුත් Image එකක් upload කරලා තියෙනවා නම් විතරක් ඒක process කරනවා
    const imageFile = formData.get("image") as File | null;
    if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(uploadPath, buffer);
      image_url = `/uploads/${filename}`;
    }

    // Database Update query
    await db.execute(
      "UPDATE testimonials SET name = ?, position = ?, description = ?, image_url = ? WHERE id = ?",
      [name, position, description, image_url, id]
    );

    return NextResponse.json({ success: true, message: "Testimonial updated successfully!" });
  } catch (error: any) {
    console.error("TESTIMONIAL PUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 4. DELETE LOGIC (Testimonial එකක් ඉවත් කිරීම)
// URL එක: /api/admin/testimonials?id=5 විදියට request එක එන්න ඕනේ
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Testimonial ID is required" }, { status: 400 });
    }

    // Database Delete query
    const [result]: any = await db.execute("DELETE FROM testimonials WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Testimonial not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully!" });
  } catch (error: any) {
    console.error("TESTIMONIAL DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}