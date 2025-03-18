// app/loan-application/page.tsx
"use client";

import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";

export default function LoanApplication() {
  // Language data (expand with real translations and video URLs)
  const languageData = {
    en: {
      name: "English",
      questions: [
        "Hello! I’m your AI Branch Manager. What is your monthly income?",
        "Great! How long have you been employed at your current job?",
        "What type of loan are you applying for? (e.g., personal, home, car)",
        "Do you have any existing loans? If yes, please specify the amount.",
        "Perfect! Now, please upload your Aadhaar, PAN, or income proof.",
      ],
      videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U", // Placeholder
    },
    hi: {
      name: "Hindi",
      questions: [
        "नमस्ते! मैं आपका AI शाखा प्रबंधक हूँ। आपकी मासिक आय क्या है?",
        "बढ़िया! आप अपनी वर्तमान नौकरी में कितने समय से हैं?",
        "आप किस प्रकार का ऋण लेना चाहते हैं? (उदाहरण: व्यक्तिगत, घर, कार)",
        "क्या आपके पास कोई मौजूदा ऋण है? यदि हाँ, तो राशि बताएं।",
        "उत्तम! अब कृपया अपना आधार, पैन, या आय प्रमाण अपलोड करें।",
      ],
      videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U", // Same placeholder
    },
    ta: {
      name: "Tamil",
      questions: [
        "வணக்கம்! நான் உங்கள் AI கிளை மேலாளர். உங்கள் மாத வருமானம் என்ன?",
        "சிறப்பு! நீங்கள் தற்போதைய வேலையில் எவ்வளவு காலம் இருக்கிறீர்கள்?",
        "நீங்கள் எந்த வகையான கடனுக்கு விண்ணப்பிக்க விரும்புகிறீர்கள்? (எ.கா., தனிப்பட்ட, வீடு, கார்)",
        "உங்களிடம் ஏற்கனவே கடன்கள் உள்ளனவா? ஆம் எனில், தொகையை குறிப்பிடவும்。",
        "சரியாக! இப்போது உங்கள் ஆதார், பான், அல்லது வருமான சான்றை பதிவேற்றவும்。",
      ],
      videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U", // Same placeholder
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "hi" | "ta">("en");
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentLanguage = languageData[language];

  const handleNext = () => {
    if (currentStep < currentLanguage.questions.length - 1) {
      setResponses([...responses, "Sample response"]);
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
    const income = parseInt(extractedData?.income || "0");
    const employmentDuration = parseInt(responses[1] || "0");
    const existingLoans = parseInt(responses[3] || "0");

    if (income < 30000) {
      setResult(
        language === "en"
          ? "❌ Rejected: Income below minimum requirement (₹30,000)."
          : language === "hi"
          ? "❌ अस्वीकृत: आय न्यूनतम आवश्यकता (₹30,000) से कम है।"
          : "❌ நிராகரிக்கப்பட்டது: வருமானம் குறைந்தபட்ச தேவையை விட குறைவு (₹30,000)."
      );
    } else if (employmentDuration < 1) {
      setResult(
        language === "en"
          ? "❌ Rejected: Employment duration too short (minimum 1 year)."
          : language === "hi"
          ? "❌ अस्वीकृत: रोजगार अवधि बहुत कम है (न्यूनतम 1 वर्ष)।"
          : "❌ நிராகரிக்கப்பட்டது: வேலைவாய்ப்பு காலம் மிகக் குறைவு (குறைந்தபட்சம் 1 ஆண்டு)."
      );
    } else if (existingLoans > income * 0.5) {
      setResult(
        language === "en"
          ? "❌ Rejected: Existing loans exceed 50% of income."
          : language === "hi"
          ? "❌ अस्वीकृत: मौजूदा ऋण आय का 50% से अधिक हैं।"
          : "❌ நிராகரிக்கப்பட்டது: தற்போதைய கடன்கள் வருமானத்தின் 50% ஐ விட அதிகம்."
      );
    } else if (!extractedData) {
      setResult(
        language === "en"
          ? "🔄 More Info Needed: Please upload valid documents."
          : language === "hi"
          ? "🔄 अधिक जानकारी चाहिए: कृपया वैध दस्तावेज अपलोड करें।"
          : "🔄 மேலும் தகவல் தேவை: சரியான ஆவணங்களை பதிவேற்றவும்."
      );
    } else {
      setResult(
        language === "en"
          ? "✅ Approved: Congratulations, you’re eligible for a loan!"
          : language === "hi"
          ? "✅ स्वीकृत: बधाई हो, आप ऋण के लिए पात्र हैं!"
          : "✅ அங்கீகரிக்கப்பட்டது: வாழ்த்துக்கள், நீங்கள் கடனுக்கு தகுதியானவர்!"
      );
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          {language === "en"
            ? "Loan Application Result"
            : language === "hi"
            ? "ऋण आवेदन परिणाम"
            : "கடன் விண்ணப்ப முடிவு"}
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
            {language === "en"
              ? "Start Over"
              : language === "hi"
              ? "फिर से शुरू करें"
              : "மீண்டும் தொடங்கு"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        {language === "en"
          ? "Loan Application"
          : language === "hi"
          ? "ऋण आवेदन"
          : "கடன் விண்ணப்பம்"}
      </h1>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="mr-2 text-gray-700">Select Language:</label>
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value as "en" | "hi" | "ta")
          }
          className="p-2 border border-gray-300 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      {/* AI Manager Video */}
      <div className="w-full max-w-2xl mb-6">
        <div className="relative pt-[56.25%]">
          <ReactPlayer
            url={currentLanguage.videoUrl}
            width="100%"
            height="100%"
            controls={true}
            className="absolute top-0 left-0"
          />
        </div>
      </div>

      {/* Question and Response */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-800 mb-4">
          {currentLanguage.questions[currentStep]}
        </p>

        {currentStep < currentLanguage.questions.length - 1 ? (
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
                  {isRecording
                    ? language === "en"
                      ? "Recording..."
                      : language === "hi"
                      ? "रिकॉर्डिंग..."
                      : "பதிவு செய்யப்படுகிறது..."
                    : language === "en"
                    ? "Start Recording"
                    : language === "hi"
                    ? "रिकॉर्डिंग शुरू करें"
                    : "பதிவை தொடங்கு"}
                </button>
                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="px-4 py-2 bg-gray-600 text-white rounded disabled:bg-gray-300 hover:bg-gray-700 transition"
                >
                  {language === "en"
                    ? "Stop Recording"
                    : language === "hi"
                    ? "रिकॉर्डिंग रोकें"
                    : "பதிவை நிறுத்து"}
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
                  {language === "en"
                    ? "Re-record"
                    : language === "hi"
                    ? "फिर से रिकॉर्ड करें"
                    : "மீண்டும் பதிவு செய்"}
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
                <h3 className="text-lg font-semibold">
                  {language === "en"
                    ? "Extracted Data:"
                    : language === "hi"
                    ? "निकाला गया डेटा:"
                    : "பிரித்தெடுக்கப்பட்ட தரவு:"}
                </h3>
                <p>
                  {language === "en"
                    ? "Name:"
                    : language === "hi"
                    ? "नाम:"
                    : "பெயர்:"}{" "}
                  {extractedData.name}
                </p>
                <p>
                  {language === "en"
                    ? "DOB:"
                    : language === "hi"
                    ? "जन्म तिथि:"
                    : "பிறந்த தேதி:"}{" "}
                  {extractedData.dob}
                </p>
                <p>
                  {language === "en"
                    ? "Income:"
                    : language === "hi"
                    ? "आय:"
                    : "வருமானம்:"}{" "}
                  ₹{extractedData.income}
                </p>
                <p>
                  {language === "en"
                    ? "Employment Type:"
                    : language === "hi"
                    ? "रोजगार प्रकार:"
                    : "வேலைவாய்ப்பு வகை:"}{" "}
                  {extractedData.employmentType}
                </p>
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
            {language === "en"
              ? "Back"
              : language === "hi"
              ? "पीछे"
              : "பின்னால்"}
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentStep === currentLanguage.questions.length - 1
                ? !documentImage
                : !videoBlob
            }
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300 hover:bg-blue-700 transition"
          >
            {currentStep === currentLanguage.questions.length - 1
              ? language === "en"
                ? "Submit"
                : language === "hi"
                ? "जमा करें"
                : "சமர்ப்பி"
              : language === "en"
              ? "Next"
              : language === "hi"
              ? "अगला"
              : "அடுத்து"}
          </button>
        </div>
      </div>
    </div>
  );
}