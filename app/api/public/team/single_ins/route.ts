import { NextResponse, NextRequest } from "next/server"; // NextRequest add kara
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let query = "SELECT id, full_name, mobile, speciality, email, image_url, bio, status, approved, created_at FROM instructors WHERE approved = 1";
    let queryParams: any[] = [];

    // Id ekak thiyෙනවා නම් query ekata eka ekathu karanawa
    if (id) {
      query += " AND id = ?";
      queryParams.push(id);
    }

    query += " ORDER BY created_at DESC";

    const [rows]: any = await db.execute(query, queryParams);

    // Filter karala hambune nathnam 404 ekak yawanna puluwan (Optional)
    if (id && rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Instructor not found or not approved" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      count: rows.length,
      data: id ? rows[0] : rows // Id ekak ewwoth object ekak, nathnam array ekak
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Database connection error" }, 
      { status: 500 }
    );
  }
}