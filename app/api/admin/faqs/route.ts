import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.execute("SELECT * FROM faqs ORDER BY display_order ASC");
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, question, answer, category } = await req.json();

    if (id) {
      // Update existing FAQ
      await db.execute(
        "UPDATE faqs SET question = ?, answer = ?, category = ? WHERE id = ?",
        [question, answer, category, id]
      );
    } else {
      // Insert new FAQ
      await db.execute(
        "INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)",
        [question, answer, category]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Error saving FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await db.execute("DELETE FROM faqs WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting FAQ" }, { status: 500 });
  }
}