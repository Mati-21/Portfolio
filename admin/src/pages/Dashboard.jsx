import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { contactsApi, analyticsApi } from "../api/client";
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  MousePointerClick,
  Activity,
  ArrowRight,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-slate-500 dark:text-gray-500 text-xs font-medium mb-0.5">{label}</p>
        <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">{value ?? "—"}</p>
        {sub && <p className="text-slate-400 dark:text-gray-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ total: null, unread: null });
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      contactsApi
        .getAll()
        .then((res) => {
          setStats({ total: res.data.total, unread: res.data.unreadCount });
        })
        .catch(() => {});

      analyticsApi
        .getOverview()
        .then((res) => {
          setAnalyticsData(res.data);
        })
        .catch(() => {});
    };

    fetchData();
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(fetchData, 15000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page header ── */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {greeting}, Admin 👋
          </h1>
          <p className="text-slate-500 dark:text-gray-500 text-sm mt-0.5">
            {admin?.email} · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Visitors"
          value={analyticsData?.summary?.totalVisitors ?? "0"}
          sub="Unique visitor sessions"
          color="bg-gradient-to-br from-violet-600 to-indigo-600"
        />
        <StatCard
          icon={MousePointerClick}
          label="Interactions"
          value={analyticsData?.summary?.totalClicks ?? "0"}
          sub="CTA & project clicks"
          color="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          icon={MessageSquare}
          label="Total Messages"
          value={stats.total}
          sub="All contact submissions"
          color="bg-gradient-to-br from-blue-600 to-cyan-600"
        />
        <StatCard
          icon={Mail}
          label="Unread Messages"
          value={stats.unread}
          sub="Waiting for review"
          color="bg-gradient-to-br from-rose-600 to-pink-600"
        />
      </div>

      {/* ── Live Analytics Preview Widget ── */}
      <div className="card relative overflow-hidden group hover:border-violet-500/30 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Visitor Attention & Click Tracking is Active
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-1 max-w-xl">
                Tracking section dwell time, interactive button clicks, and individual visitor journey timelines in real time.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 dark:text-gray-300">
                <span>
                  🔥 Top Section: <strong className="text-slate-900 dark:text-white capitalize">{analyticsData?.sectionDwellStats?.[0]?.section || "Home"}</strong>
                </span>
                <span>•</span>
                <span>
                  ⏱️ Avg Attention: <strong className="text-slate-900 dark:text-white">{Math.round(analyticsData?.summary?.avgDwellPerVisitor || 0)}s</strong>
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/analytics"
            className="btn-primary self-start md:self-center text-xs px-4 py-2.5 flex items-center gap-2"
          >
            Open Analytics Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="card relative overflow-hidden">
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-slate-800 dark:text-white font-semibold text-base mb-2">
              Your Portfolio Command Center
            </h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
              Manage your portfolio content, inspect visitor attention and click timelines, read incoming contact submissions, and preview live site changes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/analytics"
                className="inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-300 hover:brightness-110 transition-all font-medium"
              >
                📊 Explore Visitor Analytics
              </Link>
              <Link
                to="/contacts"
                className="inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/8 dark:text-gray-300 hover:bg-slate-200 transition-all"
              >
                📬 View Messages in Contacts
              </Link>
              <Link
                to="/update"
                className="inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/8 dark:text-gray-300 hover:bg-slate-200 transition-all"
              >
                ✏️ Edit Sections in Update Content
              </Link>
              <Link
                to="/preview"
                className="inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/8 dark:text-gray-300 hover:bg-slate-200 transition-all"
              >
                👁️ See Your Site in Preview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
