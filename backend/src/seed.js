require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ── Default content seeded for each portfolio section ──────────────────────
const DEFAULT_CONTENT = [
  // ── Hero section ──
  { section: "hero", key: "name",          value: "Mati Melkamu" },
  { section: "hero", key: "title",         value: "Full-Stack Developer & UI Designer" },
  { section: "hero", key: "subtitle",      value: "Building modern, scalable web applications, robust backend microservices, and interactive user experiences that make a lasting impact." },
  { section: "hero", key: "cta",           value: "Explore Projects" },
  { section: "hero", key: "cta_secondary", value: "Download CV" },
  { section: "hero", key: "cv_url",        value: "/Mati_Melkamu_CV.pdf" },
  { section: "hero", key: "scroll_hint",   value: "Scroll to explore" },

  // ── About section ──
  { section: "about", key: "section_label", value: "01 • About Me" },
  { section: "about", key: "heading",       value: "Hi, I'm Mati Melkamu" },
  { section: "about", key: "bio_p1",        value: "I am a dedicated software developer and UI designer focused on building clean, scalable, and high-impact digital experiences. With deep expertise across the entire stack, I turn complex challenges into elegant, performant code." },
  { section: "about", key: "bio_p2",        value: "Whether creating fluid user interfaces with React and Tailwind CSS or architecting resilient backend microservices with Node.js and MongoDB, I hold myself to the highest standard of craftsmanship, performance, and user satisfaction." },
  { section: "about", key: "avatar",        value: "" },
  { section: "about", key: "badge_hire",    value: "Available for Hire" },
  { section: "about", key: "badge_role",    value: "Full-Stack Engineer" },
  { section: "about", key: "badge_stack",   value: "React • Node • MongoDB" },
  { section: "about", key: "developer_tag", value: "developer.mati" },
  { section: "about", key: "card1_title",   value: "Frontend Engineering" },
  { section: "about", key: "card1_icon",    value: "Code2" },
  { section: "about", key: "card1_desc",    value: "Crafting fluid, high-frame-rate web experiences with React, modern CSS, and Framer Motion." },
  { section: "about", key: "card2_title",   value: "Full-Stack Architecture" },
  { section: "about", key: "card2_icon",    value: "Layers" },
  { section: "about", key: "card2_desc",    value: "Robust backends, scalable RESTful APIs, and performant data structures with Node.js & MongoDB." },
  { section: "about", key: "card3_title",   value: "UI/UX & Modern Aesthetics" },
  { section: "about", key: "card3_icon",    value: "Zap" },
  { section: "about", key: "card3_desc",    value: "Pixel-perfect implementations, glassmorphism, responsive systems, and thoughtful micro-interactions." },
  { section: "about", key: "card4_title",   value: "Speed & Optimization" },
  { section: "about", key: "card4_icon",    value: "Sparkles" },
  { section: "about", key: "card4_desc",    value: "Clean, modular codebases tuned for swift load times, maximum accessibility, and top-tier SEO." },
  { section: "about", key: "stat1_value",   value: "3+" },
  { section: "about", key: "stat1_label",   value: "Years Experience" },
  { section: "about", key: "stat2_value",   value: "15+" },
  { section: "about", key: "stat2_label",   value: "Projects Completed" },
  { section: "about", key: "stat3_value",   value: "100%" },
  { section: "about", key: "stat3_label",   value: "Commitment to Quality" },
  { section: "about", key: "cta_build",     value: "Let's Build Together" },
  { section: "about", key: "cta_projects",  value: "View Projects" },

  // ── Skills section ──
  { section: "skills", key: "section_badge",  value: "02 • Skills & Stack" },
  { section: "skills", key: "heading",        value: "Skills & Technologies" },
  { section: "skills", key: "subtitle",       value: "A comprehensive breakdown of my technical capabilities and core competencies across the modern web stack." },
  { section: "skills", key: "core_skills",    value: "Full-Stack Web Development, Frontend Architecture, Backend & REST API Development, Authentication & Authorization, Role-Based Access Control (RBAC), Database Design & Management, API Integration, Real-Time Applications, Responsive UI Development, System Design & Architecture, Testing & API Validation, Performance & Scalability" },
  { section: "skills", key: "frontend_title", value: "Frontend Development" },
  { section: "skills", key: "frontend_desc",  value: "I build responsive and interactive interfaces with a focus on clean architecture, usability, and reusable components." },
  { section: "skills", key: "frontend_tech",  value: "HTML5, CSS3, JavaScript (ES6+), React, Redux Toolkit, TanStack Query, Tailwind CSS, Bootstrap, Sass, Framer Motion, Vite" },
  { section: "skills", key: "backend_title",  value: "Backend Development" },
  { section: "skills", key: "backend_desc",   value: "I develop RESTful APIs and backend systems with a focus on security, maintainability, and clear business logic." },
  { section: "skills", key: "backend_tech",   value: "Node.js, Express.js, JavaScript, REST APIs, JWT Authentication, Role-Based Access Control, Sequelize, Prisma" },
  { section: "skills", key: "tools_title",    value: "Tools & DevOps" },
  { section: "skills", key: "tools_desc",     value: "Modern development workflows, version control, containerization, and cloud deployment pipelines." },
  { section: "skills", key: "tools_tech",     value: "Git, GitHub, Docker, Postman, Figma, Vercel, Render, AWS, Linux" },

  // ── Projects section ──
  { section: "projects", key: "section_badge", value: "03 • Featured Work" },
  { section: "projects", key: "heading",       value: "My Projects" },
  { section: "projects", key: "subtitle",      value: "A selection of work I've built — from real-time apps to full-stack platforms." },

  // Project 1: AMU KPI Monitoring & Evaluation System
  { section: "projects", key: "proj1_title",      value: "AMU KPI Monitoring & Evaluation System" },
  { section: "projects", key: "proj1_category",   value: "Enterprise & Full-Stack" },
  { section: "projects", key: "proj1_badge",      value: "Institutional Platform" },
  { section: "projects", key: "proj1_desc",       value: "A centralized KPI Monitoring and Evaluation System for Arba Minch University that digitizes the planning, submission, review, approval, and tracking of institutional performance across different organizational levels." },
  { section: "projects", key: "proj1_highlights", value: "Hierarchical organizational structure with configurable roles\nDynamic permissions controlling module and action access\nEnd-to-end KPI planning, submission & approval workflows\nReal-time performance reporting across institutional levels" },
  { section: "projects", key: "proj1_tech",       value: "React, Redux Toolkit, TanStack Query, Node.js, Express.js, PostgreSQL, Sequelize, JWT, Tailwind CSS, Docker" },
  { section: "projects", key: "proj1_demo",       value: "https://github.com/Mati-21" },
  { section: "projects", key: "proj1_github",     value: "https://github.com/Mati-21" },

  // Project 2: Ripple Chat
  { section: "projects", key: "proj2_title",      value: "Ripple Chat" },
  { section: "projects", key: "proj2_category",   value: "Real-Time & Full-Stack" },
  { section: "projects", key: "proj2_badge",      value: "Real-Time Messaging" },
  { section: "projects", key: "proj2_desc",       value: "A real-time messaging application designed for fast and interactive communication between users. Provides a modern chat experience with user authentication, conversations, and real-time message delivery." },
  { section: "projects", key: "proj2_highlights", value: "Instant bidirectional messaging powered by Socket.io\nTyping status and real-time active user detection\nOptimized chat histories stored in MongoDB\nSecure token authentication and responsive dark UI" },
  { section: "projects", key: "proj2_tech",       value: "React, Node.js, Express.js, MongoDB, Socket.IO, Redux Toolkit" },
  { section: "projects", key: "proj2_demo",       value: "https://github.com/Mati-21" },
  { section: "projects", key: "proj2_github",     value: "https://github.com/Mati-21/ripple-chat" },

  // Project 3: NPQ Game (Number Puzzle Quest)
  { section: "projects", key: "proj3_title",      value: "NPQ Game (Number Puzzle Quest)" },
  { section: "projects", key: "proj3_category",   value: "Frontend & Game Engine" },
  { section: "projects", key: "proj3_badge",      value: "Interactive Math Game" },
  { section: "projects", key: "proj3_desc",       value: "An interactive, math-based arcade puzzle game that challenges players to solve numerical problems under time pressure with multiple game modes and progression." },
  { section: "projects", key: "proj3_highlights", value: "Interactive physics-informed puzzle gameplay\nMultiple levels with progressive difficulty\nClean HTML5 Canvas-based rendering\nLightweight zero-dependency architecture" },
  { section: "projects", key: "proj3_tech",       value: "JavaScript (ES6+), React, Tailwind CSS, HTML5 Canvas, Local Storage" },
  { section: "projects", key: "proj3_demo",       value: "https://npq-game-front-end.vercel.app/" },
  { section: "projects", key: "proj3_github",     value: "https://github.com/Mati-21" },

  // Project 4: Wholesale Distribution ERP
  { section: "projects", key: "proj4_title",      value: "Wholesale Distribution ERP" },
  { section: "projects", key: "proj4_category",   value: "Business System & Enterprise" },
  { section: "projects", key: "proj4_badge",      value: "Enterprise ERP" },
  { section: "projects", key: "proj4_desc",       value: "A comprehensive enterprise resource planning system tailored for wholesale distributors, managing inventory, sales orders, purchase orders, branch operations, and financial records." },
  { section: "projects", key: "proj4_highlights", value: "Modular ERP with interconnected business workflows\nPermission-based architecture for granular access control\nMulti-branch support with complex relational data models\nREST APIs with JWT auth, Prisma ORM & Docker deployment" },
  { section: "projects", key: "proj4_tech",       value: "React, Node.js, Express.js, PostgreSQL, Sequelize, Tailwind CSS, Docker" },
  { section: "projects", key: "proj4_demo",       value: "https://github.com/Mati-21" },
  { section: "projects", key: "proj4_github",     value: "https://github.com/Mati-21" },

  // ── Contact section ──
  { section: "contact", key: "heading",         value: "Have Some Questions?" },
  { section: "contact", key: "subtitle",        value: "Feel free to send your message anytime, or reach out directly." },
  { section: "contact", key: "email",           value: "matimelkamu15@gmail.com" },
  { section: "contact", key: "tagline",         value: "I'm always open to exciting ideas and collaborations." },
  { section: "contact", key: "location",        value: "Addis Ababa, Ethiopia" },
  { section: "contact", key: "social_github",   value: "https://github.com/Mati-21" },
  { section: "contact", key: "social_linkedin", value: "https://linkedin.com/in/mati-melkamu" },
  { section: "contact", key: "social_twitter",  value: "https://x.com/mati" },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Seed Admin ──────────────────────────────────────────────────────────
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌  ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.admin.upsert({
    where:  { email: ADMIN_EMAIL },
    update: { password: hashedPassword },
    create: { email: ADMIN_EMAIL, password: hashedPassword },
  });

  console.log(`✅ Admin seeded: ${admin.email}`);

  // ── Seed Default Content ────────────────────────────────────────────────
  let contentCount = 0;
  for (const item of DEFAULT_CONTENT) {
    await prisma.content.upsert({
      where:  { section_key: { section: item.section, key: item.key } },
      update: { value: item.value }, // Update with current portfolio values
      create: item,
    });
    contentCount++;
  }

  console.log(`✅ Content seeded: ${contentCount} rows across 5 sections`);
  console.log("\n✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
