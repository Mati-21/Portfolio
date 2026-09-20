import { motion } from "framer-motion";
import { useState } from "react";
import {
  Code2,
  Server,
  Database,
  ShieldCheck,
  Cloud,
  TestTube2,
  Radio,
  CreditCard,
  Compass,
  CheckCircle2,
  Sparkles,
  Zap,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  Workflow,
  Terminal,
} from "lucide-react";
import { useContent } from "../context/ContentContext";

// 12 Core Skills
const coreSkills = [
  "Full-Stack Web Development",
  "Frontend Architecture",
  "Backend & REST API Development",
  "Authentication & Authorization",
  "Role-Based Access Control (RBAC)",
  "Database Design & Management",
  "API Integration",
  "Real-Time Applications",
  "Responsive UI Development",
  "System Design & Architecture",
  "Testing & API Validation",
  "Performance & Scalability",
];

// Domains
const domains = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: Code2,
    accent: "from-blue-500/20 to-cyan-500/10",
    border: "border-cyan-500/20",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    desc: "I build responsive and interactive interfaces with a focus on clean architecture, usability, and reusable components.",
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "React",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Bootstrap",
      "Sass",
      "Framer Motion",
      "Vite",
    ],
    detailsLabel: "What I work with",
    details: [
      "Component-based architecture",
      "State management",
      "Server-state management",
      "Responsive design",
      "Protected routes",
      "Permission-based UI",
      "Reusable UI components",
      "Animations & micro-interactions",
      "Dashboard and admin interfaces",
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    icon: Server,
    accent: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    desc: "I develop RESTful APIs and backend systems with a focus on security, maintainability, and clear business logic.",
    technologies: [
      "Node.js",
      "Express.js",
      "JavaScript",
      "REST APIs",
      "JWT Authentication",
      "Role-Based Access Control",
      "Sequelize",
      "Prisma",
    ],
    detailsLabel: "Backend Concepts",
    details: [
      "Authentication & authorization",
      "Permission systems",
      "Middleware architecture",
      "API validation",
      "Error handling",
      "Modular architecture",
      "Business logic",
      "File uploads",
      "Payment integrations",
      "API documentation",
    ],
  },
  {
    id: "databases",
    title: "Databases",
    icon: Database,
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    desc: "I work with relational and NoSQL databases and design data models around real-world business requirements.",
    technologies: [
      "PostgreSQL",
      "MongoDB",
      "Prisma ORM",
      "Sequelize ORM",
      "Mongoose",
    ],
    detailsLabel: "Database Skills",
    details: [
      "Relational database design",
      "Data modeling",
      "Relationships & constraints",
      "Transactions",
      "Indexing",
      "Soft deletion / archival",
      "Query optimization",
      "Migration & seeding",
    ],
  },
  {
    id: "security",
    title: "Authentication & Security",
    icon: ShieldCheck,
    accent: "from-rose-500/20 to-red-500/10",
    border: "border-rose-500/20",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    desc: "I build applications where access is controlled by users, roles, and permissions rather than relying on hard-coded UI restrictions.",
    technologies: [
      "JWT Authentication",
      "Access & Refresh Tokens",
      "HTTP-only Cookies",
      "RBAC",
      "Password Hashing",
    ],
    detailsLabel: "Experience with",
    details: [
      "JWT authentication",
      "Access & refresh tokens",
      "HTTP-only cookies",
      "Role-Based Access Control (RBAC)",
      "Permission-based authorization",
      "Protected routes",
      "Password hashing",
      "Forgot-password flows",
      "Permission-based UI",
      "Multi-role users",
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    icon: Cloud,
    accent: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/20",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    desc: "Streamlining development with modern tools, version control standards, and robust deployment patterns.",
    technologies: [
      "Git",
      "GitHub",
      "Docker",
      "Postman",
      "AWS",
      "Cloudinary",
      "VS Code",
      "Vite",
    ],
    detailsLabel: "Development Practices",
    details: [
      "Git-based workflows",
      "Feature branches",
      "API testing",
      "Environment configuration",
      "Containerized development",
      "Deployment workflows",
      "Debugging & troubleshooting",
    ],
  },
  {
    id: "testing",
    title: "Testing & Quality",
    icon: TestTube2,
    accent: "from-indigo-500/20 to-blue-500/10",
    border: "border-indigo-500/20",
    badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    desc: "I use testing and API validation to make applications more reliable, working with both backend and end-to-end user testing.",
    technologies: [
      "Jest",
      "Supertest",
      "Postman",
      "User Acceptance Testing (UAT)",
    ],
    detailsLabel: "Approach & Coverage",
    details: [
      "Backend API testing",
      "End-to-end user acceptance testing",
      "Status code & payload validation",
      "Edge case identification",
      "Regression avoidance",
    ],
  },
  {
    id: "realtime",
    title: "Real-Time & Communication",
    icon: Radio,
    accent: "from-sky-500/20 to-blue-500/10",
    border: "border-sky-500/20",
    badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    desc: "Building interactive experiences that require real-time bi-directional messaging and instantaneous state updates.",
    technologies: ["Socket.IO", "REST APIs", "WebSockets"],
    detailsLabel: "Used for",
    details: [
      "Real-time messaging",
      "Multiplayer interactions",
      "Online status tracking",
      "Live application events",
    ],
  },
  {
    id: "integrations",
    title: "Integrations & APIs",
    icon: CreditCard,
    accent: "from-teal-500/20 to-emerald-500/10",
    border: "border-teal-500/20",
    badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    desc: "Extending application capabilities by integrating trusted third-party payment gateways, CDNs, and transactional services.",
    technologies: [
      "Chapa Payment",
      "Cloudinary",
      "REST APIs",
      "SMTP / Email",
      "File Storage",
    ],
    detailsLabel: "Experience includes",
    details: [
      "Chapa payment integration",
      "Cloudinary media handling",
      "REST API integrations",
      "File and document uploads",
      "Email / SMTP workflows",
    ],
  },
  {
    id: "exploring",
    title: "Currently Exploring",
    icon: Compass,
    accent: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/20",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    desc: "Continuously advancing my engineering depth into distributed systems, scale, and enterprise infrastructure.",
    technologies: [
      "Distributed Systems",
      "System Design",
      "Cloud Infra",
      "High Concurrency",
    ],
    detailsLabel: "Active Areas of Study",
    details: [
      "Advanced system design",
      "Scalable backend architecture",
      "Distributed systems",
      "Cloud infrastructure",
      "High-concurrency applications",
      "Real-time systems",
      "Performance optimization",
      "Production-grade DevOps",
    ],
  },
];

