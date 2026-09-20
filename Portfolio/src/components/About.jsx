import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Layers,
  Zap,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import profileImg from "../asset/profile.png";
import { scrollToContactRevealed } from "../utils/scrollHelper";
import { useContent } from "../context/ContentContext";

const iconMap = {
  Code2,
  Layers,
  Zap,
  Sparkles,
};

function About() {
  const { content, resolveMediaUrl } = useContent();
  const about = content?.about || {};

  const cards = [
    {
      icon: iconMap[about.card1_icon] || Code2,
      title: about.card1_title || "Frontend Engineering",
      desc: about.card1_desc || "Crafting fluid, high-frame-rate web experiences with React, modern CSS, and Framer Motion.",
      color: "from-violet-500/20 to-indigo-500/10",
      iconColor: "text-violet-400",
      borderColor: "border-violet-500/20",
    },
    {
      icon: iconMap[about.card2_icon] || Layers,
      title: about.card2_title || "Full-Stack Architecture",
      desc: about.card2_desc || "Robust backends, scalable RESTful APIs, and performant data structures with Node.js & MongoDB.",
      color: "from-cyan-500/20 to-blue-500/10",
      iconColor: "text-cyan-400",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: iconMap[about.card3_icon] || Zap,
      title: about.card3_title || "UI/UX & Modern Aesthetics",
      desc: about.card3_desc || "Pixel-perfect implementations, glassmorphism, responsive systems, and thoughtful micro-interactions.",
      color: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/20",
    },
    {
      icon: iconMap[about.card4_icon] || Sparkles,
      title: about.card4_title || "Speed & Optimization",
      desc: about.card4_desc || "Clean, modular codebases tuned for swift load times, maximum accessibility, and top-tier SEO.",
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
  ];

  const stats = [
    { value: about.stat1_value || "3+", label: about.stat1_label || "Years Experience" },
    { value: about.stat2_value || "15+", label: about.stat2_label || "Projects Completed" },
    { value: about.stat3_value || "100%", label: about.stat3_label || "Commitment to Quality" },
  ];

  const avatarSrc = (about.avatar && resolveMediaUrl(about.avatar)) || profileImg;

  return (
    <section
      id="about"
      className="relative bg-slate-50 dark:bg-[#090a10] text-slate-800 dark:text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden scroll-mt-0 transition-colors duration-300"
    >
      {/* Ambient background glow & radial lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative subtle grid line texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 dark:opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300 font-heading">
              {about.section_label || "01 • About Me"}
            </span>
          </motion.div>
        </div>

        {/* Main Grid: Portrait & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Premium Architectural Portrait Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.05, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-start lg:sticky lg:top-24 -mt-1 lg:-mt-2"
          >
            {/* Outer Wrapper with soft ambient lighting */}
            <div className="relative w-full max-w-[310px] sm:max-w-[340px] group">
              {/* Diffuse glowing backlight behind the portrait */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-cyan-400/30 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition duration-700 pointer-events-none" />

              {/* Main Portrait Frame with modern dual-gradient border */}
              <div className="relative rounded-[2.5rem] p-[1.5px] bg-gradient-to-b from-violet-500/40 via-slate-200/40 dark:via-white/10 to-cyan-500/40 shadow-2xl shadow-violet-500/10 dark:shadow-cyan-900/20">
                {/* Inner Container */}
                <div className="relative rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-[#11121d] dark:via-[#0c0d16] dark:to-[#08080f] aspect-[4/5] flex items-end justify-center border border-white/60 dark:border-white/[0.04]">
                  {/* Studio ambient glow backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.18),transparent_70%)] pointer-events-none" />
                  <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent pointer-events-none" />

                  {/* Profile Image with subtle depth and smooth zoom on hover */}
                  <img
                    src={avatarSrc}
                    alt="Portrait"
                    className="relative z-10 w-full h-full object-cover object-[center_12%] drop-shadow-xl group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gentle bottom shadow blend */}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900/40 dark:from-[#08080f]/80 via-transparent to-transparent z-10 pointer-events-none" />

                  {/* Sleek top-left developer identity badge */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-gray-300 shadow-sm">
                      {about.developer_tag || "developer.mati"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right - Availability (Clickable link to contact) */}
              <a
                href="#contact"
                title="Click to hire me"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToContactRevealed();
                }}
                className="absolute -top-3 -right-2 sm:-right-3 z-30 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#151624]/95 border border-emerald-500/40 dark:border-emerald-500/30 backdrop-blur-xl shadow-lg shadow-emerald-500/10 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 group-hover:underline">
                  {about.badge_hire || "Available for Hire"}
                </span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Bio, Capabilities & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-slate-900 dark:text-white">
                {about.heading ? (
                  about.heading.startsWith("Hi, I'm ") ? (
                    <>
                      Hi, I'm{" "}
                      <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-300 bg-clip-text text-transparent">
                        {about.heading.replace("Hi, I'm ", "")}
                      </span>
                    </>
                  ) : (
                    about.heading
                  )
                ) : (
                  <>
                    Hi, I'm{" "}
                    <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:to-cyan-300 bg-clip-text text-transparent">
                      {about.heading_name || "Mati Melkamu"}
                    </span>
                  </>
                )}
              </h3>

              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                {about.bio_p1 || "I am a dedicated software developer and UI designer focused on building clean, scalable, and high-impact digital experiences. With deep expertise across the entire stack, I turn complex challenges into elegant, performant code."}
              </p>

              <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                {about.bio_p2 || "Whether creating fluid user interfaces with React and Tailwind CSS or architecting resilient backend microservices with Node.js and MongoDB, I hold myself to the highest standard of craftsmanship, performance, and user satisfaction."}
              </p>
            </motion.div>

            {/* 4 Feature Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {cards.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.9, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-gradient-to-br ${item.color} dark:bg-white/[0.02] border border-slate-200/60 dark:border-slate-800/60 ${item.borderColor} backdrop-blur-md hover:border-violet-500/40 dark:hover:border-violet-500/40 hover:shadow-lg dark:hover:bg-white/[0.04] transition-[border-color,box-shadow,background-color] duration-200 group shadow-sm`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats Counter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-3 sm:gap-4 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl font-heading font-bold bg-gradient-to-r from-violet-600 to-cyan-600 dark:from-violet-300 dark:to-cyan-200 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-600 dark:text-gray-400 mt-0.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 pt-1"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToContactRevealed();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{about.cta_build || "Let's Build Together"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/10 dark:text-white dark:border-slate-800 dark:hover:border-slate-700 font-medium text-xs sm:text-sm backdrop-blur-md shadow-sm active:scale-95 transition-all duration-200"
              >
                <span>{about.cta_projects || "View Projects"}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
