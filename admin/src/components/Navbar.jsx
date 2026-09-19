import { Sun, Moon, Bell, Globe, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="
      fixed top-0 left-64 right-0 z-30 h-14
      flex items-center justify-between px-6
      bg-white/80 dark:bg-surface-50/80
      border-b border-slate-200/80 dark:border-white/5
      backdrop-blur-xl
      transition-colors duration-300
    ">
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-slate-400 dark:text-gray-600" />
        <span className="text-slate-500 dark:text-gray-600 text-xs font-medium">
          portfolio-admin
        </span>
        <span className="text-slate-300 dark:text-gray-700 text-xs">/</span>
        <span className="text-slate-700 dark:text-gray-400 text-xs font-semibold">
          {admin?.email ?? "Admin"}
        </span>
      </div>

      {/* Right — action icons */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="
            relative w-9 h-9 rounded-xl flex items-center justify-center
            transition-all duration-200
            bg-slate-100 hover:bg-slate-200
            dark:bg-white/5 dark:hover:bg-white/10
            border border-slate-200/80 dark:border-white/10
            active:scale-90
          "
        >
          <Sun
            className={`
              w-4 h-4 absolute transition-all duration-300
              text-amber-500
              ${isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90"}
            `}
          />
          <Moon
            className={`
              w-4 h-4 absolute transition-all duration-300
              text-indigo-500
              ${!isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"}
            `}
          />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          title="Notifications"
          className="
            relative w-9 h-9 rounded-xl flex items-center justify-center
            transition-all duration-200
            bg-slate-100 hover:bg-slate-200
            dark:bg-white/5 dark:hover:bg-white/10
            border border-slate-200/80 dark:border-white/10
            active:scale-90
          "
        >
          <Bell className="w-4 h-4 text-slate-500 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-white dark:border-surface-50" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Admin avatar */}
        <div className="
          w-9 h-9 rounded-xl
          bg-gradient-to-br from-violet-500 to-indigo-600
          flex items-center justify-center
          text-white text-xs font-bold
          shadow-sm shadow-violet-500/30
          cursor-default select-none
        ">
          {admin?.email?.[0]?.toUpperCase() ?? "A"}
        </div>

        {/* Logout (outermost, icon-only) */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="
            w-9 h-9 rounded-xl flex items-center justify-center
            text-slate-500 dark:text-gray-400
            hover:text-red-600 dark:hover:text-red-400
            bg-slate-100 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-red-500/10
            border border-slate-200/80 hover:border-red-200 dark:border-white/10 dark:hover:border-red-500/20
            transition-all duration-200 active:scale-90
          "
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
