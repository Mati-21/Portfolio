import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsApi } from "../api/client";
import {
  Users,
  Clock,
  MousePointerClick,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Search,
  CheckCircle2,
  Copy,
  BookOpen,
  Eye,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Visitors() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await analyticsApi.getOverview();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load visitors:", err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 400);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCopy = (e, text, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    try {
      await analyticsApi.deleteSession(sessionId);
      fetchData();
    } catch (err) {
      console.error("Delete session error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJourneys = useMemo(() => {
    if (!data?.visitorJourneys) return [];
    return data.visitorJourneys.filter((j) => {
      const matchesDevice =
        deviceFilter === "all" ||
        (j.device || "").toLowerCase() === deviceFilter.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        j.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.browser || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.os || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.referrer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.projectsRead?.some((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesDevice && matchesSearch;
    });
  }, [data?.visitorJourneys, deviceFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Visitor Directory
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                {loading ? "..." : filteredJourneys.length} Sessions
              </span>
            </div>
            <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
              Every visitor who has interacted with your portfolio — click a row to see their full activity dossier
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => navigate("/analytics")}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Analytics
          </button>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-violet-500" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Visitors",
            value: loading ? "…" : data?.summary?.totalVisitors ?? 0,
            icon: Users,
            grad: "from-violet-600/10 to-indigo-600/20",
            text: "text-violet-600 dark:text-violet-400",
            border: "border-violet-500/20",
          },
          {
            label: "Avg Time on Site",
            value: loading ? "…" : formatDuration(data?.summary?.avgDwellPerVisitor || 0),
            icon: Clock,
            grad: "from-cyan-600/10 to-blue-600/20",
            text: "text-cyan-600 dark:text-cyan-400",
            border: "border-cyan-500/20",
          },
          {
            label: "Total Clicks",
            value: loading ? "…" : data?.summary?.totalClicks ?? 0,
            icon: MousePointerClick,
            grad: "from-amber-600/10 to-orange-600/20",
            text: "text-amber-600 dark:text-amber-400",
            border: "border-amber-500/20",
          },
        ].map(({ label, value, icon: Icon, grad, text, border }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${grad} ${text} flex items-center justify-center border ${border} flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider font-medium">{label}</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">All Sessions</h2>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, browser, OS, project…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field text-xs py-1.5 pl-8 pr-3 w-52 md:w-64"
              />
            </div>

            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="input-field text-xs py-1.5 px-3 w-auto"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>

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
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400 dark:text-gray-500">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-40" />
                    Loading visitor data…
                  </td>
                </tr>
              ) : filteredJourneys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400 dark:text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30 animate-bounce" />
                    No visitor records match your filters.
                  </td>
                </tr>
              ) : (
                filteredJourneys.map((v) => {
                  const DeviceIcon =
                    v.device === "Mobile" ? Smartphone : v.device === "Tablet" ? Tablet : Monitor;
                  const projectsReadCount = v.projectsRead?.length || 0;

                  return (
                    <tr
                      key={v.id}
                      onClick={() => window.open(`/visitors/${v.sessionId}`, "_blank")}
                      className="group hover:bg-violet-50/50 dark:hover:bg-violet-950/20 cursor-pointer transition-colors"
                      title="Click to open full visitor activity dossier in a blank page"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {v.sessionId.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                #{v.sessionId.slice(0, 10)}…
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
                            <p className="text-[10px] text-slate-400 dark:text-gray-500">
                              {v.events.length} actions logged
                            </p>
                          </div>
                        </div>
                      </td>

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

                      <td className="py-3.5 px-3">
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 max-w-[120px] truncate">
                          {v.referrer || "Direct"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          <Clock className="w-3 h-3 text-cyan-500" />
                          {formatDuration(v.totalDwellSeconds)}
                        </span>
                      </td>

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

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-gray-300">
                          <MousePointerClick className="w-3 h-3 text-amber-500" />
                          {v.clickCount}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-500 dark:text-gray-400 text-[11px]">
                        {formatDate(v.createdAt)}
                      </td>

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
                            disabled={deletingId === v.sessionId}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
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
    </div>
  );
}
