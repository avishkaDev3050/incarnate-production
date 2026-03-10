import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveImage(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = path.join(process.cwd(), "public/uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(uploadDir, filename);
  const dbPath = `/uploads/${folder}/${filename}`;
  
  await writeFile(filePath, buffer);
  return dbPath;
}