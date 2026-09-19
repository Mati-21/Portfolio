/**
 * Portfolio Client Analytics Tracker
 * Tracks individual visitor sessions, section dwell time (seconds), and clickstream interactions.
 */

const SESSION_STORAGE_KEY = "portfolio_visitor_session_id";
const TRACK_ENDPOINT = "/api/analytics/track";

function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "sess_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function getSessionId() {
  if (typeof window === "undefined") return null;
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = generateUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

function getDeviceInfo() {
  if (typeof navigator === "undefined") return {};
  const ua = navigator.userAgent || "";

  // Device
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    device = "Mobile";
  }

  // Browser
  let browser = "Chrome";
  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "IE";
  else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
  else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) browser = "Safari";

  // OS
  let os = "Unknown";
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1 && ua.indexOf("iPhone") === -1 && ua.indexOf("iPad") === -1) os = "macOS";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS";

  return {
    device,
    browser,
    os,
    referrer: document.referrer ? document.referrer.slice(0, 200) : "Direct",
  };
}

class AnalyticsTracker {
  constructor() {
    this.sessionId = null;
    this.sessionInfo = null;
    this.currentSection = null;
    this.currentSectionLabel = null;
    this.sectionStartTime = null;
    this.queue = [];
    this.flushTimer = null;
    this.initialized = false;
    this.observer = null;
  }

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.sessionId = getSessionId();
    this.sessionInfo = getDeviceInfo();
    this.initialized = true;

    // Send initial session ping
    this.sendPayload({
      sessionId: this.sessionId,
      sessionInfo: this.sessionInfo,
      type: "session_init",
    });

    this.setupIntersectionObserver();
    this.setupClickListener();
    this.setupLifecycleListeners();
  }

  setCurrentSection(sectionName, sectionLabel = null) {
    if (this.currentSection === sectionName) return;

    // End previous section and record dwell time
    if (this.currentSection && this.sectionStartTime) {
      const elapsedSeconds = Math.round((Date.now() - this.sectionStartTime) / 1000);
      if (elapsedSeconds >= 1) {
        this.trackDwellTime(this.currentSection, elapsedSeconds, this.currentSectionLabel);
      }
    }

    this.currentSection = sectionName;
    this.currentSectionLabel = sectionLabel;
    this.sectionStartTime = Date.now();
  }

  trackDwellTime(section, durationSeconds, label = this.currentSectionLabel) {
    if (!durationSeconds || durationSeconds < 1) return;
    this.queueEvent({
      type: "section_dwell",
      section,
      label: label || null,
      duration: durationSeconds,
    });
  }

  trackClick(eventData) {
    this.queueEvent({
      type: "click",
      section: eventData.section || this.currentSection || "general",
      element: eventData.element || "Unknown",
      label: eventData.label || "",
      url: eventData.url || null,
    }, true); // immediate flush for clicks
  }

  queueEvent(event, immediate = false) {
    this.queue.push(event);

    if (immediate) {
      this.flushQueue();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        this.flushQueue();
      }, 5000); // batch dwell events every 5s
    }
  }

  flushQueue(isUnload = false) {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    const payload = {
      sessionId: this.sessionId,
      sessionInfo: this.sessionInfo,
      events: eventsToSend,
    };

    this.sendPayload(payload, isUnload);
  }

  sendPayload(payload, isUnload = false) {
    const bodyStr = JSON.stringify(payload);

    if (isUnload && typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const blob = new Blob([bodyStr], { type: "application/json" });
        navigator.sendBeacon(TRACK_ENDPOINT, blob);
        return;
      } catch (e) {
        // Fall back to fetch with keepalive
      }
    }

    try {
      fetch(TRACK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyStr,
        keepalive: true,
      }).catch(() => {
        // Silently tolerate if dev server is momentarily offline
      });
    } catch (e) {
      // ignore
    }
  }

  setupIntersectionObserver() {
    // Monitor visible sections in the portfolio
    const sectionIds = ["home", "about", "skills", "projects", "contact"];

    const callback = (entries) => {
      // Find the entry with the highest intersection ratio
      let bestEntry = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }
      });

      if (bestEntry && bestEntry.target && bestEntry.target.id) {
        this.setCurrentSection(bestEntry.target.id);
      }
    };

    this.observer = new IntersectionObserver(callback, {
      threshold: [0.2, 0.5, 0.8],
    });

    const observeElements = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) this.observer.observe(el);
      });
    };

    observeElements();
    // Re-check after DOM hydration
    setTimeout(observeElements, 500);
    setTimeout(observeElements, 1500);
  }

  setupClickListener() {
    document.addEventListener("click", (e) => {
      try {
        // Find nearest interactive element
        const target = e.target.closest("a, button, [role='button'], input[type='submit']");
        if (!target) return;

        // Skip clicking generic scroll indicators if unnamed
        let text = (target.innerText || target.textContent || target.title || target.getAttribute("aria-label") || "").trim();
        text = text.replace(/\s+/g, " ").slice(0, 80);

        let elementDesc = target.tagName.toLowerCase();
        if (target.id) elementDesc += `#${target.id}`;
        if (target.className && typeof target.className === "string") {
          const firstClass = target.className.split(" ")[0];
          if (firstClass) elementDesc += `.${firstClass}`;
        }

        const href = target.getAttribute("href") || null;
        const sectionEl = target.closest("section") || target.closest("[id]");
        const sectionId = sectionEl ? sectionEl.id : this.currentSection || "general";

        // Give friendly names to common items
        let friendlyElement = text || elementDesc;
        if (href && (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:"))) {
          friendlyElement = `Outbound Link: ${text || href}`;
        } else if (target.closest("[data-project-card]")) {
          friendlyElement = `Project Card Click: ${text}`;
        }

        this.trackClick({
          element: friendlyElement.slice(0, 150),
          label: text || null,
          url: href ? href.slice(0, 300) : null,
          section: sectionId,
        });
      } catch (err) {
        // Safe fail
      }
    }, { capture: true, passive: true });
  }

  setupLifecycleListeners() {
    const handlePageExit = () => {
      // Flush currently active section dwell
      if (this.currentSection && this.sectionStartTime) {
        const elapsedSeconds = Math.round((Date.now() - this.sectionStartTime) / 1000);
        if (elapsedSeconds >= 1) {
          this.trackDwellTime(this.currentSection, elapsedSeconds, this.currentSectionLabel);
          this.sectionStartTime = Date.now(); // reset
        }
      }
      this.flushQueue(true);
    };

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handlePageExit();
      } else {
        this.sectionStartTime = Date.now();
      }
    });

    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("pagehide", handlePageExit);
  }
}

export const analytics = new AnalyticsTracker();
export default analytics;
