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
      "SELECT * FROM admin WHERE username = ? LIMIT 1",
      [username]
    );

    const admin = rows[0];

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 401 });
    }

    // Password check 
    if (admin.password !== password) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // Type check 
    if (Number(admin.type) !== 1) {
      return NextResponse.json({ message: "Admin is not active" }, { status: 403 });
    }

    const token = await new SignJWT({ id: admin.id, username: admin.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") // පැය 2කින් session එක ඉවර වෙනවා
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set("admin_token", token, {
      httpOnly: true, // ආරක්ෂාව සඳහා (JavaScript වලට කියවන්න බෑ)
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 2, // තත්පර වලින් (පැය 2)
    });

    return response;

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
  }
}