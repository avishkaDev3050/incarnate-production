import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM team_intro LIMIT 1");
    if (rows.length === 0) return NextResponse.json({ success: true, data: null });

    const [paras]: any = await db.execute(
      "SELECT id, content FROM team_intro_paragraphs WHERE team_intro_id = ?",
      [rows[0].id]
    );

    return NextResponse.json({ 
      success: true, 
      data: { ...rows[0], paragraphs: paras } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title1 = formData.get("title1");
    const names_highlight = formData.get("names_highlight");
    const footer_name = formData.get("footer_name");
    const paragraphs = JSON.parse(formData.get("paragraphs") as string);
    const file = formData.get("image") as File;
    let image_url = formData.get("image_url") as string;

    // Image Upload Logic
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/team");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      image_url = `/uploads/team/${filename}`;
    }

    // Update or Insert
    const [existing]: any = await db.execute("SELECT id FROM team_intro LIMIT 1");
    let teamId;

    if (existing.length > 0) {
      teamId = existing[0].id;
      await db.execute(
        "UPDATE team_intro SET title1=?, names_highlight=?, footer_name=?, image_url=? WHERE id=?",
        [title1, names_highlight, footer_name, image_url, teamId]
      );
    } else {
      const [result]: any = await db.execute(
        "INSERT INTO team_intro (title1, names_highlight, footer_name, image_url) VALUES (?, ?, ?, ?)",
        [title1, names_highlight, footer_name, image_url]
      );
      teamId = result.insertId;
    }

    // Sync Paragraphs (Delete old and insert new)
    await db.execute("DELETE FROM team_intro_paragraphs WHERE team_intro_id = ?", [teamId]);
    for (const p of paragraphs) {
      if (p.content.trim()) {
        await db.execute("INSERT INTO team_intro_paragraphs (team_intro_id, content) VALUES (?, ?)", [teamId, p.content]);
      }
    }

    return NextResponse.json({ success: true, message: "Team intro updated!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}