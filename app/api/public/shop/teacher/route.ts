import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 1. Extract email from query parameters (e.g., /api/instructor?email=test@test.com)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    // 2. Query the database
    const [rows]: any = await db.execute(
      "SELECT id, full_name, speciality, email, image_url, bio FROM instructors WHERE email = ? LIMIT 1",
      [email]
    );

    // 3. Handle not found
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Instructor not found" },
        { status: 404 }
      );
    }

    // 4. Return the instructor data
    return NextResponse.json({ success: true, data: rows[0] });

  } catch (error) {
    console.error("[INSTRUCTOR_SEARCH_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}