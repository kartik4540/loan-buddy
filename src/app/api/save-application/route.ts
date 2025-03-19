// app/api/save-application/route.ts
import { NextResponse } from "next/server";
import db from "../../../database";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const language = formData.get("language") as string;
  const responses = JSON.parse(formData.get("responses") as string);
  const videoFiles = formData.getAll("videos") as File[];
  const documentFile = formData.get("document") as File;
  const result = formData.get("result") as string;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const videoPaths = await Promise.all(
    videoFiles.map(async (file, index) => {
      const filePath = path.join(uploadsDir, `video-${Date.now()}-${index}.webm`);
      await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      return filePath;
    })
  );

  const documentPath = documentFile
    ? path.join(uploadsDir, `doc-${Date.now()}.jpg`)
    : null;
  if (documentFile) {
    await fs.writeFile(documentPath!, Buffer.from(await documentFile.arrayBuffer()));
  }

  const stmt = db.prepare(
    "INSERT INTO applications (language, responses, documentPath, result) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(language, JSON.stringify(responses), documentPath, result);

  return NextResponse.json({ id: info.lastInsertRowid });
}