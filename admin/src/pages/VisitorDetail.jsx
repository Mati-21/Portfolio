import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { analyticsApi } from "../api/client";
import {
  Users,
  Clock,
  MousePointerClick,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Compass,
  CheckCircle2,
  Copy,
  Trash2,
  AlertTriangle,
} from "lucide-react";

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SECTION_CONFIG = {
  home:     { label: "Hero / Home",          badge: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20" },
  about:    { label: "About Me",             badge: "bg-teal-500/10 text-teal-500 dark:text-teal-400 border-teal-500/20" },
  skills:   { label: "Tech Stack & Skills",  badge: "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" },
  projects: { label: "Projects Showcase",    badge: "bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20" },
  contact:  { label: "Contact & Footer",     badge: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20" },
};

function getSectionDisplay(sectionName) {
  if (!sectionName) return { label: "General", badge: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
  const lower = sectionName.toLowerCase();
  if (lower.startsWith("detail:")) {
    const pId = sectionName.replace(/^detail:/i, "");
    return {
      label: `Project: ${pId}`,
      badge: "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20",
    };
  }
  return SECTION_CONFIG[lower] || {
    label: sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
    badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
}

export default function VisitorDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analyticsApi.getOverview();
        const found = res.data?.visitorJourneys?.find((j) => j.sessionId === sessionId);
        setVisitor(found || null);
      } catch (err) {
        console.error("Failed to load visitor detail:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await analyticsApi.deleteSession(sessionId);
      navigate("/visitors");
    } catch (err) {
      console.error("Delete error:", err);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const DeviceIcon = visitor?.device === "Mobile" ? Smartphone : visitor?.device === "Tablet" ? Tablet : Monitor;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-500" />
        <p className="text-slate-500 dark:text-gray-400 text-sm">Loading visitor dossier…</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
        <Users className="w-12 h-12 text-slate-300 dark:text-gray-600" />
        <p className="text-slate-500 dark:text-gray-400 font-semibold">Visitor session not found</p>
        <p className="text-xs text-slate-400 dark:text-gray-500 font-mono">{sessionId}</p>
        <button onClick={() => navigate("/visitors")} className="btn-secondary text-xs px-4 py-2 flex items-center gap-2 mt-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Visitors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">

      {/* ── Back + Delete ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/visitors")}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Visitors
          </button>
          <button
            onClick={() => window.close()}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            title="Close this browser tab"
          >
            <span>Close Tab</span>
          </button>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-red-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-500/5 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Session
        </button>
      </div>

      {/* ── Identity Header ── */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/30 text-xl font-extrabold">
              {visitor.sessionId.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visitor Activity Dossier
                </h1>
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 font-semibold text-slate-700 dark:text-gray-300">
                  #{visitor.sessionId.slice(0, 14)}…
                </span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-violet-500 transition-colors"
                  title="Copy full sessionId"
                >
                  {copiedId ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                First active: <strong className="text-slate-700 dark:text-gray-300">{formatDate(visitor.createdAt)}</strong>
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <DeviceIcon className="w-3.5 h-3.5" /> {visitor.device || "Desktop"}
                </span>
                <span>·</span>
                <span>{visitor.browser} ({visitor.os})</span>
                <span>·</span>
                <span>Source: <strong className="text-slate-700 dark:text-gray-300">{visitor.referrer || "Direct"}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Dwell Time",
            value: formatDuration(visitor.totalDwellSeconds),
            icon: Clock,
            color: "from-cyan-600/10 to-blue-600/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
          },
          {
            label: "Projects Read",
            value: visitor.projectsRead?.length || 0,
            icon: BookOpen,
            color: "from-violet-600/10 to-indigo-600/20 text-violet-600 dark:text-violet-400 border-violet-500/20",
          },
          {
            label: "Total Clicks",
            value: visitor.clickCount,
            icon: MousePointerClick,
            color: "from-amber-600/10 to-orange-600/20 text-amber-600 dark:text-amber-400 border-amber-500/20",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center border mx-auto mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Projects Read ── */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Projects Read by this Visitor</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400">Individual project detail pages opened</p>
          </div>
        </div>

        {!visitor.projectsRead || visitor.projectsRead.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-gray-500 italic py-2">
            This visitor browsed the portfolio sections but did not open any individual project detail page.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visitor.projectsRead.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {p.title}
                  </span>
                  <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400 flex-shrink-0">
                    {formatDuration(p.seconds)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-gray-500">
                  {p.clicks} click{p.clicks !== 1 ? "s" : ""} performed inside project
                </p>
                <a
                  href={`http://localhost:5173/#/project/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-violet-500 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  Open in Portfolio
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Chronological Activity Trail ── */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Chronological Activity Trail
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {visitor.events.length} actions logged from {formatTime(visitor.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {visitor.events.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-gray-500 italic py-2">No detailed events logged yet.</p>
        ) : (
          <div className="relative pl-7 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-cyan-500 before:to-amber-500 before:rounded-full">
            {visitor.events.map((ev, eIdx) => {
              const isDwell = ev.type === "section_dwell";
              const isProject = ev.section && ev.section.startsWith("detail:");
              const sec = getSectionDisplay(ev.section);

              return (
                <div key={ev.id || eIdx} className="relative flex items-start justify-between gap-4">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-7 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-[#0b0c10] flex-shrink-0 ${
                      isProject ? "bg-indigo-500" : isDwell ? "bg-cyan-500" : "bg-amber-500"
                    }`}
                  />

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isProject
                            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                            : isDwell
                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {isProject ? "PROJECT READ" : isDwell ? "SECTION DWELL" : "CLICK ACTION"}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${sec.badge}`}>
                        {ev.label || sec.label}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-gray-200">
                      {isDwell ? (
                        <>
                          Stayed on <span className="text-cyan-600 dark:text-cyan-400 font-bold">{ev.label || sec.label}</span>{" "}
                          for <span className="font-extrabold text-slate-900 dark:text-white">{formatDuration(ev.duration)}</span>
                        </>
                      ) : (
                        <>
                          Clicked <span className="text-amber-600 dark:text-amber-400 font-bold">&ldquo;{ev.label || ev.element}&rdquo;</span>
                        </>
                      )}
                    </p>

                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-violet-500 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        {ev.url}
                      </a>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-gray-500 font-mono flex-shrink-0 pt-0.5">
                    {formatTime(ev.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-2xl border-red-500/20">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Visitor Session?</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                This will permanently delete all data for{" "}
                <span className="font-mono font-bold text-slate-700 dark:text-gray-300">#{sessionId.slice(0, 14)}…</span>.
                This cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger text-xs px-4 py-2 flex items-center gap-2"
              >
                {deleting ? "Deleting…" : "Yes, Delete Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
