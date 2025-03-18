// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to AI Branch Manager
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Your virtual assistant for seamless loan applications.
      </p>
      <Link href="loan-application">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Start Loan Application
        </button>
      </Link>
    </div>
  );
}