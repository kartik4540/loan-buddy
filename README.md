# LoanBuddy

A modern loan application and calculator platform built with Next.js, featuring multi-language support and interactive user interfaces.

## Features

- 🌐 Multi-language support (English, Hindi, Tamil)
- 💰 EMI Calculator
- ✅ Loan Eligibility Check
- 📊 Loan Comparison Tool
- 🎥 Video-based Loan Application
- 🗣️ Voice Response Support
- ⌨️ Text-based Application Option

## Tech Stack

- Next.js 15.2.3
- TypeScript
- Tailwind CSS
- Web Speech API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kartik4540/loan-buddy.git
```

2. Install dependencies:
```bash
cd loan-buddy
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

- `/` - Welcome page
- `/calculator` - Loan calculators (EMI, Eligibility, Comparison)
- `/loan-application` - Interactive loan application process

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# AI Branch Manager – Video-Based Loan Assistance

A modern, AI-powered virtual branch manager that guides users through loan applications using video-based interactions. Built with Next.js, this app provides a seamless, branch-like experience for applying for loans digitally, complete with document submission, eligibility checks, and multi-language support.



https://github.com/user-attachments/assets/c0986cee-9ff6-4c41-9de9-8051609fe158



## Features

### Virtual AI Branch Manager
- Pre-recorded video assistant mimics a real bank manager.
- Structured financial questions guide users through the process.

### Video-Based Customer Interaction
- Users record video responses instead of filling out forms.
- Basic facial verification ensures continuity (simulated for demo).

### Simplified Document Submission & Processing
- Upload images of Aadhaar, PAN, or income proof.
- Extracts key details (name, DOB, income, employment type) for display.

### Loan Eligibility & Decisioning
- Rule-based system evaluates eligibility.
- Instant feedback: ✅ Approved, ❌ Rejected, or 🔄 More Info Needed.

### Multi-Language Support
- Pre-recorded videos and text available in English, Hindi, and Tamil.

## Tech Stack

- **Frontend:** Next.js (with React and TypeScript)
- **Styling:** Tailwind CSS
- **Video Handling:** react-player and react-webcam
- **Development:** Node.js (v18+)

## Prerequisites

- **Node.js:** Version 18 or higher
- **npm:** Comes with Node.js

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/your-username/ai-branch-manager.git
cd ai-branch-manager
```

### Install Dependencies

```bash
npm install
```

### Add Pre-recorded Videos (Optional for Demo)

- Place AI Manager videos (e.g., ai-manager-en.mp4) in the public/videos/ folder.
- Update languageData in app/loan-application/page.tsx with the correct paths:

```tsx
videoUrl: "/videos/ai-manager-en.mp4"
```

### Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Demo Usage

1. **Start:** Visit /loan-application to begin.
2. **Language:** Select English, Hindi, or Tamil from the dropdown.
3. **Video Responses:** Record short responses to each question using your webcam.
4. **Document Upload:** Upload a sample image (e.g., ID or income proof).
5. **Result:** Submit to see the eligibility outcome (demo defaults to "Approved").

*For a polished demo, pre-record a short AI Manager video and use a mock ID image.*
