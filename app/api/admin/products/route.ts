import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Helper: Saves a file to the disk
async function saveFile(file: File, subDir: string) {
  const uploadDir = path.join(process.cwd(), "public/uploads", subDir);
  await mkdir(uploadDir, { recursive: true });
  const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/${subDir}/${fileName}`;
}

// Helper: Safely parse JSON from MySQL
function parseJsonSafe(data: any) {
  if (!data) return [];
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return [data];
  }
}

// --- GET METHOD ---
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// --- POST METHOD ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const imageFiles = formData.getAll("files") as File[];
    const lessonPdf = formData.get("lessonPdf") as File | null;

    const savedImagePaths = [];
    for (const file of imageFiles) {
      if (file.size > 0) savedImagePaths.push(await saveFile(file, "products"));
    }

    let savedPdfPath = null;
    if (lessonPdf && lessonPdf.size > 0) {
      savedPdfPath = await saveFile(lessonPdf, "lessons");
    }

    await db.execute(
      "INSERT INTO products (name, category, price, description, images, pdf_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, category, price, description, JSON.stringify(savedImagePaths), savedPdfPath ? JSON.stringify([savedPdfPath]) : null]
    );

    return NextResponse.json({ success: true, message: "Product created" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "POST failed" }, { status: 500 });
  }
}

// --- PUT METHOD ---
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    const formData = await req.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const price = formData.get("price");
    const description = formData.get("description");
    const imageFiles = formData.getAll("files") as File[];
    const lessonPdf = formData.get("lessonPdf") as File | null;

    const [oldRows]: any = await db.query("SELECT images, pdf_url FROM products WHERE id = ?", [id]);
    const oldData = oldRows[0];

    let imagesJson = null;
    let pdfJson = null;

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      const oldImages = parseJsonSafe(oldData?.images);
      for (const p of oldImages) try { await unlink(path.join(process.cwd(), "public", p)); } catch (e) {}
      const newPaths = [];
      for (const file of imageFiles) newPaths.push(await saveFile(file, "products"));
      imagesJson = JSON.stringify(newPaths);
    }

    if (lessonPdf && lessonPdf.size > 0) {
      const oldPdfs = parseJsonSafe(oldData?.pdf_url);
      for (const p of oldPdfs) try { await unlink(path.join(process.cwd(), "public", p)); } catch (e) {}
      pdfJson = JSON.stringify([await saveFile(lessonPdf, "lessons")]);
    }

    let query = "UPDATE products SET name=?, category=?, price=?, description=?";
    const params = [name, category, price, description];
    if (imagesJson) { query += ", images=?"; params.push(imagesJson); }
    if (pdfJson) { query += ", pdf_url=?"; params.push(pdfJson); }
    query += " WHERE id=?";
    params.push(id);

    await db.execute(query, params);
    return NextResponse.json({ success: true, message: "Updated" });
  } catch (err) {
    return NextResponse.json({ success: false, error: "PUT failed" }, { status: 500 });
  }
}

// --- DELETE METHOD ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    const [rows]: any = await db.query("SELECT images, pdf_url FROM products WHERE id = ?", [id]);
    if (rows.length > 0) {
      const filesToDelete = [...parseJsonSafe(rows[0].images), ...parseJsonSafe(rows[0].pdf_url)];
      for (const p of filesToDelete) try { await unlink(path.join(process.cwd(), "public", p)); } catch (e) {}
    }

    await db.execute("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}