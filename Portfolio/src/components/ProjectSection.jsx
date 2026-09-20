import { motion } from "framer-motion";
import { useState } from "react";
import {
  ExternalLink,
  FolderGit2,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Terminal,
  Layers,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useContent } from "../context/ContentContext";
import { projects } from "../data/projectsData";

function ProjectSection({ onOpenProject }) {
  const { content, resolveMediaUrl } = useContent();
  const pSection = content?.projects || {};
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("portfolio_project_filter") || "all";
      } catch {
        return "all";
      }
    }
    return "all";
  });

  const handleFilterSelect = (filterId) => {
    setActiveFilter(filterId);
    try {
      sessionStorage.setItem("portfolio_project_filter", filterId);
    } catch {
      // ignore
    }
  };

  const PROJECT_ID_MAP = {
    "amu-kpi": 1,
    "ripple-chat": 2,
    "npq-game": 3,
    "wholesale-erp": 4,
  };

  const activeProjects = projects.map((p, idx) => {
    const num = PROJECT_ID_MAP[p.id] || idx + 1;
    const title = pSection[`proj${num}_title`] || p.title;
    const badge = pSection[`proj${num}_badge`] || p.badge;
    const categoryLabel = pSection[`proj${num}_category`] || p.categoryLabel;
    const desc = pSection[`proj${num}_desc`] || p.desc;
    const demoUrl = pSection[`proj${num}_demo`] || p.demoUrl;
    const githubUrl = pSection[`proj${num}_github`] || p.githubUrl;
    const techStr = pSection[`proj${num}_tech`];
    const technologies = techStr
      ? techStr.split(",").map((s) => s.trim()).filter(Boolean)
      : p.technologies;
    const highlightsStr = pSection[`proj${num}_highlights`];
    const highlights = highlightsStr
      ? highlightsStr.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      : p.highlights;
    const dynamicMainImage = resolveMediaUrl(pSection[`proj${num}_main_image`]);
    const mainImage = dynamicMainImage || p.mainImage;

    return {
      ...p,
      title,
      badge,
      categoryLabel,
      desc,
      demoUrl,
      githubUrl,
      technologies,
      highlights,
      mainImage,
    };
  });

  const filteredProjects =
    activeFilter === "all"
      ? activeProjects
      : activeProjects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      className="relative bg-slate-50 dark:bg-[#090a10] text-slate-800 dark:text-white pt-28 pb-32 overflow-hidden scroll-mt-20 transition-colors duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle grid line texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 dark:opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 backdrop-blur-md mb-4"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300 font-heading">
              {pSection.section_badge || "03 • Featured Work"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            {pSection.heading ? (
              pSection.heading
            ) : (
              <>
                Selected Projects &{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  Live Software
                </span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            {pSection.subtitle || "A curated showcase of full-stack web applications, real-time messaging engines, and interactive systems built with precision and modern best practices."}
          </motion.p>

          {/* Interactive Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 flex-wrap mt-8"
          >
            {[
              { id: "all", label: "All Projects" },
              { id: "enterprise", label: "Enterprise Systems" },
              { id: "realtime", label: "Real-Time & Messaging" },
              { id: "games", label: "Multiplayer & Games" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterSelect(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-white dark:bg-white/[0.04] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Alternating Editorial Project Showcase */}
        <div className="space-y-16 lg:space-y-24">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = project.icon;

            return (
              <motion.article
                key={project.id}
                id={`project-card-${project.id}`}
                data-project-id={project.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl bg-white/80 dark:bg-[#11121d]/85 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden group hover:border-violet-500/40 dark:hover:border-violet-500/40 transition-[border-color,box-shadow] duration-300 scroll-mt-24"
              >
                {/* Ambient glow in background */}
                <div
                  className={`absolute -top-20 ${
                    isEven ? "-right-20" : "-left-20"
                  } w-80 h-80 ${project.glowColor} rounded-full blur-[100px] pointer-events-none transition-transform duration-700 group-hover:scale-125`}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Visual Mockup Showcase (order flips on alternate cards) */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {/* Browser-styled mock frame */}
                    <div className="relative rounded-2xl bg-slate-900 dark:bg-black/80 border border-slate-700/60 dark:border-slate-800/80 shadow-2xl overflow-hidden group-hover:shadow-violet-900/20 transition-all duration-500">
                      {/* Window header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 dark:bg-[#121320] border-b border-slate-700/60 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        </div>
                        <div className="px-3 py-0.5 rounded-full bg-slate-900/60 dark:bg-white/[0.04] border border-slate-700/50 dark:border-slate-800/60 text-[10px] font-mono text-gray-400">
                          https://{project.id}.app
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      </div>

                      {/* Mockup Canvas: Real Image or Interactive Simulation */}
                      {project.mainImage ? (
                        <div
                          id={`project-canvas-${project.id}`}
                          onClick={() => {
                            if (onOpenProject) {
                              onOpenProject(project.id, { origin: "canvas", cardId: `project-card-${project.id}` });
                            } else {
                              window.location.hash = `#/project/${project.id}`;
                            }
                          }}
                          className="relative aspect-video min-h-[260px] sm:min-h-[300px] w-full overflow-hidden bg-slate-950 cursor-pointer group/canvas"
                        >
                          <img
                            src={project.mainImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover/canvas:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/canvas:opacity-90 transition-opacity flex items-end p-4">
                            <span className="text-xs font-mono text-violet-300 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                              Click to view more images →
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative min-h-[260px] sm:min-h-[300px] p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#141526] to-slate-950">
                          {/* Interactive simulation visuals */}

                          {/* KPI Dashboard Preview */}
                          {project.previewType === "kpi" && (
                            <div className="my-auto space-y-3">
                              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pb-2 border-b border-slate-700/60">
                                <span className="text-violet-400 font-semibold">AMU KPI Dashboard</span>
                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Q3 Review Active</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-center">
                                {[
                                  { label: "KPIs Submitted", val: "124", color: "text-violet-400" },
                                  { label: "Approved", val: "98", color: "text-emerald-400" },
                                  { label: "Pending Review", val: "26", color: "text-amber-400" },
                                ].map((m) => (
                                  <div key={m.label} className="p-2.5 rounded-xl bg-white/[0.04] border border-slate-700/50">
                                    <div className={`text-lg font-bold font-mono ${m.color}`}>{m.val}</div>
                                    <div className="text-[9px] text-gray-400 leading-tight mt-0.5">{m.label}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-1.5">
                                {[
                                  { dept: "Academic Affairs", pct: 92 },
                                  { dept: "Research Office", pct: 74 },
                                  { dept: "Student Services", pct: 61 },
                                ].map((r) => (
                                  <div key={r.dept} className="flex items-center gap-2 text-[10px]">
                                    <span className="text-gray-400 w-28 shrink-0 truncate">{r.dept}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${r.pct}%` }} />
                                    </div>
                                    <span className="text-violet-300 font-mono">{r.pct}%</span>
                                  </div>
                                ))}
                              </div>
                              <div className="text-[10px] font-mono text-gray-500 text-center">Role-Based Access • Approval Workflows • Multi-Level Hierarchy</div>
                            </div>
                          )}

                          {/* Ripple Chat Preview */}
                          {project.previewType === "chat" && (
                            <div className="space-y-3 my-auto">
                              <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Ripple Chat • 3 active conversations</span>
                              </div>
                              <div className="flex items-start gap-2.5 max-w-[85%]">
                                <div className="w-7 h-7 rounded-full bg-cyan-600/40 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-200">
                                  A
                                </div>
                                <div className="p-3 rounded-2xl rounded-tl-none bg-slate-800/60 dark:bg-white/[0.04] border border-slate-700/60 dark:border-slate-800/70 text-xs text-gray-200">
                                  Message delivered instantly via Socket.IO! 🌊
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5 max-w-[85%] ml-auto flex-row-reverse">
                                <div className="w-7 h-7 rounded-full bg-teal-600/40 border border-teal-400/40 flex items-center justify-center text-xs font-bold text-teal-200">
                                  M
                                </div>
                                <div className="p-3 rounded-2xl rounded-tr-none bg-cyan-600/30 border border-cyan-500/30 text-xs text-cyan-100">
                                  Real-time, clean UI, zero lag. Exactly what we needed.
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 pl-9">
                                <span className="italic">Someone is typing</span>
                                <span className="animate-bounce">...</span>
                              </div>
                            </div>
                          )}

                          {/* NPQ Puzzle Game Preview */}
                          {(project.previewType === "game" || project.previewType === "npq") && (
                            <div className="my-auto space-y-3 font-mono">
                              <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1.5 border-b border-slate-700/60">
                                <span className="text-emerald-400 font-bold">NPQ • Game Active</span>
                                <span className="text-amber-400">Streak: 8x 🔥</span>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center space-y-1">
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Target Equation</div>
                                <div className="text-xl sm:text-2xl font-black text-white tracking-widest">
                                  [ ? ] + 14 × 2 = 36
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {[6, 8, 12, 16].map((num) => (
                                  <div
                                    key={num}
                                    className={`py-2 rounded-lg text-center text-xs font-bold ${
                                      num === 8
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300"
                                        : "bg-white/[0.05] text-gray-300 border border-slate-700/50"
                                    }`}
                                  >
                                    {num}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                                <span>Time Remaining: 00:14</span>
                                <span className="text-emerald-400 font-bold">Score: 2,480</span>
                              </div>
                            </div>
                          )}

                          {/* Wholesale ERP Preview */}
                          {project.previewType === "erp" && (
                            <div className="my-auto space-y-3 font-mono text-xs">
                              <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-slate-700/60">
                                <span className="text-amber-400 font-semibold">ERP • Sales Module</span>
                                <span className="text-emerald-400">Branch: HQ</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: "Today's Orders", val: "142", color: "text-amber-400" },
                                  { label: "Revenue", val: "$84.2K", color: "text-emerald-400" },
                                  { label: "Low Stock", val: "7 items", color: "text-rose-400" },
                                  { label: "Pending POs", val: "23", color: "text-violet-400" },
                                ].map((m) => (
                                  <div key={m.label} className="p-2.5 rounded-xl bg-white/[0.04] border border-slate-700/50">
                                    <div className={`text-base font-bold ${m.color}`}>{m.val}</div>
                                    <div className="text-[9px] text-gray-400 mt-0.5">{m.label}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-700/50 space-y-1">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Permission Check</div>
                                <div className="text-[10px] text-emerald-400">✓ sales:create • ✓ inventory:read</div>
                                <div className="text-[10px] text-rose-400">✗ finance:approve (role: Manager)</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Content Description */}
                  <div
                    className={`lg:col-span-6 space-y-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    {/* Badge & Category */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider font-mono border ${project.badgeColor}`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{project.badge}</span>
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
                        {project.categoryLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">
                      {project.desc}
                    </p>

                    {/* Feature Highlights */}
                    <ul className="space-y-2 pt-1">
                      {project.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-gray-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technology Pills */}
                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                        <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        <span>Built With</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/60 dark:border-slate-800/80 text-xs font-mono text-slate-700 dark:text-gray-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-4 pt-3">
                      <button
                        type="button"
                        id={`project-btn-${project.id}`}
                        onClick={() => {
                          if (onOpenProject) {
                            onOpenProject(project.id, { origin: "btn", cardId: `project-card-${project.id}` });
                          } else {
                            window.location.hash = `#/project/${project.id}`;
                          }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs sm:text-sm font-medium shadow-md shadow-violet-600/30 active:scale-95 transition-all duration-200 cursor-pointer"
                      >
                        <span>View More Images</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs sm:text-sm font-medium shadow-sm active:scale-95 transition-all duration-200"
                      >
                        <FaGithub className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* GitHub Repository CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-cyan-500/10 border border-violet-500/20 text-center max-w-3xl mx-auto backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 dark:bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            Looking for more experiments & open-source code?
          </h4>
          <p className="text-sm text-slate-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
            Explore ongoing explorations, utility scripts, and mini-apps on my GitHub repository.
          </p>
          <a
            href="https://github.com/Mati-21"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-sm font-semibold shadow-lg transition-all active:scale-95"
          >
            <FaGithub className="w-4 h-4" />
            <span>Visit GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectSection;
