import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { db } from "@/lib/db";

import { jwtVerify } from "jose";

const secretString = process.env.JWT_SECRET || "fallback_secret_key_123";

const JWT_SECRET = new TextEncoder().encode(secretString);

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("instructor_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const instructorEmail = payload.username;

    const [rows]: any = await db.execute(
      "SELECT id, full_name, speciality, email, image_url, bio FROM instructors WHERE email = ? LIMIT 1",

      [instructorEmail],
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { bio, image_url } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("instructor_token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Update the main instructor record directly
    await db.execute(
      "UPDATE instructors SET bio = ?, image_url = ?, approved = ? WHERE email = ?",
      [bio, image_url, 0, payload.username]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
