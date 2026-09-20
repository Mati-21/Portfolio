import { useState } from "react";
import { Eye, Monitor, Tablet, Smartphone, ExternalLink, RefreshCw } from "lucide-react";

const PORTFOLIO_URL = (import.meta.env.VITE_PORTFOLIO_URL || "http://localhost:5173").replace(/\/+$/, "");

const DEVICES = [
  { key: "desktop",  label: "Desktop",  icon: Monitor,    width: "100%",    height: "100%" },
  { key: "tablet",   label: "Tablet",   icon: Tablet,     width: "768px",   height: "100%" },
  { key: "mobile",   label: "Mobile",   icon: Smartphone, width: "390px",   height: "100%" },
];

export default function Preview() {
  const [device, setDevice]       = useState("desktop");
  const [key, setKey]             = useState(0);    // force iframe reload

  const current = DEVICES.find((d) => d.key === device);

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap flex-shrink-0">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Preview</h1>
            <p className="text-slate-500 dark:text-gray-500 text-sm mt-0.5">
              See your portfolio exactly as visitors do
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-xl p-1">
            {DEVICES.map(({ key: dk, label, icon: Icon }) => (
              <button
                key={dk}
                onClick={() => setDevice(dk)}
                title={label}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  device === dk
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200"
                }`}
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Reload */}
          <button
            onClick={() => setKey((k) => k + 1)}
            className="btn-secondary gap-2"
            title="Reload preview"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>

          {/* Open in new tab */}
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </a>
        </div>
      </div>

      {/* ── Notice bar ── */}
      <div className="flex-shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 rounded-xl px-4 py-2.5 text-amber-800 dark:text-amber-400 text-xs">
        <Eye className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          Previewing <code className="bg-amber-100 dark:bg-amber-500/15 px-1.5 py-0.5 rounded font-mono text-amber-900 dark:text-amber-300">{PORTFOLIO_URL}</code>
          {" — "}make sure the portfolio dev server is running on port 5173.
        </span>
      </div>

      {/* ── Iframe container ── */}
      <div className="flex-1 flex items-start justify-center overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-100 dark:bg-surface-100 min-h-0">
        <div
          className="h-full transition-all duration-500 ease-in-out overflow-hidden rounded-xl shadow-2xl shadow-black/50"
          style={{ width: current.width, maxWidth: "100%" }}
        >
          <iframe
            key={key}
            src={PORTFOLIO_URL}
            title="Portfolio Preview"
            className="w-full h-full border-0 bg-white"
            style={{ minHeight: "600px" }}
          />
        </div>
      </div>
    </div>
  );
}
