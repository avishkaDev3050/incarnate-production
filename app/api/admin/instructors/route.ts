import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Get form data fields
    const full_name = formData.get("full_name") as string;
    const mobile = formData.get("mobile") as string;
    const speciality = formData.get("speciality") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const file = formData.get("image") as File;

    // --- FIX 1: Corrected Validation Logic ---
    // Added !mobile and fixed the logic so it only fails if fields are MISSING
    if (!full_name || !email || !password || !mobile || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (Name, Email, Password, Mobile, or Image)" },
        { status: 400 }
      );
    }

    // --- Image Upload Handling ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename with timestamp
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/instructors");
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    
    const image_url = `/instructors/${filename}`;

    // --- Database Insertion ---
    // FIX 2: Added the 6th "?" placeholder to match the 6 columns provided
    const [result]: any = await db.query(
      "INSERT INTO instructors (full_name, mobile, speciality, email, password, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, mobile, speciality, email, password, image_url]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Instructor saved successfully",
      instructorId: result.insertId 
    });

  } catch (error: any) {
    console.error("Instructor Post Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Fetch all instructors to show in admin panel
export async function GET() {
  try {
    // FIX 3: Added 'mobile' to the SELECT query so the frontend can display it
    const [rows]: any = await db.query(
      "SELECT id, full_name, mobile, speciality, email, image_url, bio FROM instructors ORDER BY id DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}