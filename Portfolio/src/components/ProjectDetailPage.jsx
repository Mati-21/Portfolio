import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "../data/projectsData";
import { useContent } from "../context/ContentContext";

function ProjectDetailPage({ projectId, onBack, onSelectProject }) {
  const [activeImage, setActiveImage] = useState(null);
  const { content, resolveMediaUrl } = useContent();
  const pSection = content?.projects || {};

  const PROJECT_ID_MAP = {
    "amu-kpi": 1,
    "ripple-chat": 2,
    "npq-game": 3,
    "wholesale-erp": 4,
  };

  // Find the current project or fallback to first
  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const baseProject = projects[currentIndex] || projects[0];
  const num = PROJECT_ID_MAP[baseProject.id] || (currentIndex >= 0 ? currentIndex + 1 : 1);

  const dynamicTitle = pSection[`proj${num}_title`] || baseProject.title;
  const dynamicBadge = pSection[`proj${num}_badge`] || baseProject.badge;
  const dynamicCategory = pSection[`proj${num}_category`] || baseProject.categoryLabel;
  const dynamicDesc = pSection[`proj${num}_desc`] || baseProject.desc;
  const dynamicDemo = pSection[`proj${num}_demo`] || baseProject.demoUrl;
  const dynamicGithub = pSection[`proj${num}_github`] || baseProject.githubUrl;
  const dynamicMainImage = resolveMediaUrl(pSection[`proj${num}_main_image`]) || baseProject.mainImage;

  let gallery = [];
  if (pSection[`proj${num}_gallery_json`]) {
    try {
      const parsed = JSON.parse(pSection[`proj${num}_gallery_json`]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        gallery = parsed.map((item, gIdx) => ({
          ...item,
          id: item.id || gIdx + 1,
          src: resolveMediaUrl(item.src),
          title: item.title || `Screenshot Slot #${gIdx + 1}`,
          caption: item.caption || "",
        }));
      }
    } catch {
      // fallback
    }
  }

  if (gallery.length === 0) {
    const dynamicCount = parseInt(pSection[`proj${num}_gallery_count`], 10);
    const count = dynamicCount > 0 ? dynamicCount : (baseProject.gallery?.length || 4);
    gallery = Array.from({ length: count }, (_, gIdx) => {
      const slotNum = gIdx + 1;
      const baseItem = baseProject.gallery?.[gIdx] || {
        id: slotNum,
        title: `Screenshot Slot #${slotNum}`,
        caption: "",
        tag: "Screenshot",
      };
      const dynamicSrc = resolveMediaUrl(pSection[`proj${num}_gallery_img${slotNum}`]);
      const dynamicTitle = pSection[`proj${num}_gallery_title${slotNum}`];
      const dynamicCaption = pSection[`proj${num}_gallery_caption${slotNum}`];

      return {
        ...baseItem,
        id: slotNum,
        src: dynamicSrc || baseItem.src,
        title: dynamicTitle || baseItem.title,
        caption: dynamicCaption || baseItem.caption,
      };
    });
  }

  const project = {
    ...baseProject,
    title: dynamicTitle,
    badge: dynamicBadge,
    categoryLabel: dynamicCategory,
    desc: dynamicDesc,
    demoUrl: dynamicDemo,
    githubUrl: dynamicGithub,
    mainImage: dynamicMainImage,
    gallery,
  };

  const prevProject =
    currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  // Scroll to top on project change and cancel any Lenis velocity
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [projectId]);

  const IconComponent = project.icon;

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-slate-50 dark:bg-[#050609] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-600 dark:selection:text-violet-200 transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#f1f5f9_0%,#f8fafc_70%,#ffffff_100%)] dark:bg-[radial-gradient(ellipse_at_top,#14172a_0%,#050609_70%,#000000_100%)] opacity-95 transition-colors duration-300" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[450px] bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40 transition-opacity" />

      {/* Main Full Page Content */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        {/* Sub-bar below main navbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.12] border border-slate-200/80 dark:border-white/[0.1] text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-gray-200 dark:hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-violet-600 dark:text-violet-400" />
            <span>Back to Projects</span>
          </button>

          {/* Quick Project Switcher (Previous / Next) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectProject(prevProject.id)}
              title={`Previous: ${prevProject.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-gray-500 px-1">
              {currentIndex + 1} of {projects.length}
            </span>
            <button
              onClick={() => onSelectProject(nextProject.id)}
              title={`Next: ${nextProject.title}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-gray-300 dark:hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. FIRST PLACE: ONE MAIN IMAGE SHOWCASE */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Header Row: Title, Badges & Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono border ${project.badgeColor}`}
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                  <span>{project.badge}</span>
                </span>
                <span className="text-xs font-mono text-slate-600 dark:text-gray-400 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08]">
                  {project.categoryLabel}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
                {project.title}
              </h1>
            </div>

            {/* Quick Action Links */}
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>Source Code</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              )}
              {project.demoUrl && project.demoUrl !== project.githubUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs sm:text-sm font-medium shadow-md shadow-violet-600/30 active:scale-95 transition-all"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* THE MAIN IMAGE (Featured 16:9 Display in browser mockup frame) */}
          <div className="relative rounded-3xl bg-slate-900 dark:bg-black/90 border border-slate-700/60 dark:border-slate-800 shadow-2xl overflow-hidden group">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 dark:bg-[#121320] border-b border-slate-700/60 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
              <div className="px-3.5 py-0.5 rounded-full bg-slate-900/70 dark:bg-white/[0.04] border border-slate-700/50 dark:border-slate-800/60 text-xs font-mono text-gray-400">
                https://{project.id}.app
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[10px] font-mono text-violet-400 uppercase tracking-wider">
                  Main Featured View
                </span>
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              </div>
            </div>

            {/* Main Image or Simulation Canvas */}
            {project.mainImage ? (
              <div
                onClick={() => setActiveImage({ src: project.mainImage, title: project.title, caption: "Main Project View" })}
                className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-black/70 text-white border border-white/20 shadow-xl">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full flex flex-col justify-center p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#131526] to-slate-950 text-slate-100 overflow-hidden">
                {/* Blueprint Grid Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

                {/* Floating tags */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-gray-300">
                  Main Screenshot Slot
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-300">
                  1920 × 1080 • Hi-Res
                </div>

                {/* Simulated Visual Preview according to project type */}
                {project.previewType === "chat" && (
                  <div className="relative z-10 max-w-xl mx-auto w-full space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 pb-2 border-b border-slate-700/60">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>#general • 14 active members</span>
                      </span>
                      <span className="text-gray-400">WebSocket Connected</span>
                    </div>
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-cyan-600/40 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-200">
                        A
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800/90 border border-slate-700/60 text-xs text-gray-200 leading-relaxed shadow-md">
                        Hey team! The real-time Socket.IO cluster is live. Latency is &lt;20ms 🌊
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-teal-600/40 border border-teal-400/40 flex items-center justify-center text-xs font-bold text-teal-200">
                        M
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tr-none bg-cyan-600/30 border border-cyan-500/40 text-xs text-cyan-100 leading-relaxed shadow-md">
                        Real-time message delivery and typing sync look super fluid!
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 pl-10 pt-1">
                      <span className="italic">Alex is typing</span>
                      <span className="animate-bounce">...</span>
                    </div>
                  </div>
                )}

                {project.previewType === "kpi" && (
                  <div className="relative z-10 max-w-2xl mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-300 pb-2 border-b border-slate-700/60">
                      <span className="text-violet-400 font-semibold text-sm">AMU Central KPI Dashboard</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Institutional Review Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "KPIs Submitted", val: "124", color: "text-violet-400" },
                        { label: "Approved", val: "98", color: "text-emerald-400" },
                        { label: "Pending Review", val: "26", color: "text-amber-400" },
                      ].map((m) => (
                        <div key={m.label} className="p-3 rounded-xl bg-white/[0.05] border border-slate-700/50 shadow-sm">
                          <div className={`text-xl font-bold font-mono ${m.color}`}>{m.val}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 pt-1">
                      {[
                        { dept: "Academic Affairs", pct: 92 },
                        { dept: "Research Office", pct: 74 },
                        { dept: "Student Services", pct: 61 },
                      ].map((r) => (
                        <div key={r.dept} className="flex items-center gap-3 text-xs">
                          <span className="text-gray-400 w-32 shrink-0 truncate">{r.dept}</span>
                          <div className="flex-1 h-2 rounded-full bg-slate-700/60 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-violet-300 font-mono font-medium">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.previewType === "game" && (
                  <div className="relative z-10 max-w-lg mx-auto w-full space-y-3 text-center">
                    <div className="flex items-center justify-between text-xs font-mono px-2 pb-2 border-b border-slate-700/60">
                      <span className="text-amber-400 font-bold">PLAYERS: 4</span>
                      <span className="text-emerald-400 font-bold">ROUND: 3/5</span>
                      <span className="text-rose-400 font-bold">⏱ 0:42</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                      <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Live Tournament Leaderboard</div>
                      {[
                        { name: "Player_1", pts: 2400, color: "text-amber-400" },
                        { name: "Player_2", pts: 1980, color: "text-gray-200" },
                        { name: "You (Champion Tier)", pts: 1750, color: "text-emerald-400" },
                        { name: "Player_4", pts: 1100, color: "text-gray-400" },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-mono">
                          <span className={`${p.color}`}>#{i + 1} {p.name}</span>
                          <span className={`font-bold ${p.color}`}>{p.pts.toLocaleString()} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.previewType === "erp" && (
                  <div className="relative z-10 max-w-xl mx-auto w-full space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-slate-700/60">
                      <span className="text-amber-400 font-semibold">ERP • Multi-Branch Operations</span>
                      <span className="text-emerald-400">Branch: HQ • Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Today's Orders", val: "142", color: "text-amber-400" },
                        { label: "Revenue", val: "$84.2K", color: "text-emerald-400" },
                        { label: "Low Stock Alerts", val: "7 items", color: "text-rose-400" },
                        { label: "Pending Purchase Orders", val: "23", color: "text-violet-400" },
                      ].map((m) => (
                        <div key={m.label} className="p-3 rounded-xl bg-white/[0.04] border border-slate-700/50">
                          <div className={`text-base font-bold ${m.color}`}>{m.val}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Center notice */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-gray-400 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">
                  Click or replace with project screenshot
                </div>
              </div>
            )}
          </div>
        </motion.section>


        {/* 2. MORE IMAGES / SCREENSHOTS GALLERY */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-mono uppercase tracking-widest mb-1 font-semibold">
                <ImageIcon className="w-4 h-4" />
                <span>More Screenshots</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                Project Gallery & Additional Views
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] px-3 py-1 rounded-full w-fit">
              {project.gallery?.length || 4} Additional Screenshot Slots
            </div>
          </div>

          {/* Additional Screenshot Placeholders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((item, idx) => (
              <div
                key={idx}
                className="group rounded-2xl bg-white dark:bg-black/80 border border-slate-200/80 dark:border-white/[0.08] hover:border-violet-500/50 dark:hover:border-violet-500/50 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-lg shadow-slate-200/40 dark:shadow-2xl"
              >
                {/* Visual Preview Box */}
                {item.src ? (
                  <div
                    onClick={() => setActiveImage(item)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-slate-950 mb-4 cursor-pointer group-hover:border-violet-500/50"
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-black/60 text-white border border-white/20">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-dashed border-slate-300 dark:border-white/[0.15] group-hover:border-violet-500/60 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/70 dark:from-slate-950 dark:via-[#0d0e1a] dark:to-black mb-4 flex flex-col items-center justify-center p-6 text-center transition-colors">
                    {/* Architectural Blueprint Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none opacity-60 dark:opacity-40" />

                    {/* Top corner tags */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-black/60 border border-slate-200 dark:border-white/[0.08] text-[10px] font-mono text-slate-500 dark:text-gray-400">
                      Slot #{item.id || idx + 1}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-700 dark:text-violet-300 font-semibold">
                      {item.tag || "Screenshot"}
                    </div>

                    {/* Center Icon & Notice */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] group-hover:border-violet-500/50 flex items-center justify-center text-slate-400 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors shadow-sm">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-gray-200 font-heading">
                        Screenshot Placeholder
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400 max-w-[220px] leading-tight">
                        Drop high-res screenshot or image URL
                      </span>
                    </div>

                    {/* Bottom resolution badge */}
                    <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-400 dark:text-gray-500">
                      1920 × 1080 • Hi-Res
                    </div>
                  </div>
                )}

                {/* Caption & Title */}
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Switcher & Navigation Footer */}
        <section className="pt-8 border-t border-slate-200/80 dark:border-white/[0.08]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Previous Project */}
            <button
              onClick={() => onSelectProject(prevProject.id)}
              className="group p-4 rounded-2xl bg-white dark:bg-black/60 hover:bg-slate-50 dark:hover:bg-black/90 border border-slate-200/80 dark:border-white/[0.08] hover:border-violet-500/40 text-left transition-all cursor-pointer flex items-center gap-3 shadow-sm"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] group-hover:bg-violet-600/20 text-slate-600 dark:text-gray-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider">Previous Project</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-300">
                  {prevProject.title}
                </div>
              </div>
            </button>

            {/* Next Project */}
            <button
              onClick={() => onSelectProject(nextProject.id)}
              className="group p-4 rounded-2xl bg-white dark:bg-black/60 hover:bg-slate-50 dark:hover:bg-black/90 border border-slate-200/80 dark:border-white/[0.08] hover:border-violet-500/40 text-right transition-all cursor-pointer flex items-center justify-end gap-3 shadow-sm"
            >
              <div className="overflow-hidden">
                <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider">Next Project</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-300">
                  {nextProject.title}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] group-hover:bg-violet-600/20 text-slate-600 dark:text-gray-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:border-white/[0.1] dark:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Projects</span>
            </button>

            <a
              href="https://github.com/Mati-21"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <span>Explore all open-source repositories on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* Lightbox for images when clicked */}
      <AnimatePresence>
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setActiveImage(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-w-full max-h-[80vh] rounded-xl border border-white/20 object-contain shadow-2xl"
              />
              <div className="mt-4 text-center">
                <h4 className="text-white font-medium">{activeImage.title}</h4>
                <p className="text-sm text-gray-300">{activeImage.caption}</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectDetailPage;
