import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: සියලුම වීඩියෝ විස්තර ලබා ගැනීමට
export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM videos ORDER BY id DESC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching videos" }, { status: 500 });
  }
}

// POST: අලුත් වීඩියෝවක් ඇතුළත් කිරීමට හෝ තිබෙන එකක් යාවත්කාලීන කිරීමට
export async function POST(req: Request) {
  try {
    const { id, title, description, video_url } = await req.json();

    // වීඩියෝ ලින්ක් එක අනිවාර්යයෙන් තිබිය යුතුයි
    if (!video_url) {
      return NextResponse.json({ message: "Video URL is required" }, { status: 400 });
    }

    if (id) {
      // Update: පවතින වීඩියෝවක් Update කිරීම
      await db.execute(
        "UPDATE videos SET title = ?, description = ?, video_url = ? WHERE id = ?",
        [title, description, video_url, id]
      );
    } else {
      // Insert: අලුත් වීඩියෝවක් Database එකට එක් කිරීම
      await db.execute(
        "INSERT INTO videos (title, description, video_url) VALUES (?, ?, ?)",
        [title, description, video_url]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error saving video" }, { status: 500 });
  }
}

// DELETE: වීඩියෝවක් ඉවත් කිරීමට
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await db.execute("DELETE FROM videos WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting video" }, { status: 500 });
  }
}