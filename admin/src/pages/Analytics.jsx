import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsApi } from "../api/client";
import {
  Activity,
  Users,
  Clock,
  MousePointerClick,
  Flame,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles,
  AlertTriangle,
  Compass,
  FolderGit2,
  Eye,
  X,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Format seconds into "1m 45s" or "32s"
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

// Format date into readable time "15:42:05" or "Sep 19, 15:42"
function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Friendly section labels and colors
const SECTION_CONFIG = {
  home: { label: "Hero / Home", color: "from-blue-500 to-cyan-500", badge: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20" },
  about: { label: "About Me", color: "from-teal-500 to-emerald-500", badge: "bg-teal-500/10 text-teal-500 dark:text-teal-400 border-teal-500/20" },
  skills: { label: "Tech Stack & Skills", color: "from-amber-500 to-orange-500", badge: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
  projects: { label: "Projects Showcase", color: "from-violet-500 to-purple-500", badge: "bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20" },
  contact: { label: "Contact & Footer", color: "from-rose-500 to-pink-500", badge: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20" },
};

function getSectionDisplay(sectionName) {
  if (!sectionName) return { label: "General", badge: "bg-slate-500/10 text-slate-500 border-slate-500/20", color: "from-slate-500 to-gray-500" };
  const lower = sectionName.toLowerCase();
  if (lower.startsWith("detail:")) {
    const pId = sectionName.replace(/^detail:/i, "");
    return {
      label: `Project: ${pId}`,
      badge: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20",
      color: "from-indigo-500 to-violet-600",
    };
  }
  return SECTION_CONFIG[lower] || {
    label: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
    badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    color: "from-slate-500 to-gray-500",
  };
}

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchOverview = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await analyticsApi.getOverview();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics overview:", err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 400);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Polling interval
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchOverview();
    }, 10000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const handleCopy = (e, text, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await analyticsApi.clearAll();
      setShowClearModal(false);
      fetchOverview();
    } catch (err) {
      console.error("Clear error:", err);
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await analyticsApi.deleteSession(sessionId);
      fetchOverview();
    } catch (err) {
      console.error("Delete session error:", err);
    }
  };

  // Filtered visitor journeys
  const filteredJourneys = useMemo(() => {
    if (!data?.visitorJourneys) return [];
    return data.visitorJourneys.filter((j) => {
      const matchesDevice = deviceFilter === "all" || (j.device || "").toLowerCase() === deviceFilter.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        j.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.browser || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.os || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.referrer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.projectsRead?.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDevice && matchesSearch;
    });
  }, [data?.visitorJourneys, deviceFilter, searchQuery]);

  // Find most read project
  const topProject = useMemo(() => {
    if (!data?.projectReadStats || data.projectReadStats.length === 0) return null;
    const sorted = [...data.projectReadStats].sort((a, b) => b.totalSeconds - a.totalSeconds);
    return sorted[0].totalSeconds > 0 ? sorted[0] : null;
  }, [data?.projectReadStats]);

  // Max dwell seconds for section bar calculations
  const maxSectionDwell = useMemo(() => {
    if (!data?.sectionDwellStats || data.sectionDwellStats.length === 0) return 1;
    return Math.max(...data.sectionDwellStats.map((s) => s.totalSeconds), 1);
  }, [data?.sectionDwellStats]);

  // Max project read seconds for progress bar
  const maxProjectDwell = useMemo(() => {
    if (!data?.projectReadStats || data.projectReadStats.length === 0) return 1;
    return Math.max(...data.projectReadStats.map((p) => p.totalSeconds), 1);
  }, [data?.projectReadStats]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30 flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Visitor Attention & Project Reading Analytics
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Tracking Active
              </span>
            </div>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
              Track which projects visitors read the longest, inspect individual visitor sessions, and review full user journeys
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              autoRefresh
                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-white/10"
            }`}
            title="Toggle real-time 10s auto-refresh"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-violet-500" : "bg-slate-400"}`} />
            Auto-refresh: {autoRefresh ? "On" : "Off"}
          </button>

          <button
            onClick={() => fetchOverview(true)}
            disabled={refreshing}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-violet-500" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowClearModal(true)}
            className="btn-danger text-xs px-3 py-2 flex items-center gap-1.5"
            title="Reset testing data"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Data
          </button>
        </div>
      </div>

      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Visitors */}
        <div className="card relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                Total Visitors
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-none">
                {loading ? "..." : data?.summary?.totalVisitors ?? 0}
              </h3>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                <span className="text-emerald-500 font-semibold">100%</span> individual sessions
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/20 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Avg Attention / Dwell Time */}
        <div className="card relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                Avg Time per Visitor
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-none">
                {loading ? "..." : formatDuration(data?.summary?.avgDwellPerVisitor || 0)}
              </h3>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                Total: <span className="text-cyan-500 font-semibold">{formatDuration(data?.summary?.totalDwellSeconds || 0)}</span> on site
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600/10 to-blue-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Most Read Project */}
        <div className="card relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider truncate">
                #1 Most Read Project
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-tight truncate">
                {loading ? "..." : topProject ? topProject.title : "None yet"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-center gap-1 truncate">
                {topProject ? (
                  <>
                    <span className="text-emerald-500 font-semibold">{formatDuration(topProject.totalSeconds)}</span> read time ({topProject.readersCount} {topProject.readersCount === 1 ? "reader" : "readers"})
                  </>
                ) : (
                  "Open project in portfolio to track"
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600/10 to-teal-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Total Interactions / Clicks */}
        <div className="card relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                Total Click Events
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-none">
                {loading ? "..." : data?.summary?.totalClicks ?? 0}
              </h3>
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                Buttons, demo links, card clicks
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600/10 to-orange-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <MousePointerClick className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* ── PROJECT READING ENGAGEMENT & TIME SPENT SECTION ── */}
      <div className="card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Project Reading & Attention Analysis
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                  Ranked by Dwell Time
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Discover exactly which projects visitors open, read in detail, and spend the most time exploring
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-2">
            <span>Total Reading Time:</span>
            <strong className="text-slate-900 dark:text-white font-bold">
              {formatDuration(data?.summary?.totalProjectReadSeconds || 0)}
            </strong>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!data?.projectReadStats || data.projectReadStats.length === 0 ? (
            <div className="col-span-2 py-10 text-center text-slate-400 dark:text-gray-500 text-sm">
              <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
              No project detail reads logged yet. Click &ldquo;View Detail&rdquo; on any project in the portfolio!
            </div>
          ) : (
            data.projectReadStats.map((project, idx) => {
              const percent = maxProjectDwell > 0 ? Math.round((project.totalSeconds / maxProjectDwell) * 100) : 0;
              const hasReads = project.totalSeconds > 0;

              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    idx === 0 && hasReads
                      ? "bg-violet-50/60 dark:bg-violet-950/20 border-violet-500/30 shadow-sm"
                      : "bg-slate-50/40 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          idx === 0 && hasReads
                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                            : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 dark:text-gray-500">
                          <span className="font-mono">id: {project.id}</span>
                          <span>•</span>
                          <span>{project.readersCount} {project.readersCount === 1 ? "reader" : "readers"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1 font-extrabold text-base text-slate-900 dark:text-white">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        {formatDuration(project.totalSeconds)}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500">
                        avg {formatDuration(project.avgSeconds)} / reader
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                      <span>Reading Share:</span>
                      <span className="font-semibold text-slate-800 dark:text-gray-200">{project.sharePercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                        style={{ width: `${Math.max(percent, hasReads ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3 text-amber-500" />
                      {project.clicksCount} interactions (demo/code)
                    </span>
                    <a
                      href={`http://localhost:5173/#/project/${project.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <span>View in Portfolio</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Section Attention Heatmap & Clickstream Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Attention Heatmap (7 cols) */}
        <div className="lg:col-span-7 card flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Section Attention Heatmap
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  How long visitors spend reading each section
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400">
              {data?.sectionDwellStats?.length || 0} Sections Logged
            </span>
          </div>

          <div className="mt-5 space-y-4 flex-1">
            {!data?.sectionDwellStats || data.sectionDwellStats.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-gray-500 text-sm">
                <Compass className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                No section dwell times logged yet. Open the portfolio to start recording!
              </div>
            ) : (
              data.sectionDwellStats.map((stat, idx) => {
                const sec = getSectionDisplay(stat.section);
                const percent = Math.round((stat.totalSeconds / maxSectionDwell) * 100);
                return (
                  <div key={stat.section} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-gray-400">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-gray-200 group-hover:text-violet-500 transition-colors">
                          {sec.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${sec.badge}`}>
                          #{stat.section}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-slate-400 dark:text-gray-500">
                          {stat.visits} {stat.visits === 1 ? "visit" : "visits"} · avg {formatDuration(stat.avgSeconds)}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatDuration(stat.totalSeconds)}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${sec.color} transition-all duration-700`}
                        style={{ width: `${Math.max(percent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Clicked Elements / CTA Leaderboard (5 cols) */}
        <div className="lg:col-span-5 card flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Top Clicked CTAs & Links
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Most engaged buttons & project actions
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500">
              {data?.topClicks?.length || 0} Ranked
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5 overflow-y-auto max-h-[350px] pr-1">
            {!data?.topClicks || data.topClicks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-gray-500 text-sm">
                <MousePointerClick className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                No clicks registered yet.
              </div>
            ) : (
              data.topClicks.map((click, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" :
                      i === 1 ? "bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-white" :
                      i === 2 ? "bg-amber-700/20 text-amber-600 dark:text-amber-400" :
                      "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-500"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-gray-200 truncate">
                        {click.label || click.element}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">
                        {click.section && (
                          <span className="capitalize">in #{click.section}</span>
                        )}
                        {click.url && (
                          <a
                            href={click.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-violet-500 hover:underline flex items-center gap-0.5 truncate max-w-[130px]"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {click.url}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {click.count} {click.count === 1 ? "click" : "clicks"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Audience Devices & Browsers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-violet-500" />
            Device Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Desktop", count: data?.deviceBreakdown?.Desktop || 0, icon: Monitor, color: "text-blue-500 bg-blue-500/10" },
              { label: "Mobile", count: data?.deviceBreakdown?.Mobile || 0, icon: Smartphone, color: "text-emerald-500 bg-emerald-500/10" },
              { label: "Tablet", count: data?.deviceBreakdown?.Tablet || 0, icon: Tablet, color: "text-amber-500 bg-amber-500/10" },
            ].map((d) => {
              const total = (data?.summary?.totalVisitors || 1);
              const pct = Math.round((d.count / (total || 1)) * 100);
              const Icon = d.icon;
              return (
                <div key={d.label} className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-center">
                  <div className={`w-8 h-8 rounded-lg ${d.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-gray-200">{d.label}</p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">{d.count}</p>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500">{pct}% of visitors</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            Browsers & Platforms
          </h3>
          <div className="space-y-2.5">
            {Object.entries(data?.browserBreakdown || {}).length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-gray-500 text-center py-4">No browser logs yet</p>
            ) : (
              Object.entries(data?.browserBreakdown || {}).map(([br, count]) => {
                const total = data?.summary?.totalVisitors || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={br} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-gray-300">{br}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── VISITORS DATA TABLE (Click any row to open full detail) ── */}
      <div className="card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visitor Directory & Activity Table
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300">
                  {filteredJourneys.length} Visitors
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Click any visitor row to open their full activity timeline, reading times, and clicks in a dedicated blank page
              </p>
            </div>
          </div>

          {/* Filters, Search & Open Full Page */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate("/visitors")}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              title="Open full dedicated visitors table page"
            >
              <Users className="w-3.5 h-3.5 text-violet-500" />
              <span>Full Visitors Table</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, browser, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field text-xs py-1.5 pl-8 pr-3 w-44 md:w-56"
              />
            </div>

            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="input-field text-xs py-1.5 px-3 w-auto"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop Only</option>
              <option value="mobile">Mobile Only</option>
              <option value="tablet">Tablet Only</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                <th className="py-3 px-3">Visitor Session</th>
                <th className="py-3 px-3">Device / OS</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Time on Site</th>
                <th className="py-3 px-3">Projects Read</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">First Seen</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {filteredJourneys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400 dark:text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30 animate-bounce" />
                    No visitor records match your filters.
                  </td>
                </tr>
              ) : (
                filteredJourneys.map((v) => {
                  const DeviceIcon = v.device === "Mobile" ? Smartphone : v.device === "Tablet" ? Tablet : Monitor;
                  const projectsReadCount = v.projectsRead?.length || 0;

                  return (
                    <tr
                      key={v.id}
                      onClick={() => window.open(`/visitors/${v.sessionId}`, "_blank")}
                      className="group hover:bg-violet-50/50 dark:hover:bg-violet-950/20 cursor-pointer transition-colors"
                      title="Open full visitor dossier in a new page"
                    >
                      {/* Visitor Session ID */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {v.sessionId.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                #{v.sessionId.slice(0, 10)}...
                              </span>
                              <button
                                onClick={(e) => handleCopy(e, v.sessionId, v.id)}
                                className="text-slate-400 hover:text-violet-500 transition-colors p-0.5"
                                title="Copy session ID"
                              >
                                {copiedId === v.id ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500">{v.events.length} actions logged</p>
                          </div>
                        </div>
                      </td>

                      {/* Device & OS */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-gray-200">
                              {v.device || "Desktop"}
                            </span>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500">
                              {v.browser} · {v.os}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 max-w-[120px] truncate">
                          {v.referrer || "Direct"}
                        </span>
                      </td>

                      {/* Time on Site */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          <Clock className="w-3 h-3 text-cyan-500" />
                          {formatDuration(v.totalDwellSeconds)}
                        </span>
                      </td>

                      {/* Projects Read */}
                      <td className="py-3.5 px-3">
                        {projectsReadCount > 0 ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                              <BookOpen className="w-2.5 h-2.5" />
                              {projectsReadCount} {projectsReadCount === 1 ? "Project" : "Projects"}
                            </span>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500 truncate max-w-[150px]">
                              {v.projectsRead[0]?.title}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 dark:text-gray-500">None</span>
                        )}
                      </td>

                      {/* Clicks */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-gray-300">
                          <MousePointerClick className="w-3 h-3 text-amber-500" />
                          {v.clickCount}
                        </span>
                      </td>

                      {/* First Seen */}
                      <td className="py-3.5 px-3 text-slate-500 dark:text-gray-400 text-[11px]">
                        {formatDate(v.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/visitors/${v.sessionId}`, "_blank");
                            }}
                            className="btn-secondary text-[11px] px-2.5 py-1 flex items-center gap-1 group-hover:border-violet-500/40"
                            title="Open visitor dossier in a blank page"
                          >
                            <ExternalLink className="w-3 h-3 text-violet-500" />
                            <span>Open Page</span>
                          </button>
                          <button
                            onClick={(e) => handleDeleteSession(e, v.sessionId)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Clear Confirmation Modal ── */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-2xl border-red-500/20">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear All Visitor Analytics?
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                This will delete all visitor sessions, project reading times, and click histories. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                disabled={clearing}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="btn-danger text-xs px-4 py-2 flex items-center gap-2"
              >
                {clearing ? "Clearing..." : "Yes, Clear All Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
