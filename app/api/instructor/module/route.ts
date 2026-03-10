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

    const { payload }: any = await jwtVerify(token, JWT_SECRET);
    
    const teacherIdentifier = payload.mobile || payload.username; 

    // 2. එම Instructor ට අදාළ Modules පමණක් Fetch කිරීම
    const [modules]: any = await db.execute(
      "SELECT id, teacher, module, pdf_url, created_at FROM instructor_modules WHERE teacher = ? ORDER BY created_at DESC",
      [teacherIdentifier]
    );

    return NextResponse.json({ 
      success: true, 
      data: modules 
    });

  } catch (error) {
    console.error("Fetch Modules Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}