// 6 Development Approach Steps
const approachSteps = [
  {
    number: "01",
    title: "Understand",
    desc: "I start by understanding the problem, requirements, users, and business workflow.",
    color: "from-blue-500/20 to-cyan-500/10",
    borderColor: "border-cyan-500/30",
    numColor: "text-cyan-400",
  },
  {
    number: "02",
    title: "Design",
    desc: "I design the data model, application architecture, API structure, and user experience before implementation.",
    color: "from-violet-500/20 to-indigo-500/10",
    borderColor: "border-violet-500/30",
    numColor: "text-violet-400",
  },
  {
    number: "03",
    title: "Build",
    desc: "I develop modular frontend and backend systems using reusable components and clear separation of responsibilities.",
    color: "from-emerald-500/20 to-teal-500/10",
    borderColor: "border-emerald-500/30",
    numColor: "text-emerald-400",
  },
  {
    number: "04",
    title: "Secure",
    desc: "I implement authentication, authorization, validation, and permission-based access.",
    color: "from-rose-500/20 to-red-500/10",
    borderColor: "border-rose-500/30",
    numColor: "text-rose-400",
  },
  {
    number: "05",
    title: "Test",
    desc: "I validate APIs, business logic, and user workflows to identify problems early.",
    color: "from-amber-500/20 to-yellow-500/10",
    borderColor: "border-amber-500/30",
    numColor: "text-amber-400",
  },
  {
    number: "06",
    title: "Improve",
    desc: "I continuously refine performance, usability, maintainability, and scalability.",
    color: "from-purple-500/20 to-pink-500/10",
    borderColor: "border-purple-500/30",
    numColor: "text-purple-400",
  },
];

