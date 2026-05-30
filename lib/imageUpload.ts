import { writeFile, mkdir, unlink } from "fs/promises"; // unlink ekathu kara
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

// Image eka delete karana function eka
export async function deleteImage(dbPath: string): Promise<boolean> {
  try {
    if (!dbPath) return false;

    // Database eke thiyena `/uploads/slider/filename.jpg` wage path eka 
    // Server eke thiyena absolute path ekata (`public/uploads/slider/filename.jpg`) harawanawa
    const filePath = path.join(process.cwd(), "public", dbPath);

    // File eka adala path eken permanent ma delete karanawa
    await unlink(filePath);
    return true;
  } catch (error) {
    // Monawa hari hethuwakin file eka nathnam hari (already deleted), delete wenna bari unamath error eka console karagන්නවා
    console.error("Image deletion error:", error);
    return false;
  }
}