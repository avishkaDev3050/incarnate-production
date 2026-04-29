import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_123");

async function getAdminFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  const { payload }: any = await jwtVerify(token, JWT_SECRET);
  return payload;
}

export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM wellbeing_hero WHERE id = 1");
    return NextResponse.json({ success: true, data: rows[0] || {} });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getAdminFromToken();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, paragraph1, paragraph2, paragraph3 } = await req.json();

    const query = `
      INSERT INTO wellbeing_hero (id, title, paragraph1, paragraph2, paragraph3)
      VALUES (1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        title = VALUES(title),
        paragraph1 = VALUES(paragraph1),
        paragraph2 = VALUES(paragraph2),
        paragraph3 = VALUES(paragraph3)
    `;

    await db.execute(query, [title, paragraph1, paragraph2, paragraph3]);

    return NextResponse.json({ success: true, message: "Wellbeing content updated" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}