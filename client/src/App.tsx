// Root application component: sets up routing with landing page as default
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Faq from "@/pages/Faq";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
