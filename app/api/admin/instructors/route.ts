import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// 1. GET: සියලුම උපදේශකයින් ලබා ගැනීම
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT id, full_name, mobile, speciality, email, image_url, bio, status FROM instructors ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: අලුත් උපදේශකයෙකු ලියාපදිංචි කිරීම
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const full_name = formData.get("full_name") as string;
    const mobile = formData.get("mobile") as string;
    const speciality = formData.get("speciality") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const file = formData.get("image") as File;

    if (!full_name || !email || !password || !mobile || !file) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/instructors");
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    const image_url = `/instructors/${filename}`;

    const [result]: any = await db.query(
      "INSERT INTO instructors (full_name, mobile, speciality, email, password, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [full_name, mobile, speciality, email, password, image_url, 1] // Default active (1)
    );

    return NextResponse.json({ success: true, instructorId: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PATCH: Status එක Deactivate (0) කිරීම
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    // DB එකේ Column නම status ද approved ද කියලා බලන්න. මම මෙතන status පාවිච්චි කළා.
    const [result]: any = await db.execute(
      "UPDATE instructors SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Instructor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error: any) {
    return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
  }
}