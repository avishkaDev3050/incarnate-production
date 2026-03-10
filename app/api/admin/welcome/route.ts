import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // 1. ප්‍රධාන විස්තර ටික ගන්න
    const [rows]: any = await db.execute(
      "SELECT * FROM welcome_section LIMIT 1",
    );
    const data = rows[0] || null;

    if (data) {
      // 2. ඒ අදාළ welcome_id එකට තියෙන paragraphs ටික වෙනම ගන්න
      const [paras]: any = await db.execute(
        "SELECT id, content FROM welcome_paragraphs WHERE welcome_id = ?",
        [data.id],
      );

      // 3. Paragraphs ටික data object එකට ඇතුල් කරන්න
      data.paragraphs = paras;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title1 = formData.get("title1") as string;
    const title2 = formData.get("title2") as string;
    const btn_text = formData.get("btn_text") as string;
    const btn_url = formData.get("btn_url") as string;
    const experience_text = formData.get("experience_text") as string;
    const paragraphsRaw = formData.get("paragraphs") as string;
    let image_url = (formData.get("image_url") as string) || "";

    const imageFile = formData.get("image") as File | null;
    if (imageFile && typeof imageFile !== "string") {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(uploadPath, buffer);
      image_url = `/uploads/${filename}`;
    }

    const [existing]: any = await db.execute(
      "SELECT id FROM welcome_section LIMIT 1",
    );
    let welcomeId: number;

    if (existing.length > 0) {
      welcomeId = existing[0].id;
      await db.execute(
        `UPDATE welcome_section SET title1=?, title2=?, btn_text=?, btn_url=?, experience_text=?, image_url=? WHERE id=?`,
        [
          title1,
          title2,
          btn_text,
          btn_url,
          experience_text,
          image_url,
          welcomeId,
        ],
      );
    } else {
      const [result]: any = await db.execute(
        `INSERT INTO welcome_section (title1, title2, btn_text, btn_url, experience_text, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
        [title1, title2, btn_text, btn_url, experience_text, image_url],
      );
      welcomeId = result.insertId;
    }

    if (paragraphsRaw) {
      const paragraphs = JSON.parse(paragraphsRaw);
      await db.execute("DELETE FROM welcome_paragraphs WHERE welcome_id = ?", [
        welcomeId,
      ]);
      for (const para of paragraphs) {
        if (para.content.trim() !== "") {
          await db.execute(
            "INSERT INTO welcome_paragraphs (welcome_id, content) VALUES (?, ?)",
            [welcomeId, para.content],
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