function Skills() {
  const { content } = useContent();
  const skills = content?.skills || {};
  const [filter, setFilter] = useState("all");

  const activeCoreSkills = skills.core_skills
    ? skills.core_skills.split(",").map((s) => s.trim()).filter(Boolean)
    : coreSkills;

  const activeDomains = domains.map((d) => {
    const customTitle =
      skills[`${d.id}_title`] ||
      (d.id === "databases" ? skills.database_title : d.id === "devops" ? skills.tools_title : null);
    const customDesc =
      skills[`${d.id}_desc`] ||
      (d.id === "databases" ? skills.database_desc : d.id === "devops" ? skills.tools_desc : null);
    const customTech =
      skills[`${d.id}_tech`] ||
      (d.id === "databases" ? skills.database_tech : d.id === "devops" ? skills.tools_tech : null);
    const customDetails = skills[`${d.id}_details`];
    const customDetailsLabel = skills[`${d.id}_details_label`];

    return {
      ...d,
      title: customTitle || d.title,
      desc: customDesc || d.desc,
      technologies: customTech
        ? customTech.split(",").map((s) => s.trim()).filter(Boolean)
        : d.technologies,
      detailsLabel: customDetailsLabel || d.detailsLabel,
      details: customDetails
        ? customDetails.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
        : d.details,
    };
  });

  const activeApproachSteps = approachSteps.map((step, idx) => {
    const num = idx + 1;
    return {
      ...step,
      title: skills[`step${num}_title`] || step.title,
      desc: skills[`step${num}_desc`] || step.desc,
    };
  });

  const filteredDomains =
    filter === "all"
      ? activeDomains
      : activeDomains.filter((d) => {
          if (filter === "frontend") return d.id === "frontend";
          if (filter === "backend") return d.id === "backend" || d.id === "databases" || d.id === "security";
          if (filter === "devops") return d.id === "devops" || d.id === "testing";
          if (filter === "integrations") return d.id === "realtime" || d.id === "integrations" || d.id === "exploring";
          return true;
        });

  return (
    <section
      id="skills"
      className="relative bg-slate-100/70 dark:bg-[#07080d] text-slate-800 dark:text-white pt-28 pb-24 md:pt-36 md:pb-36 overflow-hidden scroll-mt-20 transition-colors duration-300"
    >
      {/* Ambient background glow & radial lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Background grid line texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 dark:opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 backdrop-blur-md mb-4"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300 font-heading">
              {skills.section_badge || "02 • Skills & Tech Stack"}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            {skills.heading ? (
              skills.heading
            ) : (
              <>
                ⚡ Skills &{" "}
                <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                  Tech Stack
                </span>
              </>
            )}
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl font-medium text-slate-700 dark:text-gray-300 mb-6"
          >
            {skills.subtitle || "Building modern, scalable, and user-focused software"}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
          >
            {skills.description || "I’m a Software Engineering student focused on building full-stack web applications, scalable backend systems, and interactive user experiences. I enjoy turning complex requirements into clean, maintainable, and practical software."}
          </motion.p>
        </div>

        {/* Core Skills Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-white/[0.02] border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl shadow-xl dark:shadow-2xl"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <span className="text-xl">🧠</span>
            <h3 className="font-heading font-semibold text-lg sm:text-xl text-slate-900 dark:text-white">
              Core Skills
            </h3>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {activeCoreSkills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-violet-500/40 text-slate-800 dark:bg-[#121320] dark:border-slate-800/80 dark:text-gray-200 dark:hover:text-white text-xs sm:text-sm font-medium transition-colors duration-150 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>{skill}</span>
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Filter Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-2 flex-wrap mb-10"
        >
          {[
            { id: "all", label: "All Areas" },
            { id: "frontend", label: "Frontend" },
            { id: "backend", label: "Backend & Data" },
            { id: "devops", label: "DevOps & Testing" },
            { id: "integrations", label: "Real-Time & APIs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                filter === tab.id
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-white dark:bg-white/[0.04] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Detailed Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredDomains.map((domain, index) => {
            const IconComponent = domain.icon;

            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.95, delay: (index % 3) * 0.14, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col justify-between p-6 rounded-3xl bg-white/90 dark:bg-gradient-to-br ${domain.accent} dark:bg-[#10111d]/90 border border-slate-200/60 dark:border-slate-800/60 ${domain.border} backdrop-blur-xl shadow-md dark:shadow-xl hover:shadow-xl hover:border-violet-500/40 dark:hover:border-violet-500/40 transition-[border-color,box-shadow,background-color] duration-200 group`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/60 dark:border-slate-800/80 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5 text-slate-800 dark:text-white" />
                      </div>
                      <h4 className="font-heading font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                        {domain.title}
                      </h4>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-5 leading-relaxed">
                    {domain.desc}
                  </p>

                  {/* Technologies Tags */}
                  <div className="mb-5">
                    <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      <span>Technologies</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {domain.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-gray-200 text-xs font-mono font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* What I work with / Concepts */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                    <span>{domain.detailsLabel}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {domain.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-700 dark:text-gray-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400/80 mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 🛠️ My Development Approach */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 backdrop-blur-md mb-3">
              <Workflow className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-indigo-300 font-heading">
                Process & Methodology
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3">
              🛠️ My Development Approach
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
              A structured, engineering-first roadmap for taking projects from concept to production.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeApproachSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, delay: (idx % 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`p-6 rounded-3xl bg-white/90 dark:bg-gradient-to-br ${step.color} dark:bg-[#10111d]/90 border border-slate-200/60 dark:border-slate-800/60 ${step.borderColor} backdrop-blur-xl shadow-md hover:shadow-xl transition-[border-color,box-shadow,background-color] duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-2xl font-heading font-extrabold ${step.numColor}`}>
                    {step.number}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-gray-400">
                    Phase {step.number}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 💡 Philosophy Card */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-violet-100 via-white to-cyan-100 border border-violet-200 shadow-xl dark:from-violet-950/40 dark:via-[#121320] dark:to-cyan-950/40 dark:border-violet-500/30 backdrop-blur-2xl dark:shadow-2xl text-center max-w-4xl mx-auto overflow-hidden"
        >
          {/* Subtle light accents */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 mx-auto mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Technologies are tools.{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 dark:from-amber-300 dark:via-orange-300 dark:to-rose-300 bg-clip-text text-transparent">
                Problem-solving is the real skill.
              </span>
            </h3>

            <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              I focus on understanding <strong className="text-slate-900 dark:text-white font-semibold">why</strong> something
              should be built before deciding <strong className="text-slate-900 dark:text-white font-semibold">how</strong> to build it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
