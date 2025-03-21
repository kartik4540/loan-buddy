'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CalculatorPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeCalculator, setActiveCalculator] = useState(searchParams.get('type') || 'emi');
  const [language, setLanguage] = useState<"en" | "hi" | "ta">("en");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [emiResult, setEmiResult] = useState<{
    emi: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  // Loan Eligibility Calculator State
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [existingEMI, setExistingEMI] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [eligibilityDetails, setEligibilityDetails] = useState<{
    netIncome: number;
    maxEMI: number;
    interestRate: number;
    loanTenure: number;
  } | null>(null);

  // Add voice state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const translations = {
    en: {
      title: "Loan Calculators",
      emiCalculator: "EMI Calculator",
      eligibilityCalculator: "Eligibility Calculator",
      compareLoan: "Compare Loans",
      loanAmount: "Loan Amount (₹)",
      interestRate: "Interest Rate (% per annum)",
      loanTerm: "Loan Term (Years)",
      calculate: "Calculate",
      monthlyEMI: "Monthly EMI",
      totalPayment: "Total Payment",
      totalInterest: "Total Interest",
      monthlyIncome: "Monthly Income (₹)",
      monthlyExpenses: "Monthly Expenses (₹)",
      existingEMI: "Existing EMI (₹)",
      checkEligibility: "Check Eligibility",
      enterValidAmount: "Please enter a valid amount",
      enterValidRate: "Please enter a valid interest rate",
      enterValidTerm: "Please enter a valid loan term",
      calculationResults: "Calculation Results",
      clear: "Clear",
    },
    hi: {
      title: "ऋण कैलकुलेटर",
      emiCalculator: "ईएमआई कैलकुलेटर",
      eligibilityCalculator: "पात्रता कैलकुलेटर",
      compareLoan: "ऋण तुलना करें",
      loanAmount: "ऋण राशि (₹)",
      interestRate: "ब्याज दर (% प्रति वर्ष)",
      loanTerm: "ऋण अवधि (वर्ष)",
      calculate: "गणना करें",
      monthlyEMI: "मासिक ईएमआई",
      totalPayment: "कुल भुगतान",
      totalInterest: "कुल ब्याज",
      monthlyIncome: "मासिक आय (₹)",
      monthlyExpenses: "मासिक खर्च (₹)",
      existingEMI: "मौजूदा ईएमआई (₹)",
      checkEligibility: "पात्रता जांचें",
      enterValidAmount: "कृपया वैध राशि दर्ज करें",
      enterValidRate: "कृपया वैध ब्याज दर दर्ज करें",
      enterValidTerm: "कृपया वैध ऋण अवधि दर्ज करें",
      calculationResults: "गणना परिणाम",
      clear: "साफ़ करें",
    },
    ta: {
      title: "கடன் கால்குலேட்டர்கள்",
      emiCalculator: "EMI கால்குலேட்டர்",
      eligibilityCalculator: "தகுதி கால்குலேட்டர்",
      compareLoan: "கடன்களை ஒப்பிடுக",
      loanAmount: "கடன் தொகை (₹)",
      interestRate: "வட்டி விகிதம் (% ஆண்டுக்கு)",
      loanTerm: "கடன் காலம் (ஆண்டுகள்)",
      calculate: "கணக்கிடு",
      monthlyEMI: "மாதாந்திர EMI",
      totalPayment: "மொத்த செலுத்தல்",
      totalInterest: "மொத்த வட்டி",
      monthlyIncome: "மாத வருமானம் (₹)",
      monthlyExpenses: "மாத செலவுகள் (₹)",
      existingEMI: "தற்போதைய EMI (₹)",
      checkEligibility: "தகுதியை சரிபார்க்கவும்",
      enterValidAmount: "சரியான தொகையை உள்ளிடவும்",
      enterValidRate: "சரியான வட்டி விகிதத்தை உள்ளிடவும்",
      enterValidTerm: "சரியான கடன் காலத்தை உள்ளிடவும்",
      calculationResults: "கணக்கீட்டு முடிவுகள்",
      clear: "அழி",
    }
  };

  // Set active calculator based on URL parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['emi', 'eligibility', 'comparison'].includes(type)) {
      setActiveCalculator(type);
    }
  }, [searchParams]);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;

    // Validation
    if (principal <= 0) {
      alert(translations[language].enterValidAmount);
      return;
    }
    if (annualRate <= 0) {
      alert(translations[language].enterValidRate);
      return;
    }
    if (years <= 0) {
      alert(translations[language].enterValidTerm);
      return;
    }

    const ratePerMonth = annualRate / (12 * 100);
    const months = years * 12;

    const emi =
      (principal *
        ratePerMonth *
        Math.pow(1 + ratePerMonth, months)) /
      (Math.pow(1 + ratePerMonth, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    setEmiResult({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    });
  };

  const calculateEligibility = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const currentEMI = parseFloat(existingEMI) || 0;

    // Validation
    if (income <= 0) {
      alert(translations[language].enterValidAmount);
      return;
    }
    if (expenses < 0 || currentEMI < 0) {
      alert('Expenses and EMI cannot be negative');
      return;
    }
    if (expenses + currentEMI >= income) {
      alert('Your expenses and EMIs cannot exceed your income');
      return;
    }

    // Calculate disposable income (40% of net income after expenses and existing EMIs)
    // Using 40% instead of 50% for more conservative estimate
    const netIncome = income - expenses - currentEMI;
    const maxEMIAllowed = netIncome * 0.4; // Changed from 0.5 to 0.4 for safer estimate

    // Using 12% annual interest rate (1% monthly) instead of 10% for more realistic scenario
    // and 15 years tenure instead of 20 years
    const annualInterestRate = 12;
    const loanTenureYears = 15;
    const ratePerMonth = annualInterestRate / (12 * 100);
    const months = loanTenureYears * 12;

    // Calculate maximum loan amount based on EMI capacity
    const maxLoanAmount =
      (maxEMIAllowed * (Math.pow(1 + ratePerMonth, months) - 1)) /
      (ratePerMonth * Math.pow(1 + ratePerMonth, months));

    setEligibilityResult(`₹${Math.floor(maxLoanAmount).toLocaleString()}`);
    setEligibilityDetails({
      netIncome: Math.round(netIncome),
      maxEMI: Math.round(maxEMIAllowed),
      interestRate: annualInterestRate,
      loanTenure: loanTenureYears
    });
  };

  // Function to speak text
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language for speech
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

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to handle language change with voice
  const handleLanguageChange = (newLanguage: "en" | "hi" | "ta") => {
    setLanguage(newLanguage);
    setIsLanguageOpen(false);
    
    // Speak the language name
    const languageNames = {
      en: "Language changed to English",
      hi: "भाषा हिंदी में बदल गई है",
      ta: "மொழி தமிழுக்கு மாற்றப்பட்டது"
    };
    speak(languageNames[newLanguage]);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Language Selector */}
      <div className="flex justify-end mb-4">
        <div className="relative inline-block text-left">
          <span className="mr-2 text-gray-700">Language:</span>
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex justify-between items-center w-32 px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-l-md"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              {language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'தமிழ்'}
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => {
                const currentText = language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'தமிழ்';
                speak(currentText);
              }}
              disabled={isSpeaking}
              className={`p-2 border border-l-0 border-gray-300 bg-white hover:bg-gray-50 rounded-r-md ${
                isSpeaking ? 'text-blue-600' : 'text-gray-600'
              }`}
              title="Listen to selected language"
            >
              {isSpeaking ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>

          {isLanguageOpen && (
            <div 
              className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="language-menu"
            >
              <div className="py-1" role="none">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  हिंदी
                </button>
                <button
                  onClick={() => handleLanguageChange('ta')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  தமிழ்
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">{translations[language].title}</h1>
      
      {/* Calculator Navigation */}
      <div className="flex justify-center mb-12 gap-4">
        <button
          onClick={() => {
            setActiveCalculator('emi');
            setEmiResult(null);
          }}
          className={`px-8 py-4 rounded-lg text-lg font-medium transition ${
            activeCalculator === 'emi'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          EMI Calculator
        </button>
        <button
          onClick={() => {
            setActiveCalculator('eligibility');
            setEligibilityResult(null);
          }}
          className={`px-8 py-4 rounded-lg text-lg font-medium transition ${
            activeCalculator === 'eligibility'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Loan Eligibility
        </button>
        <button
          onClick={() => setActiveCalculator('comparison')}
          className={`px-8 py-4 rounded-lg text-lg font-medium transition ${
            activeCalculator === 'comparison'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Compare Loans
        </button>
      </div>

      {/* EMI Calculator */}
      {activeCalculator === 'emi' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center">EMI Calculator</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="loanAmount" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].loanAmount}
              </label>
              <input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].interestRate}
              </label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter annual interest rate"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="loanTerm" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].loanTerm}
              </label>
              <input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="Enter loan term in years"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={calculateEMI}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {translations[language].calculate}
            </button>

            {emiResult && (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly EMI</h3>
                  <p className="text-4xl font-bold text-blue-600">₹ {emiResult.emi.toLocaleString()}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700">{translations[language].totalPayment}</h4>
                      <p className="text-xl font-bold text-blue-600">₹ {emiResult.totalPayment.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-700">{translations[language].totalInterest}</h4>
                      <p className="text-xl font-bold text-blue-600">₹ {emiResult.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 italic">
                    This calculation assumes a fixed interest rate throughout the loan term.
                  </p>
                </div>
              </div>
            )}

            {/* Book Loan Application Button - Always visible */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/loan-application">
                <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                  Book Loan Application
                </button>
              </Link>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Ready to proceed? Click above to start your loan application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loan Eligibility Calculator */}
      {activeCalculator === 'eligibility' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center">Loan Eligibility Calculator</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="monthlyIncome" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].monthlyIncome}
              </label>
              <input
                id="monthlyIncome"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Enter your monthly income"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="monthlyExpenses" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].monthlyExpenses}
              </label>
              <input
                id="monthlyExpenses"
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                placeholder="Enter your monthly expenses"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="existingEMI" className="block text-lg font-medium text-gray-700 mb-2">
                {translations[language].existingEMI}
              </label>
              <input
                id="existingEMI"
                type="number"
                value={existingEMI}
                onChange={(e) => setExistingEMI(e.target.value)}
                placeholder="Enter existing EMI payments"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={calculateEligibility}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {translations[language].checkEligibility}
            </button>

            {eligibilityResult !== null && eligibilityDetails !== null && (
              <div className="mt-8 space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">Maximum Loan Amount</h3>
                  <p className="text-4xl font-bold text-blue-600">{eligibilityResult}</p>
                  <div className="mt-4 text-left space-y-2 text-sm text-gray-600">
                    <p>• Net Monthly Income: ₹ {eligibilityDetails.netIncome.toLocaleString()}</p>
                    <p>• Maximum Monthly EMI Capacity: ₹ {eligibilityDetails.maxEMI.toLocaleString()}</p>
                    <p>• Interest Rate: {eligibilityDetails.interestRate}% per annum</p>
                    <p>• Loan Tenure: {eligibilityDetails.loanTenure} years</p>
                    <p className="mt-4 text-center italic">
                      This is an estimate based on standard lending criteria. Actual loan eligibility may vary based on additional factors and lender policies.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Book Loan Application Button - Always visible */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/loan-application">
                <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                  Book Loan Application
                </button>
              </Link>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Ready to proceed? Click above to start your loan application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loan Comparison Calculator */}
      {activeCalculator === 'comparison' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center">Loan Comparison Calculator</h2>
          <p className="text-center text-lg text-gray-600 mb-8">
            Coming soon! Compare different loan offers to find the best one for you.
          </p>
          
          {/* Book Loan Application Button - Always visible */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/loan-application">
              <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                Book Loan Application
              </button>
            </Link>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Ready to proceed? Click above to start your loan application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
