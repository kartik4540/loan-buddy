// app/page.tsx
'use client';

import React from 'react';
import ReactPlayer from 'react-player';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-blue-600">AI Branch Manager</h1>
        <p className="text-gray-600">Your virtual loan assistant</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Language Selection */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Language:</span>
            <select className="border rounded px-2 py-1">
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Video Interface */}
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <ReactPlayer
              url="https://youtu.be/YpPMwMnIF7w" // Replace with your AI Branch Manager video URL
              width="100%"
              height="100%"
              playing={true}
              controls={false}
              playsinline
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 0,
                    controls: 0,
                    modestbranding: 1
                  }
                }
              }}
            />
          </div>
          <p className="text-lg mb-6">Hello! I'm your AI Branch Manager. What is your monthly income?</p>
        </div>

        {/* Calculator Navigation */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">Need help with calculations?</span>
          <Link href="/calculator">
            <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
              </svg>
              Loan Calculators
            </button>
          </Link>
        </div>

        {/* Book Loan Application Button */}
        <div className="flex justify-end">
          <Link href="/loan-application">
            <button className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Book Loan Application
            </button>
          </Link>
        </div>

        {/* Calculator Quick Access */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">Would you like to check your loan options first?</p>
          <div className="grid grid-cols-3 gap-4">
            <a href="/calculator?type=emi" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <h3 className="font-medium text-gray-800">EMI Calculator</h3>
                <p className="text-sm text-gray-600">Calculate monthly payments</p>
              </div>
            </a>
            <a href="/calculator?type=eligibility" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <h3 className="font-medium text-gray-800">Check Eligibility</h3>
                <p className="text-sm text-gray-600">Find your loan limit</p>
              </div>
            </a>
            <a href="/calculator?type=comparison" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                <h3 className="font-medium text-gray-800">Compare Loans</h3>
                <p className="text-sm text-gray-600">Compare loan options</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;