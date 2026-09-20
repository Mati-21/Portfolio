import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ContentProvider } from "./context/ContentContext";
import About from "./components/About";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import ProjectSection from "./components/ProjectSection";
import Reveal from "./components/Reveal";
import ProjectDetailPage from "./components/ProjectDetailPage";
import analytics from "./utils/analytics";
import { projects } from "./data/projectsData";

function getProjectIdFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  const match = hash.match(/#\/?project\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function PortfolioContent() {
  const lenis = useLenis();
  const [activeProjectId, setActiveProjectId] = useState(getProjectIdFromHash());

  const wasInProjectRef = useRef(Boolean(activeProjectId));

  // Initialize analytics tracker
  useEffect(() => {
    analytics.init();
  }, []);

  // Update analytics section when on project detail page or switching back
  useEffect(() => {
    if (activeProjectId) {
      const p = projects.find((item) => item.id === activeProjectId);
      const title = p ? p.title : `Project ${activeProjectId}`;
      analytics.setCurrentSection(`detail:${activeProjectId}`, title);
    } else {
      analytics.setCurrentSection("home", "Hero / Home");
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (lenis) {
      window.__lenis = lenis;
    }
  }, [lenis]);

  const scrollToProjects = (smooth = true) => {
    const doScroll = () => {
      const el = document.getElementById("projects");
      if (!el) return false;
      const navOffset = 70;
      const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
      if (window.__lenis) {
        window.__lenis.start();
        window.__lenis.scrollTo(targetY, { immediate: !smooth });
      } else {
        window.scrollTo({
          top: targetY,
          behavior: smooth ? "smooth" : "instant",
        });
      }
      return true;
    };

    if (!doScroll()) {
      requestAnimationFrame(() => {
        if (!doScroll()) {
          setTimeout(doScroll, 40);
          setTimeout(doScroll, 120);
          setTimeout(doScroll, 250);
        }
      });
    } else {
      setTimeout(doScroll, 80);
      setTimeout(doScroll, 220);
    }
  };

  // Sync hash changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const pId = getProjectIdFromHash();
      const prevWasInProject = wasInProjectRef.current;
      setActiveProjectId(pId);

      if (prevWasInProject && !pId) {
        const hash = window.location.hash;
        if (!hash || hash === "#" || hash === "#home" || hash === "#projects") {
          window.location.hash = "#projects";
          scrollToProjects(true);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // When returning from a project detail page to portfolio, ensure visitor is scrolled to the Projects section
  useEffect(() => {
    const wasInProject = wasInProjectRef.current;
    wasInProjectRef.current = Boolean(activeProjectId);

    if (wasInProject && !activeProjectId) {
      const hash = window.location.hash;
      if (!hash || hash === "#" || hash === "#home" || hash === "#projects") {
        window.location.hash = "#projects";
        scrollToProjects(true);
      }
    }
  }, [activeProjectId]);

  // When returning to portfolio with any section hash (e.g. #about, #skills, #projects, #contact, #home)
  useEffect(() => {
    if (!activeProjectId) {
      const hash = window.location.hash;
      if (hash && !hash.includes("project")) {
        const targetId = hash.replace(/^#\/?/, "");
        if (targetId) {
          if (targetId === "projects") {
            scrollToProjects(true);
          } else {
            const timer = setTimeout(() => {
              if (targetId === "home") {
                if (window.__lenis) {
                  window.__lenis.scrollTo(0, { immediate: false });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              } else {
                const el = document.getElementById(targetId);
                if (el) {
                  if (window.__lenis) {
                    window.__lenis.scrollTo(el, { offset: -70 });
                  } else {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }
            }, 100);
            return () => clearTimeout(timer);
          }
        }
      }
    }
  }, [activeProjectId]);

  const handleOpenProject = (projectId) => {
    // Halt any running Lenis momentum immediately
    if (window.__lenis) {
      window.__lenis.stop();
      window.__lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        window.__lenis?.start();
      }, 50);
    }
    window.location.hash = `#/project/${projectId}`;
    setActiveProjectId(projectId);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToPortfolio = () => {
    window.location.hash = "#projects";
    setActiveProjectId(null);
    scrollToProjects(true);
  };

  const handleNavigateFromDetail = (href) => {
    if (window.__lenis) {
      window.__lenis.stop();
      setTimeout(() => {
        window.__lenis?.start();
      }, 50);
    }
    window.location.hash = href;
    setActiveProjectId(null);
  };

  return (
    <div className="relative bg-slate-50 dark:bg-[#0b0c10] text-slate-900 dark:text-gray-100 min-h-screen selection:bg-violet-500/30 selection:text-violet-600 dark:selection:text-violet-200 transition-colors duration-300">
      <Header
        isProjectDetail={Boolean(activeProjectId)}
        onNavigate={handleNavigateFromDetail}
      />
      {activeProjectId ? (
        <ProjectDetailPage
          projectId={activeProjectId}
          onBack={handleBackToPortfolio}
          onSelectProject={handleOpenProject}
        />
      ) : (
        <>
          <HeroSection />
          <About />
          <Skills />
          <ProjectSection onOpenProject={handleOpenProject} />
          <Reveal />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
          <PortfolioContent />
        </ReactLenis>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;

