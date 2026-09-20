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
  const savedScrollYRef = useRef(null);
  const savedProjectIdRef = useRef(null);
  const initialProjectIdRef = useRef(null);
  const savedCardDeltaRef = useRef(null);
  const isRestoringScrollRef = useRef(false);

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

  const restoreExactProjectPosition = () => {
    isRestoringScrollRef.current = true;

    let targetProjectId = savedProjectIdRef.current;
    if (!targetProjectId) {
      try {
        targetProjectId = sessionStorage.getItem("portfolio_return_project_id");
      } catch {}
    }

    let initialProjectId = initialProjectIdRef.current;
    if (!initialProjectId) {
      try {
        initialProjectId = sessionStorage.getItem("portfolio_return_initial_id");
      } catch {}
    }

    let rawScrollY = savedScrollYRef.current;
    if (rawScrollY == null) {
      try {
        const stored = sessionStorage.getItem("portfolio_return_scroll_y");
        if (stored) rawScrollY = parseFloat(stored);
      } catch {}
    }

    let cardDelta = savedCardDeltaRef.current;
    if (cardDelta == null) {
      try {
        const stored = sessionStorage.getItem("portfolio_return_card_delta");
        if (stored) cardDelta = parseFloat(stored);
      } catch {}
    }

    let attempts = 0;
    const maxAttempts = 16;

    const executeScroll = () => {
      attempts++;
      let targetY = null;

      const cardEl = targetProjectId ? document.getElementById(`project-card-${targetProjectId}`) : null;

      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const currentCardTop = cardRect.top + window.scrollY;

        if (targetProjectId === initialProjectId && typeof cardDelta === "number") {
          // Exactly the position relative to the card where the user clicked
          targetY = Math.max(0, currentCardTop + cardDelta);
        } else {
          // If user navigated to a different project, align to that project's card
          const navOffset = 80;
          targetY = Math.max(0, currentCardTop - navOffset);
        }
      } else if (typeof rawScrollY === "number" && !isNaN(rawScrollY) && rawScrollY > 0) {
        targetY = rawScrollY;
      }

      if (targetY !== null) {
        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, { immediate: true, force: true });
        }
        window.scrollTo({ top: targetY, behavior: "instant" });
      }

      if (attempts < maxAttempts) {
        requestAnimationFrame(() => {
          setTimeout(executeScroll, attempts < 6 ? 25 : 60);
        });
      } else {
        setTimeout(() => {
          isRestoringScrollRef.current = false;
        }, 200);
      }
    };

    executeScroll();
  };

  // Sync hash changes (e.g. browser Back / Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const pId = getProjectIdFromHash();
      const prevWasInProject = wasInProjectRef.current;
      setActiveProjectId(pId);

      if (prevWasInProject && !pId) {
        restoreExactProjectPosition();
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // When returning from a project detail page to portfolio, restore exact scroll position
  useEffect(() => {
    const wasInProject = wasInProjectRef.current;
    wasInProjectRef.current = Boolean(activeProjectId);

    if (wasInProject && !activeProjectId) {
      restoreExactProjectPosition();
    }
  }, [activeProjectId]);

  // When navigating to portfolio sections from non-detail paths
  useEffect(() => {
    if (!activeProjectId) {
      if (isRestoringScrollRef.current) return;
      const hash = window.location.hash;
      if (hash && !hash.includes("project")) {
        const targetId = hash.replace(/^#\/?/, "");
        if (targetId && targetId !== "projects") {
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
  }, [activeProjectId]);

  const handleOpenProject = (projectId, originInfo = null) => {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    savedScrollYRef.current = currentScrollY;
    initialProjectIdRef.current = projectId;
    savedProjectIdRef.current = projectId;

    const cardEl = document.getElementById(`project-card-${projectId}`);
    if (cardEl) {
      const cardRect = cardEl.getBoundingClientRect();
      const absoluteCardTop = cardRect.top + currentScrollY;
      savedCardDeltaRef.current = currentScrollY - absoluteCardTop;
    } else {
      savedCardDeltaRef.current = 0;
    }

    try {
      sessionStorage.setItem("portfolio_return_scroll_y", String(currentScrollY));
      sessionStorage.setItem("portfolio_return_project_id", projectId);
      sessionStorage.setItem("portfolio_return_initial_id", projectId);
      sessionStorage.setItem("portfolio_return_card_delta", String(savedCardDeltaRef.current));
    } catch {}

    if (window.__lenis) {
      window.__lenis.stop();
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.location.hash = `#/project/${projectId}`;
    setActiveProjectId(projectId);
    window.scrollTo({ top: 0, behavior: "instant" });

    setTimeout(() => {
      window.__lenis?.start();
    }, 50);
  };

  const handleSelectProjectFromDetail = (nextProjectId) => {
    savedProjectIdRef.current = nextProjectId;
    try {
      sessionStorage.setItem("portfolio_return_project_id", nextProjectId);
    } catch {}

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.location.hash = `#/project/${nextProjectId}`;
    setActiveProjectId(nextProjectId);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToPortfolio = () => {
    window.location.hash = "#projects";
    setActiveProjectId(null);
    restoreExactProjectPosition();
  };

  const handleNavigateFromDetail = (href) => {
    if (window.__lenis) {
      window.__lenis.stop();
      setTimeout(() => {
        window.__lenis?.start();
      }, 50);
    }
    if (href === "#projects") {
      window.location.hash = "#projects";
      setActiveProjectId(null);
      restoreExactProjectPosition();
    } else {
      window.location.hash = href;
      setActiveProjectId(null);
    }
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
          onSelectProject={handleSelectProjectFromDetail}
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

