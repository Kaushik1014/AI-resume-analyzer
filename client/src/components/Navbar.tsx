import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogIn, UserPlus, LogOut } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const { firebaseUser, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rafRef = useRef(null);
  const lastScrolled = useRef(false);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const scrolled = window.scrollY > 50;
      if (scrolled !== lastScrolled.current) {
        lastScrolled.current = scrolled;
        setIsScrolled(scrolled);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayName = dbUser?.displayName || firebaseUser?.displayName || "";
  const photoURL = dbUser?.photoURL || firebaseUser?.photoURL || "";
  const initials = displayName
    ? displayName.charAt(0).toUpperCase()
    : firebaseUser?.email?.charAt(0).toUpperCase() || "?";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled
          ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        boxShadow: isScrolled
          ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "none",
        padding: isScrolled ? "12px 0" : "20px 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
          RESUME IQ
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="relative px-4 py-2 text-sm text-white/60 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {firebaseUser ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {initials}
                  </div>
                )}
                <span className="text-sm text-white/70">{displayName || "Dashboard"}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-white/70 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu — also glassmorphism */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div
          className="px-6 py-4 flex flex-col gap-3"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-white/60 hover:text-white transition-colors text-left py-2 px-3 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
            {firebaseUser ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-white py-2 px-3 font-bold">
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-red-400 py-2 px-3 text-left font-bold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-white py-2 px-3 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-white py-2 px-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
