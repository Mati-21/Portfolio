import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiGithub, FiLinkedin, FiMenu, FiFacebook, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { scrollToContactRevealed, scrollToSection } from "../utils/scrollHelper";

const socials = [
  { icon: FiGithub, href: "https://github.com/Mati-21" },
  { icon: FiFacebook, href: "https://web.facebook.com/matimelkamu21/" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/mati-melkamu-0b5508375/" },
];

function Header({ isProjectDetail: isProjectDetailProp, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hashIsProject, setHashIsProject] = useState(() => {
    return typeof window !== "undefined" && window.location.hash.includes("project");
  });
  const { theme, toggleTheme, isDark } = useTheme();
  const toggleButton = () => setIsOpen((prev) => !prev);

  const isProjectDetail = isProjectDetailProp !== undefined ? isProjectDetailProp : hashIsProject;
  const isHeaderSolid = scrolled || isProjectDetail;

  const navItems = [
    { label: "Home",     href: "#home",     id: "home" },
    { label: "About Me", href: "#about",    id: "about" },
    { label: "Skills",   href: "#skills",   id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Contact",  href: "#contact",  id: "contact" },
  ];

  useEffect(() => {
    const handleHash = () => {
      setHashIsProject(window.location.hash.includes("project"));
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // When on a project detail page, lock active section to 'projects' so the pill never jumps/runs
  useEffect(() => {
    if (isProjectDetail) {
      setActiveSection("projects");
    }
  }, [isProjectDetail]);

  useEffect(() => {
    const sectionIds = ["home", "about", "skills", "projects", "contact"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // When viewing a project detail, section detection for portfolio sections is skipped
      if (isProjectDetail) {
        setActiveSection("projects");
        return;
      }

      // Check if user is near bottom of page -> contact is active
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 140) {
        setActiveSection("contact");
        return;
      }

      // Check each section from top to bottom
      const midPoint = window.innerHeight * 0.38;
      let current = "home";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= midPoint && rect.bottom > midPoint) {
            current = id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(handleScroll, 300);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [isProjectDetail]);

  const handleNavClick = (e, href, id) => {
    e.preventDefault();
    if (isOpen) setIsOpen(false);

    if (isProjectDetail) {
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.location.hash = href;
      }
      return;
    }

    setActiveSection(id);
    if (href === "#contact") {
      scrollToContactRevealed();
    } else {
      scrollToSection(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHeaderSolid
          ? "bg-white/90 dark:bg-[#0b0c10]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-black/40 py-1"
          : "bg-white/30 dark:bg-black/30 backdrop-blur-xl border-b border-white/20 dark:border-white/10 py-1.5"
      }`}
    >
      {/* Container */}
      <div className="container mx-auto h-12 md:h-14 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* Logo + Name */}
        <motion.a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home", "home")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center group cursor-pointer"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm sm:text-base mr-2.5 shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform duration-300">
            M
          </div>
          <span
            className={`text-lg sm:text-xl font-heading font-bold tracking-tight bg-clip-text text-transparent transition-all duration-300 ${
              !isHeaderSolid
                ? "bg-gradient-to-r from-white via-gray-100 to-violet-300"
                : "bg-gradient-to-r from-slate-950 via-slate-800 to-violet-700 dark:from-white dark:via-gray-200 dark:to-violet-300"
            }`}
          >
            Mati
          </span>
        </motion.a>

        {/* Desktop Navigation (white links over hero, contrast when scrolled) */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <motion.a
                key={index}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.06 }}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-white font-semibold shadow-sm"
                    : !isHeaderSolid
                    ? "text-white hover:text-white/80 hover:bg-white/15 drop-shadow-sm"
                    : "text-slate-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={isProjectDetail ? undefined : "activeNavPill"}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-600/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        {/* Social Icons + Theme Toggle + Hire Me */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-2.5">
          <div className="flex items-center space-x-1 mr-1">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  !isHeaderSolid
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-slate-700 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                }`}
                aria-label="Social Link"
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              !isHeaderSolid
                ? "bg-white/15 hover:bg-white/25 text-amber-300 border border-white/20 shadow-sm"
                : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-amber-300 border border-slate-200/80 dark:border-white/10 shadow-sm"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <FiSun className="w-4 h-4 text-amber-300" />
            ) : (
              <FiMoon className={`w-4 h-4 ${!isHeaderSolid ? "text-violet-300" : "text-violet-600"}`} />
            )}
          </motion.button>

          <motion.a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact", "contact")}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Hire Me
          </motion.a>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              !isHeaderSolid
                ? "text-amber-300 bg-white/15 border border-white/20 shadow-sm"
                : "text-slate-800 dark:text-amber-300 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="w-4.5 h-4.5" /> : <FiMoon className="w-4.5 h-4.5 text-violet-600" />}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={toggleButton}
            className={`p-2 rounded-lg transition-colors ${
              !isHeaderSolid
                ? "text-white hover:text-white bg-white/15 border border-white/20 shadow-sm"
                : "text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-[#0e0f17]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-2xl px-6 py-6 space-y-5"
          >
            <nav className="flex flex-col space-y-1.5">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-base transition-all duration-200 ${
                      isActive
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 shadow-sm"
                        : "text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-sm" />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex space-x-4">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-700 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact", "contact")}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm text-center shadow-md shadow-violet-600/30 cursor-pointer"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

