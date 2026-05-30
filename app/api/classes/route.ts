import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// --- Helper to get User from Token ---
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("instructor_token")?.value;
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// 1. CREATE (POST)
export async function POST(req: Request) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const teacher_name = formData.get("teacher_name") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string; // ✅ Get City from form
    const image = formData.get("image") as File;

    let image_url = "";
    if (image && typeof image !== "string") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}_${image.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/classes");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      image_url = `/classes/${filename}`;
    }

    // ✅ Placeholders 8කට අදාළව array එකට [city] එකතු කර නිවැරදි කරන ලදී
    const [result]: any = await db.query(
      "INSERT INTO classes (title, teacher_name, event_date, event_time, address, image, teacher_email, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, teacher_name, date, time, address, image_url, payload.username, city]
    );

    return NextResponse.json({ success: true, instructorId: result.insertId });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. READ BY TEACHER (GET)
export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const [rows]: any = await db.query(
      "SELECT * FROM classes WHERE teacher_email = ? ORDER BY id DESC",
      [payload.username]
    );
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. UPDATE (PUT)
export async function PUT(req: Request) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const formData = await req.formData();

    const title = formData.get("title");
    const teacher_name = formData.get("teacher_name");
    const date = formData.get("date");
    const time = formData.get("time");
    const address = formData.get("address");
    const city = formData.get("city"); // ✅ Get City from form
    const image = formData.get("image");

    let updateQuery = "UPDATE classes SET title=?, teacher_name=?, event_date=?, event_time=?, address=?, city=? WHERE id=? AND teacher_email=?";
    let queryParams = [title, teacher_name, date, time, address, city, id, payload.username];

    if (image && typeof image !== "string") {
      const bytes = await (image as File).arrayBuffer();
      const filename = `${Date.now()}_${(image as File).name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/classes");
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      const image_url = `/classes/${filename}`;

      updateQuery = "UPDATE classes SET title=?, teacher_name=?, event_date=?, event_time=?, address=?, city=?, image=? WHERE id=? AND teacher_email=?";
      queryParams = [title, teacher_name, date, time, address, city, image_url, id, payload.username];
    }

    await db.query(updateQuery, queryParams);
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE
export async function DELETE(req: Request) {
  try {
    const payload = await getAuthUser();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const [rows]: any = await db.query("SELECT image FROM classes WHERE id=? AND teacher_email=?", [id, payload.username]);
    if (rows.length > 0 && rows[0].image) {
        const filePath = path.join(process.cwd(), "public", rows[0].image);
        try { await unlink(filePath); } catch (e) { console.log("File not found, skipping delete"); }
    }

    await db.query("DELETE FROM classes WHERE id=? AND teacher_email=?", [id, payload.username]);
    
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}