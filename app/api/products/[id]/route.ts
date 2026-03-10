import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to fix the error
    const { id } = await params;

    const [rows]: any = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const product = rows[0];
    let images = [];
    
    try {
      images = typeof product.images === "string" ? JSON.parse(product.images) : (product.images || []);
    } catch (e) {
      images = [];
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...product, images: Array.isArray(images) ? images : [] } 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}