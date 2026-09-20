const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Helper to ensure session exists
async function ensureSession(sessionId, sessionInfo = {}) {
  if (!sessionId) return null;
  return await prisma.visitorSession.upsert({
    where: { sessionId },
    update: {
      updatedAt: new Date(),
      ...(sessionInfo.device ? { device: sessionInfo.device } : {}),
      ...(sessionInfo.browser ? { browser: sessionInfo.browser } : {}),
      ...(sessionInfo.os ? { os: sessionInfo.os } : {}),
      ...(sessionInfo.referrer ? { referrer: sessionInfo.referrer } : {}),
    },
    create: {
      sessionId,
      device: sessionInfo.device || "Desktop",
      browser: sessionInfo.browser || "Unknown",
      os: sessionInfo.os || "Unknown",
      referrer: sessionInfo.referrer || null,
    },
  });
}

// ─────────────────────────────────────────────────
// POST /api/analytics/track  (Public)
// Ingests single or batch analytics events
// Body format:
// {
//   sessionId: string,
//   sessionInfo?: { device, browser, os, referrer },
//   events?: [ { type, section, element, label, url, duration, metadata } ],
//   // OR single event fields:
//   type?: string,
//   section?: string,
//   element?: string,
//   label?: string,
//   url?: string,
//   duration?: number
// }
// ─────────────────────────────────────────────────
router.post("/track", async (req, res) => {
  try {
    let data = req.body;

    // In case request was sent as raw text (e.g. some sendBeacon fallbacks)
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return res.status(400).json({ error: "Invalid JSON format" });
      }
    }

    const { sessionId, sessionInfo } = data;
    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    // Ensure session record exists
    await ensureSession(sessionId, sessionInfo);

    // Normalize events list
    let eventsToInsert = [];
    if (Array.isArray(data.events) && data.events.length > 0) {
      eventsToInsert = data.events;
    } else if (data.type) {
      eventsToInsert = [
        {
          type: data.type,
          section: data.section,
          element: data.element,
          label: data.label,
          url: data.url,
          duration: data.duration,
          metadata: data.metadata,
        },
      ];
    }

    if (eventsToInsert.length > 0) {
      const records = eventsToInsert.map((ev) => ({
        sessionId,
        type: ev.type || "click",
        section: ev.section ? String(ev.section).slice(0, 100) : null,
        element: ev.element ? String(ev.element).slice(0, 150) : null,
        label: ev.label ? String(ev.label).slice(0, 255) : null,
        url: ev.url ? String(ev.url).slice(0, 500) : null,
        duration: typeof ev.duration === "number" && !isNaN(ev.duration) ? Math.max(0, Math.round(ev.duration)) : null,
        metadata: ev.metadata ? (typeof ev.metadata === "string" ? ev.metadata : JSON.stringify(ev.metadata)) : null,
      }));

      await prisma.analyticsEvent.createMany({
        data: records,
      });
    }

    return res.status(200).json({ success: true, count: eventsToInsert.length });
  } catch (err) {
    console.error("Analytics track error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// GET /api/analytics/overview  (Protected)
// Returns aggregate statistics, section dwell time heatmaps,
// click rankings, device breakdown, and individual visitor journeys
// ─────────────────────────────────────────────────
router.get("/overview", requireAuth, async (req, res) => {
  try {
    // 1. Basic counts
    const totalVisitors = await prisma.visitorSession.count();
    const totalEvents = await prisma.analyticsEvent.count();

    // 2. Dwell time stats
    const dwellEvents = await prisma.analyticsEvent.findMany({
      where: {
        type: "section_dwell",
        duration: { not: null, gt: 0 },
      },
      select: {
        section: true,
        duration: true,
        sessionId: true,
      },
    });

    let totalDwellSeconds = 0;
    const sectionDwellMap = {};

    dwellEvents.forEach((ev) => {
      const sec = ev.section || "unknown";
      const dur = ev.duration || 0;
      totalDwellSeconds += dur;

      if (!sectionDwellMap[sec]) {
        sectionDwellMap[sec] = { totalDuration: 0, count: 0 };
      }
      sectionDwellMap[sec].totalDuration += dur;
      sectionDwellMap[sec].count += 1;
    });

    const sectionDwellStats = Object.keys(sectionDwellMap).map((sec) => ({
      section: sec,
      totalSeconds: sectionDwellMap[sec].totalDuration,
      visits: sectionDwellMap[sec].count,
      avgSeconds: Math.round(sectionDwellMap[sec].totalDuration / (sectionDwellMap[sec].count || 1)),
    })).sort((a, b) => b.totalSeconds - a.totalSeconds);

    const avgDwellPerVisitor = totalVisitors > 0 ? Math.round(totalDwellSeconds / totalVisitors) : 0;

    // 3. Project titles & project engagement stats
    const projectContent = await prisma.content.findMany({
      where: { section: "projects" },
    });

    const projectTitleMap = {
      "amu-kpi": "AMU KPI Monitoring & Evaluation System",
      "ripple-chat": "Ripple Chat",
      "npq-game": "NPQ Game (Number Puzzle Quest)",
      "wholesale-erp": "Wholesale Distribution ERP",
    };

    projectContent.forEach((c) => {
      if (c.key === "proj1_title" && c.value) projectTitleMap["amu-kpi"] = c.value;
      if (c.key === "proj2_title" && c.value) projectTitleMap["ripple-chat"] = c.value;
      if (c.key === "proj3_title" && c.value) projectTitleMap["npq-game"] = c.value;
      if (c.key === "proj4_title" && c.value) projectTitleMap["wholesale-erp"] = c.value;
    });

    // 4. Project-specific read and dwell analysis
    const allEvents = await prisma.analyticsEvent.findMany({
      select: {
        sessionId: true,
        type: true,
        section: true,
        element: true,
        label: true,
        duration: true,
        createdAt: true,
      },
    });

    const projectMap = {};
    Object.keys(projectTitleMap).forEach((pId) => {
      projectMap[pId] = {
        id: pId,
        title: projectTitleMap[pId],
        totalSeconds: 0,
        uniqueReaders: new Set(),
        clicksCount: 0,
      };
    });

    allEvents.forEach((ev) => {
      if (ev.section && ev.section.startsWith("detail:")) {
        const pId = ev.section.replace(/^detail:/i, "");
        if (!projectMap[pId]) {
          projectMap[pId] = {
            id: pId,
            title: ev.label || projectTitleMap[pId] || pId,
            totalSeconds: 0,
            uniqueReaders: new Set(),
            clicksCount: 0,
          };
        }
        if (ev.label && (!projectMap[pId].title || projectMap[pId].title === pId)) {
          projectMap[pId].title = ev.label;
        }
        if (ev.type === "section_dwell" && ev.duration) {
          projectMap[pId].totalSeconds += ev.duration;
          projectMap[pId].uniqueReaders.add(ev.sessionId);
        }
        if (ev.type === "click") {
          projectMap[pId].clicksCount += 1;
        }
      }
    });

    const totalProjectReadSeconds = Object.values(projectMap).reduce(
      (acc, p) => acc + p.totalSeconds,
      0
    );

    const projectReadStats = Object.values(projectMap)
      .map((p) => ({
        id: p.id,
        title: p.title,
        totalSeconds: p.totalSeconds,
        readersCount: p.uniqueReaders.size,
        avgSeconds:
          p.uniqueReaders.size > 0
            ? Math.round(p.totalSeconds / p.uniqueReaders.size)
            : 0,
        clicksCount: p.clicksCount,
        sharePercent:
          totalProjectReadSeconds > 0
            ? Math.round((p.totalSeconds / totalProjectReadSeconds) * 100)
            : 0,
      }))
      .sort((a, b) => b.totalSeconds - a.totalSeconds);

    // 5. Top Clicked Elements / CTAs
    const clickEvents = await prisma.analyticsEvent.findMany({
      where: { type: "click" },
      select: { element: true, label: true, section: true, url: true },
    });

    const clickMap = {};
    clickEvents.forEach((c) => {
      const key = `${c.element || "Unknown"}||${c.label || ""}||${c.section || ""}`;
      if (!clickMap[key]) {
        clickMap[key] = {
          element: c.element || "Unknown",
          label: c.label || "",
          section: c.section || "",
          url: c.url || "",
          count: 0,
        };
      }
      clickMap[key].count += 1;
    });

    const topClicks = Object.values(clickMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 6. Device & Browser Breakdown
    const sessions = await prisma.visitorSession.findMany({
      select: {
        device: true,
        browser: true,
        os: true,
      },
    });

    const deviceCount = { Desktop: 0, Mobile: 0, Tablet: 0, Other: 0 };
    const browserCount = {};

    sessions.forEach((s) => {
      const dev = s.device || "Desktop";
      if (deviceCount[dev] !== undefined) {
        deviceCount[dev] += 1;
      } else {
        deviceCount.Other += 1;
      }

      const br = s.browser || "Other";
      browserCount[br] = (browserCount[br] || 0) + 1;
    });

    // 7. Recent Visitor Journeys (last 50 sessions with their events chronologically)
    const recentSessions = await prisma.visitorSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        events: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const visitorJourneys = recentSessions.map((s) => {
      const visitorProjectMap = {};
      s.events.forEach((e) => {
        if (e.section && e.section.startsWith("detail:")) {
          const pId = e.section.replace(/^detail:/i, "");
          const title = e.label || projectTitleMap[pId] || pId;
          if (!visitorProjectMap[pId]) {
            visitorProjectMap[pId] = { id: pId, title, seconds: 0, clicks: 0 };
          }
          if (e.type === "section_dwell" && e.duration) {
            visitorProjectMap[pId].seconds += e.duration;
          }
          if (e.type === "click") {
            visitorProjectMap[pId].clicks += 1;
          }
        }
      });

      const projectsRead = Object.values(visitorProjectMap).sort(
        (a, b) => b.seconds - a.seconds
      );

      const sessionDwell = s.events
        .filter((e) => e.type === "section_dwell" && e.duration)
        .reduce((sum, e) => sum + (e.duration || 0), 0);

      const sessionClicks = s.events.filter((e) => e.type === "click").length;

      return {
        id: s.id,
        sessionId: s.sessionId,
        device: s.device,
        browser: s.browser,
        os: s.os,
        referrer: s.referrer,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        totalDwellSeconds: sessionDwell,
        clickCount: sessionClicks,
        totalEvents: s.events.length,
        projectsRead,
        events: s.events.map((e) => ({
          id: e.id,
          type: e.type,
          section: e.section,
          element: e.element,
          label: e.label,
          url: e.url,
          duration: e.duration,
          createdAt: e.createdAt,
        })),
      };
    });

    return res.json({
      summary: {
        totalVisitors,
        totalEvents,
        totalClicks: clickEvents.length,
        totalDwellSeconds,
        avgDwellPerVisitor,
        totalProjectReadSeconds,
      },
      projectReadStats,
      sectionDwellStats,
      topClicks,
      deviceBreakdown: deviceCount,
      browserBreakdown: browserCount,
      visitorJourneys,
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// DELETE /api/analytics/clear  (Protected)
// Reset analytics data
// ─────────────────────────────────────────────────
router.delete("/clear", requireAuth, async (req, res) => {
  try {
    await prisma.analyticsEvent.deleteMany({});
    await prisma.visitorSession.deleteMany({});
    return res.json({ message: "All analytics data cleared successfully." });
  } catch (err) {
    console.error("Analytics clear error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// DELETE /api/analytics/sessions/:sessionId  (Protected)
// Delete a specific visitor session
// ─────────────────────────────────────────────────
router.delete("/sessions/:sessionId", requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    await prisma.visitorSession.delete({
      where: { sessionId },
    });
    return res.json({ message: `Session ${sessionId} deleted.` });
  } catch (err) {
    console.error("Delete session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
