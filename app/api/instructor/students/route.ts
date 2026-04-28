import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_123");

async function getInstructorFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("instructor_token")?.value;
  if (!token) return null;
  const { payload }: any = await jwtVerify(token, JWT_SECRET);
  return payload;
}

// GET: Instructor ge studentsla vitarak fetch kireema
export async function GET() {
  try {
    const payload = await getInstructorFromToken();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const instructorEmail = payload.username; // Token eken ganna identifier eka
    
    // Instructor ge email ekata adala studentsla vitarak gannawa
    const [students]: any = await db.execute(
      "SELECT * FROM student_registrations WHERE instructor_email = ? ORDER BY created_at DESC",
      [instructorEmail]
    );

    // Dropdown ekata modules ganna (optional - frontend ekedi use karanna puluwan)
    const teacherIdentifier = payload.mobile || payload.username;
    const [modules]: any = await db.execute(
      "SELECT module FROM instructor_modules WHERE teacher = ?",
      [teacherIdentifier]
    );

    return NextResponse.json({ 
        success: true, 
        students: students, 
        modules: modules 
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

// POST: Register a student
export async function POST(req: Request) {
  try {
    const payload = await getInstructorFromToken();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { student_name, mobile, nic, class_name } = await req.json();

    // Validation
    if (!student_name?.trim() || !mobile?.trim() || !class_name?.trim()) {
        return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const instructorEmail = payload.username;

    await db.execute(
      "INSERT INTO student_registrations (student_name, mobile, nic, class_name, instructor_email) VALUES (?, ?, ?, ?, ?)",
      [student_name.trim(), mobile.trim(), nic?.trim() || null, class_name.trim(), instructorEmail]
    );

    return NextResponse.json({ success: true, message: "Student registered successfully" });
  } catch (error) {
    console.error("Register Student Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}