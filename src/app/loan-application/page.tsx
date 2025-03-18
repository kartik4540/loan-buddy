// app/loan-application/page.tsx
"use client";

import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";

export default function LoanApplication() {
  const questions = [
    "Hello! I’m your AI Branch Manager. What is your monthly income?",
    "Great! How long have you been employed at your current job?",
    "What type of loan are you applying for? (e.g., personal, home, car)",
    "Do you have any existing loans? If yes, please specify the amount.",
    "Perfect! Now, please upload your Aadhaar, PAN, or income proof.",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const videoUrl = "https://www.youtube.com/watch?v=ysz5S6PUM-U"; // Placeholder

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setResponses([...responses, "Sample response"]); // Placeholder for video response
      setCurrentStep(currentStep + 1);
      setVideoBlob(null);
      setDocumentImage(null);
      setExtractedData(null);
    } else {
      evaluateEligibility();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setVideoBlob(null);
      setDocumentImage(null);
      setExtractedData(null);
    }
  };

  const startRecording = () => {
    const stream = webcamRef.current?.stream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
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
    if (file) {
      setDocumentImage(file);
      setExtractedData({
        name: "John Doe",
        dob: "1990-05-15",
        income: "50000",
        employmentType: "Full-time",
      });
    }
  };

  const evaluateEligibility = () => {
    // Placeholder data from responses and document
    const income = parseInt(extractedData?.income || "0");
    const employmentDuration = parseInt(responses[1] || "0"); // e.g., "2 years"
    const existingLoans = parseInt(responses[3] || "0"); // e.g., "10000"

    // Simple rule-based logic
    if (income < 30000) {
      setResult("❌ Rejected: Income below minimum requirement (₹30,000).");
    } else if (employmentDuration < 1) {
      setResult("❌ Rejected: Employment duration too short (minimum 1 year).");
    } else if (existingLoans > income * 0.5) {
      setResult("❌ Rejected: Existing loans exceed 50% of income.");
    } else if (!extractedData) {
      setResult("🔄 More Info Needed: Please upload valid documents.");
    } else {
      setResult("✅ Approved: Congratulations, you’re eligible for a loan!");
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Loan Application Result
        </h1>
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-800 mb-4">{result}</p>
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setResponses([]);
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
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Loan Application
      </h1>

      {/* AI Manager Video */}
      <div className="w-full max-w-2xl mb-6">
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
            className="absolute top-0 left-0"
          />
        </div>
      </div>

      {/* Question and Response */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-800 mb-4">{questions[currentStep]}</p>

        {currentStep < questions.length - 1 ? (
          <>
            {/* Webcam for Recording */}
            <div className="mb-4">
              <Webcam
                audio={true}
                ref={webcamRef}
                width="100%"
                videoConstraints={{ width: 640, height: 480 }}
              />
            </div>

            {/* Recording Controls */}
            {!videoBlob ? (
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-red-300 hover:bg-red-700 transition"
                >
                  {isRecording ? "Recording..." : "Start Recording"}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="px-4 py-2 bg-gray-600 text-white rounded disabled:bg-gray-300 hover:bg-gray-700 transition"
                >
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <video
                  src={URL.createObjectURL(videoBlob)}
                  controls
                  width="100%"
                />
                <button
                  onClick={() => setVideoBlob(null)}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                >
                  Re-record
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Document Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleDocumentUpload}
              className="mb-4"
            />
            {documentImage && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(documentImage)}
                  alt="Uploaded Document"
                  className="w-full max-h-64 object-contain"
                />
              </div>
            )}
            {extractedData && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Extracted Data:</h3>
                <p>Name: {extractedData.name}</p>
                <p>DOB: {extractedData.dob}</p>
                <p>Income: ₹{extractedData.income}</p>
                <p>Employment Type: {extractedData.employmentType}</p>
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded disabled:bg-gray-200 hover:bg-gray-500 transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentStep === questions.length - 1
                ? !documentImage
                : !videoBlob
            }
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300 hover:bg-blue-700 transition"
          >
            {currentStep === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}