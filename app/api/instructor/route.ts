import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import fs from "fs";

const secretString = process.env.JWT_SECRET || "fallback_secret_key_123";
const JWT_SECRET = new TextEncoder().encode(secretString);

// --- GET: Profile Data කියවීමට ---
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("instructor_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const instructorEmail = payload.username;

    // rows[0] ගන්න කලින් destruction එක බලන්න
    const [rows]: any = await db.execute(
      "SELECT id, full_name, speciality, email, image_url, bio FROM instructors WHERE email = ? LIMIT 1",
      [instructorEmail]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
  }
}

// --- PUT: Profile Data සහ Image Update කිරීමට ---
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    
    const full_name = formData.get("full_name") as string;
    const speciality = formData.get("speciality") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("image") as File | null;

    const cookieStore = await cookies();
    const token = cookieStore.get("instructor_token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const instructorEmail = payload.username;

    // 1. පරණ image එකේ path එක ගන්න
    const [rows]: any = await db.execute(
      "SELECT image_url FROM instructors WHERE email = ?",
      [instructorEmail]
    );
    let finalImageUrl = rows[0]?.image_url;

    // 2. අලුත් image එකක් ඇත්නම් පමණක් save කර පරණ එක delete කරන්න
    if (imageFile && imageFile.size > 0) {
      // පරණ එක delete කිරීම
      if (finalImageUrl) {
        const fullOldPath = path.join(process.cwd(), "public", finalImageUrl);
        if (fs.existsSync(fullOldPath)) {
          await unlink(fullOldPath).catch(e => console.log("Old file delete failed"));
        }
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}_${imageFile.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/instructors");
      
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      
      finalImageUrl = `/instructors/${filename}`;
    }

    // 3. Database Update
    await db.execute(
      "UPDATE instructors SET full_name = ?, speciality = ?, bio = ?, image_url = ?, approved = ? WHERE email = ?",
      [full_name, speciality, bio, finalImageUrl, 0, instructorEmail]
    );

    return NextResponse.json({ success: true, image_url: finalImageUrl });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
  }
}