// app/api/save-application/route.ts
import { NextResponse } from "next/server";
import db from "../../../../database";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const language = formData.get("language") as string;
  const responses = JSON.parse(formData.get("responses") as string);
  const videoFiles = formData.getAll("videos") as File[];
  const documentFile = formData.get("document") as File;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  // Save video files
  const videoPaths = await Promise.all(
    videoFiles.map(async (file, index) => {
      const filePath = path.join(uploadsDir, `video-${Date.now()}-${index}.webm`);
      await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      return filePath;
    })
  );

  // Save document file
  const documentPath = documentFile
    ? path.join(uploadsDir, `doc-${Date.now()}.jpg`)
    : null;
  if (documentFile) {
    await fs.writeFile(documentPath!, Buffer.from(await documentFile.arrayBuffer()));
  }

  // Insert into database
  const stmt = db.prepare(
    "INSERT INTO applications (language, responses, documentPath, income, employmentDuration, existingLoans, result) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    language,
    JSON.stringify(responses),
    documentPath,
    responses[0] || 0, // Placeholder: income from first response
    responses[1] || 0, // Placeholder: employment duration
    responses[3] || 0, // Placeholder: existing loans
    null // Result to be updated later
  );

  return NextResponse.json({ id: info.lastInsertRowid });
}