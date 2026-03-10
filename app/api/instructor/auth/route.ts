import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SignJWT } from "jose";

const secretString = process.env.JWT_SECRET || "fallback_secret_key_123";
const JWT_SECRET = new TextEncoder().encode(secretString);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Check user
    const [rows]: any = await db.execute(
      "SELECT * FROM instructors WHERE email = ? LIMIT 1",
      [username]
    );

    const teacher = rows[0];

    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 401 });
    }

    // Password check 
    if (teacher.password !== password) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Type check 
    if (Number(teacher.status) !== 1) {
      return NextResponse.json({ message: "Teacher is not active" }, { status: 403 });
    }

    const token = await new SignJWT({ id: teacher.id, username: teacher.email, mobile: teacher.mobile })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") 
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set("instructor_token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2, 
    });

    return response;

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }
}