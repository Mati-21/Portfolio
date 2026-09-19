import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  PenSquare,
  Eye,
  Zap,
  Activity,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: Activity,
    description: "Visitor dwell time & clicks",
  },
  {
    label: "Visitors",
    to: "/visitors",
    icon: Users,
    description: "Directory & user sessions",
  },
  {
    label: "Contacts",
    to: "/contacts",
    icon: MessageSquare,
    description: "Messages from visitors",
  },
  {
    label: "Update Content",
    to: "/update",
    icon: PenSquare,
    description: "Edit portfolio sections",
  },
  {
    label: "Preview",
    to: "/preview",
    icon: Eye,
    description: "See what visitors see",
  },
];

export function Sidebar({ onNavigate }) {
  const { admin } = useAuth();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-surface-50 border-r border-slate-200/80 dark:border-white/5 flex flex-col z-40 transition-colors duration-300">
      {/* ── Logo / Brand ── */}
      <div className="px-6 py-6 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-600/30 flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-slate-800 dark:text-white font-bold text-sm leading-none">Portfolio CMS</p>
            <p className="text-slate-400 dark:text-gray-500 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-slate-400 dark:text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>

        {NAV_ITEMS.map(({ label, to, icon: Icon, description }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `sidebar-link group ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-violet-100 text-violet-600 dark:bg-white/5 dark:text-gray-400"
                      : "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-gray-500 group-hover:bg-slate-200 group-hover:text-slate-700 dark:group-hover:bg-white/10 dark:group-hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold leading-none ${
                      isActive
                        ? "text-violet-700 dark:text-gray-300"
                        : "text-slate-500 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-white"
                    }`}
                  >
                    {label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-gray-600 mt-0.5 truncate">{description}</p>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
