// app/loan-application/page.tsx
"use client";

import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";

export default function LoanApplication() {
  const languageData = {
    en: { name: "English", questions: ["What is your monthly income?", "..."], videoUrl: "..." },
    hi: { name: "Hindi", questions: ["आपकी मासिक आय क्या है?", "..."], videoUrl: "..." },
    ta: { name: "Tamil", questions: ["உங்கள் மாத வருமானம் என்ன?", "..."], videoUrl: "..." },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlobs, setVideoBlobs] = useState<(Blob | null)[]>([]);
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<"en" | "hi" | "ta">("en");
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentLanguage = languageData[language];

  const startRecording = () => {
    const stream = webcamRef.current?.stream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlobs((prev) => {
          const newBlobs = [...prev];
          newBlobs[currentStep] = blob;
          return newBlobs;
        });
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocumentImage(file);
  };

  const handleNext = async () => {
    if (currentStep < currentLanguage.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const formData = new FormData();
      formData.append("language", language);
      formData.append("responses", JSON.stringify(videoBlobs.map(() => "Pending")));
      videoBlobs.forEach((blob, i) => blob && formData.append("videos", blob, `video-${i}.webm`));
      if (documentImage) formData.append("document", documentImage);

      const saveRes = await fetch("/api/save-application", {
        method: "POST",
        body: formData,
      });
      const { id } = await saveRes.json();

      const processRes = await fetch("/api/process-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await processRes.json();
      setResult(data);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Loan Application Result</h1>
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-800 mb-4">{result.result}</p>
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setVideoBlobs([]);
              setDocumentImage(null);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Loan Application</h1>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "ta")}
        className="mb-6 p-2 border border-gray-300 rounded"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
      </select>

      <div className="w-full max-w-2xl mb-6">
        <ReactPlayer url={currentLanguage.videoUrl} width="100%" height="100%" controls />
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-800 mb-4">{currentLanguage.questions[currentStep]}</p>

        {currentStep < currentLanguage.questions.length - 1 ? (
          <>
            <Webcam audio ref={webcamRef} width="100%" videoConstraints={{ width: 640, height: 480 }} />
            {!videoBlobs[currentStep] ? (
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-red-300"
                >
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="px-4 py-2 bg-gray-600 text-white rounded disabled:bg-gray-300"
                >
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <video src={URL.createObjectURL(videoBlobs[currentStep]!)} controls width="100%" />
                <button
                  onClick={() => setVideoBlobs((prev) => { const newBlobs = [...prev]; newBlobs[currentStep] = null; return newBlobs; })}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded"
                >
                  Re-record
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <input type="file" accept="image/*" onChange={handleDocumentUpload} className="mb-4" />
            {documentImage && (
              <img src={URL.createObjectURL(documentImage)} alt="Document" className="w-full max-h-64 object-contain mb-4" />
            )}
          </>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:bg-gray-200"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentStep === currentLanguage.questions.length - 1
                ? !documentImage
                : !videoBlobs[currentStep]
            }
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
          >
            {currentStep === currentLanguage.questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}