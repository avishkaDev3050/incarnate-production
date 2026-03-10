import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM `orders` ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const connection = await db.getConnection();
  try {
    const body = await req.json();
    // Use teacher_email to match your instructor_modules schema
    const { id, status, teacher_email, module_name, pdf_url } = body;

    await connection.beginTransaction();

    // 1. Update the order status
    await connection.query(
      "UPDATE `orders` SET status = ? WHERE id = ?",
      [status, id]
    );

    // 2. If shipped, sync to instructor_modules
    if (status === 'shipped') {
      if (!teacher_email || !module_name) {
        throw new Error("Missing teacher_email or module_name for sync.");
      }

      // Matches schema: teacher_email (VARCHAR), module (VARCHAR)
      await connection.query(
        "INSERT INTO instructor_modules (teacher, module, pdf_url) VALUES (?, ?, ?)",
        [teacher_email, module_name, pdf_url || '']
      );
    }

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await connection.rollback();
    console.error("Order Update Sync Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    connection.release();
  }
}