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

// GET: Footer data fetch කිරීම
export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM footer_settings WHERE id = 1");
    return NextResponse.json(rows[0] || {});
  } catch (error) {
    return NextResponse.json({ message: "Error fetching footer" }, { status: 500 });
  }
}

// POST: Footer data Create හෝ Update කිරීම
export async function POST(req: Request) {
  try {
    const payload = await getAdminFromToken();
    if (!payload) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { brand_description, facebook_url, instagram_url, twitter_url, address, phone, email } = data;

    // ON DUPLICATE KEY UPDATE භාවිතා කර එකම query එකෙන් logic එක handle කළ හැක
    const query = `
      INSERT INTO footer_settings (id, brand_description, facebook_url, instagram_url, twitter_url, address, phone, email)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        brand_description = VALUES(brand_description),
        facebook_url = VALUES(facebook_url),
        instagram_url = VALUES(instagram_url),
        twitter_url = VALUES(twitter_url),
        address = VALUES(address),
        phone = VALUES(phone),
        email = VALUES(email)
    `;

    await db.execute(query, [
      brand_description, 
      facebook_url, 
      instagram_url, 
      twitter_url, 
      address, 
      phone, 
      email
    ]);

    return NextResponse.json({ success: true, message: "Footer updated successfully" });
  } catch (error) {
    console.error("Footer Update Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}