import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinks = ["Features", "How It Works", "FAQ"];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          {navLinks.map((link) => {
            let targetPath = "/";
            if (link === "How It Works") targetPath = "/how-it-works";
            else if (link === "Features") targetPath = "/features";
            else if (link === "FAQ") targetPath = "/faq";
            
            return (
              <Link key={link} to={targetPath} className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                {link}
              </Link>
            )
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" className="hidden sm:flex text-xs tracking-widest font-bold px-4 hover:bg-white/10 hover:text-white transition-colors">
            LOGIN
          </Button>
          <Button size="sm" className="hidden sm:flex text-xs tracking-widest font-bold px-6 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all">
            SIGN UP
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
