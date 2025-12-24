import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLoginClick: (role: "CITIZEN" | "DEPARTMENT" | "ADMIN") => void;
  onRegisterClick: () => void;
}

export const Navbar = ({ onLoginClick, onRegisterClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Contact", href: "#contact" },
  ];

  // Open login modal directly for selected role
  const handleRoleLoginClick = (role: "CITIZEN" | "DEPARTMENT" | "ADMIN") => {
    onLoginClick(role); // Pass role to AuthModal
    setIsLoginOpen(false); // Close dropdown
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-teal-500 flex items-center justify-center">
                <span className="text-lg font-bold text-secondary-foreground">C</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary to-teal-500 blur-lg opacity-50" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Civic<span className="text-secondary">Pulse</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}

            {/* Role-based Login Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                whileHover={{ y: -2 }}
              >
                <User className="h-4 w-4" />
                Login
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isLoginOpen ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {isLoginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl p-2"
                  >
                    {/* Only login options, no role selection inside modal */}
                    {["CITIZEN", "DEPARTMENT", "ADMIN"].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleLoginClick(role as "CITIZEN" | "DEPARTMENT" | "ADMIN")}
                        className="flex w-full items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <LogIn className="h-4 w-4 text-secondary" />
                        {role.charAt(0) + role.slice(1).toLowerCase()} Login
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={onRegisterClick}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl p-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="pt-3 border-t border-border/50 space-y-2">
                  {["CITIZEN", "DEPARTMENT", "ADMIN"].map((role) => (
                    <Button
                      key={role}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleRoleLoginClick(role as "CITIZEN" | "DEPARTMENT" | "ADMIN");
                      }}
                    >
                      {role.charAt(0) + role.slice(1).toLowerCase()} Login
                    </Button>
                  ))}
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onRegisterClick();
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
