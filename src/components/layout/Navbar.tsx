import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "PROJECTS", to: "/projects" },
  { label: "CERTIFICATES", to: "/certificate" },
  { label: "ABOUT", to: "/about" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "nav-glass border-b-2 border-theme"
            : "bg-transparent border-b-2 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20 md:h-24">
          {/* Brutalist Brand */}
          <Link to="/" className="flex flex-col justify-center group">
            <span className="font-striper text-xl md:text-3xl font-black tracking-tighter text-theme group-hover:text-accent transition-colors leading-none">
              SOBAHUSN
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-black uppercase tracking-widest transition-colors duration-300 group ${
                  isActive(link.to)
                    ? "text-accent"
                    : "text-muted hover:text-theme"
                }`}
              >
                {link.label}
                {/* Brutalist Underline Hover */}
                <div
                  className={`absolute -bottom-2 left-0 h-1 bg-accent transition-all duration-300 ${
                    isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="group flex items-center gap-3 text-xs font-bold font-mono uppercase tracking-widest text-muted hover:text-theme transition-colors"
            >
              <span className="hidden md:inline-block">
                {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
              </span>
              <div className="w-10 h-10 border-2 border-theme rounded-none flex items-center justify-center group-hover:bg-theme group-hover:text-bg transition-all">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  </motion.span>
                </AnimatePresence>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 border-2 border-theme flex items-center justify-center text-theme hover:bg-theme hover:text-bg transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mobileOpen ? "x" : "menu"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Brutalist Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            }}
            animate={{
              opacity: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
            exit={{
              opacity: 0,
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-bg flex flex-col pt-32 px-6 pb-12 lg:hidden bg-accent"
          >
            <nav className="flex flex-col gap-6 flex-1 ">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                >
                  <Link
                    to={link.to}
                    className={`text-5xl sm:text-7xl font-black uppercase tracking-tighter block border-b-2 border-theme pb-4 ${
                      isActive(link.to)
                        ? "text-accent dark:text-white hover:text-accent"
                        : "text-theme/20 hover:text-accent dark:text-white/50 hover:dark:text-accent"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs font-mono font-bold uppercase tracking-widest text-muted flex justify-between items-end"
            >
              <div className="dark:text-white ">
                STATUS: ONLINE <br />
                LOC: SIDOARJO, ID
              </div>
              <div className="text-right text-black dark:text-white">
                © {new Date().getFullYear()} <br />
                SOBAHUSN
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
