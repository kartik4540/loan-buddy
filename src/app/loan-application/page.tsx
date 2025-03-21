// app/loan-application/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";
import Link from 'next/link';

// Remove redundant interface since it's already declared below
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any; 
    recognitionInstance: any;
  }
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    recognitionInstance: any;
  }
}

export default function LoanApplication() {
  const languageData = {
    en: {
      name: "English",
      questions: [
        {
          text: "Hello! I'm your AI Branch Manager. What is your monthly income?",
          options: ["Below ₹30,000", "₹30,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000"]
        },
        {
          text: "Great! How long have you been employed at your current job?",
          options: ["Less than 1 year", "1-3 years", "3-5 years", "More than 5 years"]
        },
        {
          text: "What type of loan are you applying for?",
          options: ["Personal Loan", "Home Loan", "Car Loan", "Education Loan"]
        },
        {
          text: "Do you have any existing loans? If yes, please specify the amount.",
          options: ["No existing loans", "Less than ₹5,00,000", "₹5,00,000 - ₹15,00,000", "Above ₹15,00,000"]
        },
        {
          text: "Perfect! Now, please upload your Aadhaar, PAN, or income proof.",
          options: []
        }
      ],
      videoUrl: "https://youtu.be/YpPMwMnIF7w",
    },
    hi: {
      name: "Hindi",
      questions: [
        {
          text: "नमस्ते! मैं आपका AI शाखा प्रबंधक हूँ। आपकी मासिक आय क्या है?",
          options: ["₹30,000 से कम", "₹30,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 से अधिक"]
        },
        {
          text: "बढ़िया! आप अपनी वर्तमान नौकरी में कितने समय से हैं?",
          options: ["1 वर्ष से कम", "1-3 वर्ष", "3-5 वर्ष", "5 वर्ष से अधिक"]
        },
        {
          text: "आप किस प्रकार का ऋण लेना चाहते हैं?",
          options: ["व्यक्तिगत ऋण", "गृह ऋण", "कार ऋण", "शिक्षा ऋण"]
        },
        {
          text: "क्या आपके पास कोई मौजूदा ऋण है? यदि हाँ, तो राशि बताएं।",
          options: ["कोई मौजूदा ऋण नहीं", "₹5,00,000 से कम", "₹5,00,000 - ₹15,00,000", "₹15,00,000 से अधिक"]
        },
        {
          text: "उत्तम! अब कृपया अपना आधार, पैन, या आय प्रमाण अपलोड करें।",
          options: []
        }
      ],
      videoUrl: "https://youtu.be/YpPMwMnIF7w",
    },
    ta: {
      name: "Tamil",
      questions: [
        {
          text: "வணக்கம்! நான் உங்கள் AI கிளை மேலாளர். உங்கள் மாத வருமானம் என்ன?",
          options: ["₹30,000க்கு கீழ்", "₹30,000 - ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000க்கு மேல்"]
        },
        {
          text: "சிறப்பு! நீங்கள் தற்போதைய வேலையில் எவ்வளவு காலம் இருக்கிறீர்கள்?",
          options: ["1 வருடத்திற்கு குறைவாக", "1-3 வருடங்கள்", "3-5 வருடங்கள்", "5 வருடங்களுக்கு மேல்"]
        },
        {
          text: "நீங்கள் எந்த வகையான கடனுக்கு விண்ணப்பிக்க விரும்புகிறீர்கள்?",
          options: ["தனிப்பட்ட கடன்", "வீட்டுக் கடன்", "கார் கடன்", "கல்விக் கடன்"]
        },
        {
          text: "உங்களிடம் ஏற்கனவே கடன்கள் உள்ளனவா? ஆம் எனில், தொகையை குறிப்பிடவும்。",
          options: ["கடன்கள் இல்லை", "₹5,00,000க்கு குறைவாக", "₹5,00,000 - ₹15,00,000", "₹15,00,000க்கு மேல்"]
        },
        {
          text: "சரியாக! இப்போது உங்கள் ஆதார், பான், அல்லது வருமான சான்றை பதிவேற்றவும்。",
          options: []
        }
      ],
      videoUrl: "https://youtu.be/YpPMwMnIF7w",
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
  const [inputMode, setInputMode] = useState<"video" | "text" | "voice">("text");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedIncome, setSelectedIncome] = useState('');
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentLanguage = languageData[language];
  const currentQuestion = currentLanguage.questions[currentStep];

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const income = event.results[last][0].transcript;
          setTranscript(income);
          
          // Process the voice input to determine income range
          const numericIncome = parseFloat(income.replace(/[^0-9]/g, ''));
          if (numericIncome <= 30000) {
            setSelectedIncome('Below ₹30,000');
          } else if (numericIncome <= 50000) {
            setSelectedIncome('₹30,000 - ₹50,000');
          } else if (numericIncome <= 100000) {
            setSelectedIncome('₹50,000 - ₹1,00,000');
          } else {
            setSelectedIncome('Above ₹1,00,000');
          }
        };

        // Store recognition instance in window object to prevent recreation
        window.recognitionInstance = recognition;
      }
    }
  }, []);

  const startListening = () => {
    setTranscript('');
    if (window.recognitionInstance) {
      window.recognitionInstance.start();
    }
  };

  const stopListening = () => {
    if (window.recognitionInstance) {
      window.recognitionInstance.stop();
    }
  };

  const handleNext = () => {
    if (currentStep < currentLanguage.questions.length - 1) {
      if (inputMode === "text" && selectedOption) {
        setResponses([...responses, selectedOption]);
      } else if (inputMode === "video" && videoBlob) {
        setResponses([...responses, "Video Response"]);
      } else if (inputMode === "voice" && selectedIncome) {
        setResponses([...responses, selectedIncome]);
      }
      setCurrentStep(currentStep + 1);
      setVideoBlob(null);
      setSelectedOption(null);
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
        IdType: "PAN CARD",
        Name: "Devish Mittal",
        dob: "22-02-2004", 
        pan: "HJVPM4886F",
        income: "50000",
        employmentType: "Student", 
      });
    }
  };

  const evaluateEligibility = () => {
    // Parse the responses
    const monthlyIncome = responses[0]?.match(/\d+/g)?.[0] || "0";
    const employmentDuration = responses[1]?.match(/(\d+)/)?.[0] || "0";
    const loanType = responses[2];
    const existingLoanAmount = responses[3]?.match(/\d+/g)?.[0] || "0";
    
    // Convert income ranges to actual values
    let incomeValue = 0;
    if (responses[0]?.includes("Below")) {
      incomeValue = 25000; // Average of 0-30000
    } else if (responses[0]?.includes("30,000 - 50,000")) {
      incomeValue = 40000;
    } else if (responses[0]?.includes("50,000 - 1,00,000")) {
      incomeValue = 75000;
    } else if (responses[0]?.includes("Above")) {
      incomeValue = 150000;
    }

    // Convert existing loan ranges to actual values
    let existingLoanValue = 0;
    if (responses[3]?.includes("No existing loans")) {
      existingLoanValue = 0;
    } else if (responses[3]?.includes("Less than 5,00,000")) {
      existingLoanValue = 250000;
    } else if (responses[3]?.includes("5,00,000 - 15,00,000")) {
      existingLoanValue = 1000000;
    } else if (responses[3]?.includes("Above 15,00,000")) {
      existingLoanValue = 2000000;
    }

    // Employment duration in years
    const employmentYears = responses[1]?.includes("Less than 1") ? 0 :
                          responses[1]?.includes("1-3") ? 2 :
                          responses[1]?.includes("3-5") ? 4 :
                          responses[1]?.includes("More than 5") ? 6 : 0;

    // Calculate monthly obligations (assuming 1% of existing loan as EMI)
    const monthlyObligations = existingLoanValue * 0.01;

    // Calculate debt-to-income ratio (DTI)
    const dti = (monthlyObligations / incomeValue) * 100;

    // Define loan type specific criteria
    const loanCriteria = {
      "Personal Loan": {
        minIncome: 30000,
        minEmployment: 1,
        maxDTI: 50
      },
      "Home Loan": {
        minIncome: 50000,
        minEmployment: 2,
        maxDTI: 60
      },
      "Car Loan": {
        minIncome: 40000,
        minEmployment: 1,
        maxDTI: 50
      },
      "Education Loan": {
        minIncome: 25000,
        minEmployment: 0,
        maxDTI: 70
      }
    };

    const selectedLoanCriteria = loanCriteria[loanType as keyof typeof loanCriteria];

    // Evaluate eligibility based on multiple factors
    if (!extractedData) {
      setResult(
        language === "en"
          ? "🔄 More Info Needed: Please upload valid documents."
          : language === "hi"
          ? "🔄 अधिक जानकारी चाहिए: कृपया वैध दस्तावेज अपलोड करें।"
          : "🔄 மேலும் தகவல் தேவை: சரியான ஆவணங்களை பதிவேற்றவும்."
      );
    } else if (incomeValue < selectedLoanCriteria.minIncome) {
      setResult(
        language === "en"
          ? `❌ Rejected: Income below minimum requirement (₹${selectedLoanCriteria.minIncome.toLocaleString()}) for ${loanType}.`
          : language === "hi"
          ? `❌ अस्वीकृत: ${loanType} के लिए आय न्यूनतम आवश्यकता (₹${selectedLoanCriteria.minIncome.toLocaleString()}) से कम है।`
          : `❌ நிராகரிக்கப்பட்டது: ${loanType}க்கான வருமானம் குறைந்தபட்ச தேவையை விட குறைவு (₹${selectedLoanCriteria.minIncome.toLocaleString()}).`
      );
    } else if (employmentYears < selectedLoanCriteria.minEmployment) {
      setResult(
        language === "en"
          ? `❌ Rejected: Employment duration too short (minimum ${selectedLoanCriteria.minEmployment} year(s) for ${loanType}).`
          : language === "hi"
          ? `❌ अस्वीकृत: रोजगार अवधि बहुत कम है (${loanType} के लिए न्यूनतम ${selectedLoanCriteria.minEmployment} वर्ष)।`
          : `❌ நிராகரிக்கப்பட்டது: வேலைவாய்ப்பு காலம் மிகக் குறைவு (${loanType}க்கு குறைந்தபட்சம் ${selectedLoanCriteria.minEmployment} ஆண்டு).`
      );
    } else if (dti > selectedLoanCriteria.maxDTI) {
      setResult(
        language === "en"
          ? `❌ Rejected: Debt-to-income ratio (${dti.toFixed(1)}%) exceeds maximum limit (${selectedLoanCriteria.maxDTI}%) for ${loanType}.`
          : language === "hi"
          ? `❌ अस्वीकृत: कर्ज-से-आय अनुपात (${dti.toFixed(1)}%) ${loanType} के लिए अधिकतम सीमा (${selectedLoanCriteria.maxDTI}%) से अधिक है।`
          : `❌ நிராகரிக்கப்பட்டது: கடன்-வருமான விகிதம் (${dti.toFixed(1)}%) ${loanType}க்கான அதிகபட்ச வரம்பை (${selectedLoanCriteria.maxDTI}%) மீறுகிறது.`
      );
    } else {
      // Calculate maximum eligible loan amount
      const maxEMIAffordable = (incomeValue * 0.5) - monthlyObligations;
      const ratePerMonth = 0.12 / 12; // 12% annual interest
      const tenureMonths = 180; // 15 years
      
      const maxLoanAmount = (maxEMIAffordable * (1 - Math.pow(1 + ratePerMonth, -tenureMonths))) / ratePerMonth;
      
      setResult(
        language === "en"
          ? `✅ Approved: Congratulations, you're eligible for a ${loanType}!\n\nMaximum Loan Amount: ₹${Math.floor(maxLoanAmount).toLocaleString()}\nMonthly Income: ₹${incomeValue.toLocaleString()}\nDebt-to-Income Ratio: ${dti.toFixed(1)}%`
          : language === "hi"
          ? `✅ स्वीकृत: बधाई हो, आप ${loanType} के लिए पात्र हैं!\n\nअधिकतम ऋण राशि: ₹${Math.floor(maxLoanAmount).toLocaleString()}\nमासिक आय: ₹${incomeValue.toLocaleString()}\nकर्ज-से-आय अनुपात: ${dti.toFixed(1)}%`
          : `✅ அங்கீகரிக்கப்பட்டது: வாழ்த்துக்கள், நீங்கள் ${loanType}க்கு தகுதியானவர்!\n\nஅதிகபட்ச கடன் தொகை: ₹${Math.floor(maxLoanAmount).toLocaleString()}\nமாத வருமானம்: ₹${incomeValue.toLocaleString()}\nகடன்-வருமான விகிதம்: ${dti.toFixed(1)}%`
      );
    }
  };

  // Function to read the question
  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      setIsReadingQuestion(true);
      const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
      
      // Set language for speech based on selected language
      switch(language) {
        case 'hi':
          utterance.lang = 'hi-IN';
          break;
        case 'ta':
          utterance.lang = 'ta-IN';
          break;
        default:
          utterance.lang = 'en-IN';
      }

      utterance.onend = () => setIsReadingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center transform transition-all duration-300 scale-100 hover:scale-102 border border-gray-100">
          <div className="mb-6">
            {result.includes("✅") ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : result.includes("❌") ? (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-6">
            {language === "en"
              ? "Loan Application Result"
              : language === "hi"
              ? "ऋण आवेदन परिणाम"
              : "கடன் விண்ணப்ப முடிவு"}
          </h1>
          <div className="text-lg text-gray-700 mb-8 whitespace-pre-line">{result}</div>
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setResponses([]);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
          >
            {language === "en"
              ? "Start New Application"
              : language === "hi"
              ? "नया आवेदन शुरू करें"
              : "புதிய விண்ணப்பத்தைத் தொடங்கு"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">LoanBuddy</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/calculator"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {language === "en" 
                  ? "Go to Calculator" 
                  : language === "hi" 
                  ? "कैलकुलेटर पर जाएं" 
                  : "கணிப்பானுக்குச் செல்க"}
              </Link>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "ta")}
                className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Application Progress</span>
            <span className="text-sm font-medium text-blue-600">{Math.round((currentStep + 1) / currentLanguage.questions.length * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / currentLanguage.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Video Section */}
          <div className="aspect-w-16 aspect-h-9">
            <ReactPlayer
              url={currentLanguage.videoUrl}
              width="100%"
              height="100%"
              controls={true}
              playing={true}
              config={{
                youtube: {
                  playerVars: { showinfo: 1, controls: 1, modestbranding: 1 }
                }
              }}
            />
          </div>

          {/* Question Section with Listen Button */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.text}</h2>
              <button
                onClick={readQuestion}
                disabled={isReadingQuestion}
                className={`ml-4 p-2 rounded-full ${
                  isReadingQuestion 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-all duration-200`}
                title={
                  language === "en"
                    ? "Listen to question"
                    : language === "hi"
                    ? "प्रश्न सुनें"
                    : "கேள்வியைக் கேளுங்கள்"
                }
              >
                {isReadingQuestion ? (
                  <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>

            {currentStep < currentLanguage.questions.length - 1 && (
              <>
                {/* Calculator Quick Access Section */}
                <div className="mb-8 bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    {language === "en"
                      ? "Calculator Quick Access"
                      : language === "hi"
                      ? "कैलकुलेटर त्वरित पहुंच"
                      : "கணிப்பான் விரைவு அணுகல்"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/calculator?type=emi" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <h4 className="font-medium text-gray-900">
                          {language === "en"
                            ? "EMI Calculator"
                            : language === "hi"
                            ? "ईएमआई कैलकुलेटर"
                            : "EMI கணிப்பான்"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Calculate your monthly EMI based on loan amount and tenure"
                          : language === "hi"
                          ? "ऋण राशि और अवधि के आधार पर अपनी मासिक ईएमआई की गणना करें"
                          : "கடன் தொகை மற்றும் காலத்தின் அடிப்படையில் உங்கள் மாதாந்திர EMI ஐ கணக்கிடுங்கள்"}
                      </p>
                    </Link>

                    <Link href="/calculator?type=eligibility" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="font-medium text-gray-900">
                          {language === "en"
                            ? "Check Eligibility"
                            : language === "hi"
                            ? "पात्रता जांचें"
                            : "தகுதியை சரிபார்க்கவும்"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Find out your loan eligibility and maximum amount"
                          : language === "hi"
                          ? "अपनी ऋण पात्रता और अधिकतम राशि जानें"
                          : "உங்கள் கடன் தகுதி மற்றும் அதிகபட்ச தொகையை கண்டறியவும்"}
                      </p>
                    </Link>

                    <Link href="/calculator?type=compare" className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h4 className="font-medium text-gray-900">
                          {language === "en"
                            ? "Compare Loans"
                            : language === "hi"
                            ? "ऋण तुलना करें"
                            : "கடன்களை ஒப்பிடுங்கள்"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Compare different loan options and their benefits"
                          : language === "hi"
                          ? "विभिन्न ऋण विकल्पों और उनके लाभों की तुलना करें"
                          : "வெவ்வேறு கடன் விருப்பங்களையும் அவற்றின் நன்மைகளையும் ஒப்பிடுங்கள்"}
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-8">
                  <button
                    onClick={() => setInputMode("text")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      inputMode === "text"
                        ? "bg-blue-600 text-white shadow-lg transform hover:scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {language === "en" ? "Text Input" : language === "hi" ? "टेक्स्ट इनपुट" : "உரை உள்ளீடு"}
                    </div>
                  </button>
                  <button
                    onClick={() => setInputMode("video")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      inputMode === "video"
                        ? "bg-blue-600 text-white shadow-lg transform hover:scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      {language === "en" ? "Video Response" : language === "hi" ? "वीडियो प्रतिक्रिया" : "வீடியோ பதில்"}
                    </div>
                  </button>
                  <button
                    onClick={() => setInputMode("voice")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      inputMode === "voice"
                        ? "bg-blue-600 text-white shadow-lg transform hover:scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                      {language === "en" ? "Voice Response" : language === "hi" ? "वोंस प्रतिक्रिया" : "மொழி பதில்"}
                    </div>
                  </button>
                </div>
              </>
            )}

            {currentStep < currentLanguage.questions.length - 1 ? (
              <>
                {inputMode === "text" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        className={`p-6 rounded-xl text-left transition-all duration-200 ${
                          selectedOption === option
                            ? "bg-blue-50 border-2 border-blue-500 shadow-md transform scale-105"
                            : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedOption === option ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}>
                            {selectedOption === option && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                            )}
                          </div>
                          <span className={`text-lg ${selectedOption === option ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                            {option}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : inputMode === "video" ? (
                  <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                      <Webcam
                        audio={true}
                        ref={webcamRef}
                        width="100%"
                        videoConstraints={{ width: 1280, height: 720 }}
                      />
                    </div>

                    {!videoBlob ? (
                      <div className="flex space-x-4">
                        <button
                          onClick={startRecording}
                          disabled={isRecording}
                          className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                        >
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
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
                          </div>
                        </button>
                        <button
                          onClick={stopRecording}
                          disabled={!isRecording}
                          className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                        >
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                            </svg>
                            {language === "en"
                              ? "Stop Recording"
                              : language === "hi"
                              ? "रिकॉर्डिंग रोकें"
                              : "பதிவை நிறுத்து"}
                          </div>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <video
                          src={URL.createObjectURL(videoBlob)}
                          controls
                          className="w-full rounded-xl shadow-lg border-2 border-gray-100"
                        />
                        <button
                          onClick={() => setVideoBlob(null)}
                          className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
                        >
                          <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            {language === "en"
                              ? "Re-record"
                              : language === "hi"
                              ? "फिर से रिकॉर्ड करें"
                              : "மீண்டும் பதிவு செய்"}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="mb-6">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className={`absolute inset-0 rounded-full ${
                          isListening ? 'animate-pulse bg-blue-200' : 'bg-gray-200'
                        }`}></div>
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg className={`w-12 h-12 ${isListening ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {isListening ? 'Listening...' : 'Click the microphone to start speaking'}
                      </p>
                      {transcript && (
                        <p className="text-sm text-gray-500">You said: {transcript}</p>
                      )}
                      {selectedIncome && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <p className="text-blue-700">Selected Income Range: {selectedIncome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDocumentUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      {language === "en"
                        ? "Click to upload or drag and drop"
                        : language === "hi"
                        ? "अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें"
                        : "பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {language === "en"
                        ? "Supported formats: JPG, PNG, PDF"
                        : language === "hi"
                        ? "समर्थित प्रारूप: JPG, PNG, PDF"
                        : "ஆதரிக்கப்படும் வடிவங்கள்: JPG, PNG, PDF"}
                    </p>
                  </label>
                </div>

                {documentImage && (
                  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <img
                      src={URL.createObjectURL(documentImage)}
                      alt="Uploaded Document"
                      className="w-full max-h-80 object-contain"
                    />
                  </div>
                )}

                {extractedData && (
                  <div className="bg-gray-50 rounded-xl p-6 shadow-inner border border-gray-100">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">
                      {language === "en"
                        ? "Extracted Information"
                        : language === "hi"
                        ? "निकाली गई जानकारी"
                        : "பிரித்தெடுக்கப்பட்ட தகவல்"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(extractedData).map(([key, value]) => (
                        <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">{key}</p>
                          <p className="text-lg font-medium text-gray-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
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
                    : inputMode === "video"
                    ? !videoBlob
                    : !selectedOption
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <span className="mr-2">
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
                </span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}