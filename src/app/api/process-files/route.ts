// app/api/process-files/route.ts
import { NextResponse } from "next/server";
import db from "../../../../database";
import { createWorker } from "tesseract.js";
import { pipeline } from "@xenova/transformers";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { id } = await request.json();
  const app = db
    .prepare("SELECT * FROM applications WHERE id = ?")
    .get(id);

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  // Extract audio from videos and transcribe with Whisper
  const videoPaths = JSON.parse(app.responses).map((_, i) =>
    path.join(process.cwd(), "public", "uploads", `video-${i}-${id}.webm`)
  );
  const whisper = await pipeline("automatic-speech-recognition", "openai/whisper-tiny.en");
  const responses = await Promise.all(
    videoPaths.map(async (videoPath, index) => {
      const audioPath = videoPath.replace(".webm", ".wav");
      await execAsync(`ffmpeg -i ${videoPath} -acodec pcm_s16le -ar 16000 ${audioPath}`);
      const result = await whisper(audioPath);
      return result.text || "Sample response";
    })
  );

  // OCR with Tesseract
  let extractedData = null;
  if (app.documentPath) {
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(app.documentPath);
    await worker.terminate();
    extractedData = {
      name: data.text.match(/Name:?\s*([^\n]+)/i)?.[1] || "Unknown",
      dob: data.text.match(/DOB:?\s*(\d{4}-\d{2}-\d{2})/i)?.[1] || "Unknown",
      income: data.text.match(/Income:?\s*₹?(\d+)/i)?.[1] || "0",
      employmentType: data.text.match(/Employment:?\s*([^\n]+)/i)?.[1] || "Unknown",
    };
  }

  // Evaluate eligibility
  const income = parseInt(extractedData?.income || responses[0] || "0");
  const employmentDuration = parseInt(responses[1] || "0");
  const existingLoans = parseInt(responses[3] || "0");
  let result = "";
  if (income < 30000) result = "❌ Rejected: Income below ₹30,000.";
  else if (employmentDuration < 1) result = "❌ Rejected: Employment < 1 year.";
  else if (existingLoans > income * 0.5) result = "❌ Rejected: Loans > 50% income.";
  else if (!extractedData) result = "🔄 More Info Needed: Invalid documents.";
  else result = "✅ Approved: Congratulations!";

  // Update database
  db.prepare("UPDATE applications SET responses = ?, income = ?, employmentDuration = ?, existingLoans = ?, result = ? WHERE id = ?").run(
    JSON.stringify(responses),
    income,
    employmentDuration,
    existingLoans,
    result,
    id
  );

  return NextResponse.json({ responses, extractedData, result });
}