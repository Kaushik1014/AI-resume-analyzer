# AI Resume Analyzer

A full-stack web application that analyzes resumes using AI (Google Gemini) to provide scoring, feedback, and improvement suggestions.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, PDF.js, jsPDF
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer, JWT Auth
- **AI:** Google Gemini API

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance
- Google Gemini API key

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Development Servers

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

## Project Structure

```
resume-analyzer/
├── client/          # React frontend (Vite)
├── server/          # Express backend API
├── .gitignore
└── README.md
```
