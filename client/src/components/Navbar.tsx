import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", path: "/features" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "FAQ", path: "/faq" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef(null);
  const lastScrolled = useRef(false);

  // Throttle scroll handler to animation frames — prevents layout thrashing
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const scrolled = window.scrollY > 50;
      // Only trigger re-render if state actually changed
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            RESUME IQ
          </span>
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" className="hidden sm:flex text-xs tracking-widest font-bold px-4 hover:bg-white/10 hover:text-white transition-[background-color,color] duration-200">
            <i className="fa-solid fa-right-to-bracket mr-2" />
            LOGIN
          </Button>
          <Button size="sm" className="hidden sm:flex text-xs tracking-widest font-bold px-6 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-[background-color,box-shadow] duration-200">
            <i className="fa-solid fa-user-plus mr-2" />
            SIGN UP
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
