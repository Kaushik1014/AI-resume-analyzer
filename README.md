# Resume IQ — AI-Powered Resume Analyzer

> **Live Demo:** [https://ai-resume-analyzer-coral-psi.vercel.app](#)

Resume IQ is a smart, full-stack resume analysis platform powered by advanced AI. It helps users evaluate their resumes against ATS (Applicant Tracking Systems), identify missing keywords, improve tone, and receive role specific suggestions — all through an interactive and modern dashboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| **ATS Score** | Overall Applicant Tracking System compatibility score (0–100) with circular gauge |
| **Section Analysis** | Individual scores for Summary, Skills, Experience, and Education |
| **Keyword Gap Analysis** | Paste a job description to find missing keywords from your resume |
| **Tone & Language Check** | Detects passive voice, weak verbs, and quantification gaps |
| **Formatting Tips** | Evaluates resume length, bullet structure, and date formatting |
| **Role-Specific Suggestions** | AI detects your target role and provides tailored industry advice |
| **Downloadable PDF Report** | Export a professionally formatted analysis report |
| **Chat History** | All past analyses saved and accessible via the history panel |
| **Google & Email Auth** | Secure authentication via Firebase |
| **3D Interactive UI** | Spline 3D backgrounds with glassmorphism design |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** for styling
- **Spline** for 3D backgrounds
- **Firebase Auth** (Google + Email/Password)
- **html2canvas + jsPDF** for PDF generation
- **React Router** for navigation
- **React Markdown** for rich text rendering

### Backend
- **Node.js** + **Express**
- **Google Gemini AI** (gemini-2.5-flash)
- **MongoDB Atlas** via Mongoose
- **Firebase Admin SDK** for token verification
- **Multer** for file uploads
- **pdf-parse** for PDF text extraction

---

## 📁 Project Structure

```
resume-analyzer/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components (ATSGraph, SectionScores, etc.)
│   │   ├── context/         # AuthContext
│   │   ├── lib/             # Firebase config
│   │   ├── pages/           # Dashboard, AuthPage, Index
│   │   └── services/        # API service (Axios)
│   └── .env                 # Frontend environment variables
│
├── server/                  # Express backend
│   ├── middleware/           # Auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes (analyze, auth)
│   ├── services/            # Gemini AI service
│   └── .env                 # Backend environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project (Auth enabled)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
cd resume-analyzer
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

Start the server:
```bash
node server.js
```

### 3. Setup the frontend
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the dev server:
```bash
npm run dev
```

---

## 📊 How It Works

1. **Upload** your resume
2. Optionally **paste a job description** for keyword gap analysis
3. AI analyzes the resume and returns a structured JSON report
4. The dashboard renders interactive visualizations:
   - Circular ATS gauge
   - Section score progress bars
   - Missing keyword tags
   - Tone analysis cards
   - Formatting feedback
   - Role-specific suggestions
5. **Download** a beautifully formatted PDF report

---

## 🌐 Deployment

- **Frontend:** Vercel / Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)
- [Spline](https://spline.design/)
- [Tailwind CSS](https://tailwindcss.com/)

---

👨‍💻 Author

Kaushik Gautam

Built with ❤️ for learning and practice

