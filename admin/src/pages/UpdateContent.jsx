import { useEffect, useState, useRef } from "react";
import { contentApi, uploadApi } from "../api/client";
import {
  PenSquare,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Upload,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  ChevronDown,
  Layout,
  Images,
  Sparkles,
  ExternalLink,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Granular Section Definitions ──────────────────────────────────────────
const SECTIONS = [
  {
    id: "hero",
    label: "Hero",
    emoji: "🏠",
    description: "The first thing visitors see",
    groups: [
      {
        title: "Hero Information",
        description: "Primary intro and headlines for the landing view",
        fields: [
          { key: "name", label: "Your Name", type: "text", placeholder: "Mati Melkamu" },
          { key: "title", label: "Job Title / Role", type: "text", placeholder: "Full-Stack Developer & UI Designer" },
          { key: "subtitle", label: "Bio / Tagline Paragraph", type: "textarea", placeholder: "Building modern, scalable web applications, robust backend microservices..." },
        ],
      },
      {
        title: "Call to Action Buttons",
        description: "Button labels and CV download link",
        fields: [
          { key: "cta", label: "Primary Button (Explore Projects)", type: "text", placeholder: "Explore Projects" },
          { key: "cta_secondary", label: "Secondary Button Label (Download CV)", type: "text", placeholder: "Download CV" },
          { key: "cv_url", label: "CV Download Link / File URL", type: "text", placeholder: "/Mati_Melkamu_CV.pdf", hint: "Path to PDF in public folder (e.g. /Mati_Melkamu_CV.pdf) or external URL (e.g. Google Drive, Dropbox)" },
          { key: "scroll_hint", label: "Scroll Indicator Text", type: "text", placeholder: "Scroll to explore" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    emoji: "👤",
    description: "Your background, portrait, capabilities & stats",
    groups: [
      {
        title: "Section Header & Bio",
        description: "Main headlines and paragraphs for the About section",
        fields: [
          { key: "section_label", label: "Section Badge Label", type: "text", placeholder: "01 • About Me" },
          { key: "heading", label: "Main Greeting / Title", type: "text", placeholder: "Hi, I'm Mati Melkamu" },
          { key: "bio_p1", label: "Bio Paragraph 1", type: "textarea", placeholder: "I am a dedicated software developer and UI designer focused on..." },
          { key: "bio_p2", label: "Bio Paragraph 2", type: "textarea", placeholder: "Whether creating fluid user interfaces with React and Tailwind CSS or architecting..." },
        ],
      },
      {
        title: "Avatar & Portrait Showcase",
        description: "Upload your profile image and customize floating badges",
        fields: [
          { key: "avatar", label: "Profile Avatar Image", type: "image", placeholder: "Upload or paste image URL", hint: "Recommended: square PNG, JPG, or HEIC, at least 400x400px" },
          { key: "developer_tag", label: "Card Header Tag", type: "text", placeholder: "developer.mati" },
          { key: "badge_hire", label: "Availability Badge (Top Right)", type: "text", placeholder: "Available for Hire" },
          { key: "badge_role", label: "Role Title Badge (Bottom Left)", type: "text", placeholder: "Full-Stack Engineer" },
          { key: "badge_stack", label: "Tech Stack Subtitle (Bottom Left)", type: "text", placeholder: "React • Node • MongoDB" },
        ],
      },
      {
        title: "4 Feature Highlight Cards",
        description: "Custom titles, descriptions and icon names for each highlight card",
        fields: [
          { key: "card1_title", label: "Card 1 Title", type: "text", placeholder: "Frontend Engineering" },
          { key: "card1_icon", label: "Card 1 Icon", type: "text", placeholder: "Code2" },
          { key: "card1_desc", label: "Card 1 Description", type: "textarea", placeholder: "Crafting fluid, high-frame-rate web experiences with React..." },

          { key: "card2_title", label: "Card 2 Title", type: "text", placeholder: "Full-Stack Architecture" },
          { key: "card2_icon", label: "Card 2 Icon", type: "text", placeholder: "Layers" },
          { key: "card2_desc", label: "Card 2 Description", type: "textarea", placeholder: "Robust backends, scalable RESTful APIs, and performant data structures..." },

          { key: "card3_title", label: "Card 3 Title", type: "text", placeholder: "UI/UX & Modern Aesthetics" },
          { key: "card3_icon", label: "Card 3 Icon", type: "text", placeholder: "Zap" },
          { key: "card3_desc", label: "Card 3 Description", type: "textarea", placeholder: "Pixel-perfect implementations, glassmorphism, responsive systems..." },

          { key: "card4_title", label: "Card 4 Title", type: "text", placeholder: "Speed & Optimization" },
          { key: "card4_icon", label: "Card 4 Icon", type: "text", placeholder: "Sparkles" },
          { key: "card4_desc", label: "Card 4 Description", type: "textarea", placeholder: "Clean, modular codebases tuned for swift load times, maximum accessibility..." },
        ],
      },
      {
        title: "Stats Counter & Action Buttons",
        description: "Experience numbers and call-to-action buttons below the bio",
        fields: [
          { key: "stat1_value", label: "Stat 1 Value", type: "text", placeholder: "3+" },
          { key: "stat1_label", label: "Stat 1 Label", type: "text", placeholder: "Years Experience" },
          { key: "stat2_value", label: "Stat 2 Value", type: "text", placeholder: "15+" },
          { key: "stat2_label", label: "Stat 2 Label", type: "text", placeholder: "Projects Completed" },
          { key: "stat3_value", label: "Stat 3 Value", type: "text", placeholder: "100%" },
          { key: "stat3_label", label: "Stat 3 Label", type: "text", placeholder: "Commitment to Quality" },
          { key: "cta_build", label: "Primary Button (Let's Build)", type: "text", placeholder: "Let's Build Together" },
          { key: "cta_projects", label: "Secondary Button (View Projects)", type: "text", placeholder: "View Projects" },
        ],
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    emoji: "⚡",
    description: "Core competencies, 9 domain technology cards, and development methodology",
    groups: [
      {
        id: "overview",
        emoji: "⚡",
        title: "Overview & Core Competencies",
        description: "Section badges, headline, subtitle, and list of core competencies",
        fields: [
          { key: "section_badge", label: "Section Badge Pill", type: "text", placeholder: "02 • Skills & Tech Stack" },
          { key: "heading", label: "Section Heading", type: "text", placeholder: "Skills & Technologies" },
          { key: "subtitle", label: "Section Subtitle Paragraph", type: "textarea", placeholder: "A comprehensive breakdown of my technical capabilities..." },
          { key: "core_skills", label: "Core Competencies (comma separated)", type: "textarea", placeholder: "Full-Stack Web Development, Frontend Architecture, Backend & REST API Development, Authentication & Authorization, Role-Based Access Control (RBAC), Database Design & Management, API Integration, Real-Time Applications, Responsive UI Development, System Design & Architecture, Testing & API Validation, Performance & Scalability" },
        ],
      },
      {
        id: "frontend",
        emoji: "🌐",
        title: "Card 1: Frontend Development",
        description: "Responsive layouts, reactive state, and modern UI systems",
        fields: [
          { key: "frontend_title", label: "Card Title", type: "text", placeholder: "Frontend Development" },
          { key: "frontend_desc", label: "Description Paragraph", type: "textarea", placeholder: "I build responsive and interactive interfaces with a focus on clean architecture, usability, and reusable components." },
          { key: "frontend_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "HTML5, CSS3, JavaScript (ES6+), React, Redux Toolkit, TanStack Query, Tailwind CSS, Bootstrap, Sass, Framer Motion, Vite" },
          { key: "frontend_details_label", label: "Key Concepts Label", type: "text", placeholder: "What I work with" },
          { key: "frontend_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Component-based architecture, State management, Server-state management, Responsive design, Protected routes, Permission-based UI, Reusable UI components, Animations & micro-interactions, Dashboard and admin interfaces" },
        ],
      },
      {
        id: "backend",
        emoji: "⚙️",
        title: "Card 2: Backend Development",
        description: "RESTful services, server architectures, and business logic",
        fields: [
          { key: "backend_title", label: "Card Title", type: "text", placeholder: "Backend Development" },
          { key: "backend_desc", label: "Description Paragraph", type: "textarea", placeholder: "I develop RESTful APIs and backend systems with a focus on security, maintainability, and clear business logic." },
          { key: "backend_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Node.js, Express.js, JavaScript, REST APIs, JWT Authentication, Role-Based Access Control, Sequelize, Prisma" },
          { key: "backend_details_label", label: "Key Concepts Label", type: "text", placeholder: "Backend Concepts" },
          { key: "backend_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Authentication & authorization, Permission systems, Middleware architecture, API validation, Error handling, Modular architecture, Business logic, File uploads, Payment integrations, API documentation" },
        ],
      },
      {
        id: "databases",
        emoji: "🗄️",
        title: "Card 3: Databases & Data Modeling",
        description: "Relational schemas, ORM integrations, and document stores",
        fields: [
          { key: "databases_title", label: "Card Title", type: "text", placeholder: "Databases" },
          { key: "databases_desc", label: "Description Paragraph", type: "textarea", placeholder: "I work with relational and NoSQL databases and design data models around real-world business requirements." },
          { key: "databases_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "PostgreSQL, MongoDB, Prisma ORM, Sequelize ORM, Mongoose" },
          { key: "databases_details_label", label: "Key Concepts Label", type: "text", placeholder: "Database Skills" },
          { key: "databases_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Relational database design, Data modeling, Relationships & constraints, Transactions, Indexing, Soft deletion / archival, Query optimization, Migration & seeding" },
        ],
      },
      {
        id: "security",
        emoji: "🔒",
        title: "Card 4: Authentication & Security",
        description: "RBAC, token lifecycles, and permission-based authorization",
        fields: [
          { key: "security_title", label: "Card Title", type: "text", placeholder: "Authentication & Security" },
          { key: "security_desc", label: "Description Paragraph", type: "textarea", placeholder: "I build applications where access is controlled by users, roles, and permissions rather than relying on hard-coded UI restrictions." },
          { key: "security_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "JWT Authentication, Access & Refresh Tokens, HTTP-only Cookies, RBAC, Password Hashing" },
          { key: "security_details_label", label: "Key Concepts Label", type: "text", placeholder: "Experience with" },
          { key: "security_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "JWT authentication, Access & refresh tokens, HTTP-only cookies, Role-Based Access Control (RBAC), Permission-based authorization, Protected routes, Password hashing, Forgot-password flows, Permission-based UI, Multi-role users" },
        ],
      },
      {
        id: "devops",
        emoji: "☁️",
        title: "Card 5: DevOps & Tools",
        description: "Containerization, cloud workflows, and developer tooling",
        fields: [
          { key: "devops_title", label: "Card Title", type: "text", placeholder: "DevOps & Tools" },
          { key: "devops_desc", label: "Description Paragraph", type: "textarea", placeholder: "Streamlining development with modern tools, version control standards, and robust deployment patterns." },
          { key: "devops_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Git, GitHub, Docker, Postman, AWS, Cloudinary, VS Code, Vite" },
          { key: "devops_details_label", label: "Key Concepts Label", type: "text", placeholder: "Development Practices" },
          { key: "devops_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Git-based workflows, Feature branches, API testing, Environment configuration, Containerized development, Deployment workflows, Debugging & troubleshooting" },
        ],
      },
      {
        id: "testing",
        emoji: "🧪",
        title: "Card 6: Testing & Quality",
        description: "API validation, test suites, and regression avoidance",
        fields: [
          { key: "testing_title", label: "Card Title", type: "text", placeholder: "Testing & Quality" },
          { key: "testing_desc", label: "Description Paragraph", type: "textarea", placeholder: "I use testing and API validation to make applications more reliable, working with both backend and end-to-end user testing." },
          { key: "testing_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Jest, Supertest, Postman, User Acceptance Testing (UAT)" },
          { key: "testing_details_label", label: "Key Concepts Label", type: "text", placeholder: "Approach & Coverage" },
          { key: "testing_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Backend API testing, End-to-end user acceptance testing, Status code & payload validation, Edge case identification, Regression avoidance" },
        ],
      },
      {
        id: "realtime",
        emoji: "📡",
        title: "Card 7: Real-Time & Communication",
        description: "WebSockets, live messaging engines, and streaming events",
        fields: [
          { key: "realtime_title", label: "Card Title", type: "text", placeholder: "Real-Time & Communication" },
          { key: "realtime_desc", label: "Description Paragraph", type: "textarea", placeholder: "Building interactive experiences that require real-time bi-directional messaging and instantaneous state updates." },
          { key: "realtime_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Socket.IO, REST APIs, WebSockets" },
          { key: "realtime_details_label", label: "Key Concepts Label", type: "text", placeholder: "Used for" },
          { key: "realtime_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Real-time messaging, Multiplayer interactions, Online status tracking, Live application events" },
        ],
      },
      {
        id: "integrations",
        emoji: "💳",
        title: "Card 8: Integrations & APIs",
        description: "Payment gateways, cloud storage, and transactional messaging",
        fields: [
          { key: "integrations_title", label: "Card Title", type: "text", placeholder: "Integrations & APIs" },
          { key: "integrations_desc", label: "Description Paragraph", type: "textarea", placeholder: "Extending application capabilities by integrating trusted third-party payment gateways, CDNs, and transactional services." },
          { key: "integrations_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Chapa Payment, Cloudinary, REST APIs, SMTP / Email, File Storage" },
          { key: "integrations_details_label", label: "Key Concepts Label", type: "text", placeholder: "Experience includes" },
          { key: "integrations_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Chapa payment integration, Cloudinary media handling, REST API integrations, File and document uploads, Email / SMTP workflows" },
        ],
      },
      {
        id: "exploring",
        emoji: "🧭",
        title: "Card 9: Currently Exploring",
        description: "Distributed systems, scale, and enterprise infrastructure",
        fields: [
          { key: "exploring_title", label: "Card Title", type: "text", placeholder: "Currently Exploring" },
          { key: "exploring_desc", label: "Description Paragraph", type: "textarea", placeholder: "Continuously advancing my engineering depth into distributed systems, scale, and enterprise infrastructure." },
          { key: "exploring_tech", label: "Technologies (comma separated)", type: "textarea", placeholder: "Distributed Systems, System Design, Cloud Infra, High Concurrency" },
          { key: "exploring_details_label", label: "Key Concepts Label", type: "text", placeholder: "Active Areas of Study" },
          { key: "exploring_details", label: "Key Concepts / Bullet Points (comma or line separated)", type: "textarea", placeholder: "Advanced system design, Scalable backend architecture, Distributed systems, Cloud infrastructure, High-concurrency applications, Real-time systems, Performance optimization, Production-grade DevOps" },
        ],
      },
      {
        id: "approach",
        emoji: "🛠️",
        title: "Development Approach (6 Steps)",
        description: "Engineering-first roadmap: Understand, Design, Build, Secure, Test, Improve",
        fields: [
          { key: "step1_title", label: "Phase 01 Title", type: "text", placeholder: "Understand" },
          { key: "step1_desc", label: "Phase 01 Description", type: "textarea", placeholder: "I start by understanding the problem, requirements, users, and business workflow." },
          { key: "step2_title", label: "Phase 02 Title", type: "text", placeholder: "Design" },
          { key: "step2_desc", label: "Phase 02 Description", type: "textarea", placeholder: "I design the data model, application architecture, API structure, and user experience before implementation." },
          { key: "step3_title", label: "Phase 03 Title", type: "text", placeholder: "Build" },
          { key: "step3_desc", label: "Phase 03 Description", type: "textarea", placeholder: "I develop modular frontend and backend systems using reusable components and clear separation of responsibilities." },
          { key: "step4_title", label: "Phase 04 Title", type: "text", placeholder: "Secure" },
          { key: "step4_desc", label: "Phase 04 Description", type: "textarea", placeholder: "I implement authentication, authorization, validation, and permission-based access." },
          { key: "step5_title", label: "Phase 05 Title", type: "text", placeholder: "Test" },
          { key: "step5_desc", label: "Phase 05 Description", type: "textarea", placeholder: "I validate APIs, business logic, and user workflows to identify problems early." },
          { key: "step6_title", label: "Phase 06 Title", type: "text", placeholder: "Improve" },
          { key: "step6_desc", label: "Phase 06 Description", type: "textarea", placeholder: "I continuously refine performance, usability, maintainability, and scalability." },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    emoji: "🚀",
    description: "Featured project cards, main showcase images, and detail gallery screenshots",
    groups: [
      {
        title: "Section Heading",
        description: "Headings for the projects section",
        fields: [
          { key: "section_badge", label: "Section Badge", type: "text", placeholder: "03 • Featured Work" },
          { key: "heading", label: "Section Heading", type: "text", placeholder: "My Projects" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", placeholder: "A selection of work I've built — from real-time apps to full-stack platforms." },
        ],
      },
      // ── Project 1: AMU KPI Monitoring & Evaluation System ──
      {
        title: "Project 1: AMU KPI Monitoring — Details & Links",
        description: "Core text and repository links",
        fields: [
          { key: "proj1_title", label: "Project Title", type: "text", placeholder: "AMU KPI Monitoring & Evaluation System" },
          { key: "proj1_category", label: "Category Label", type: "text", placeholder: "Enterprise & Full-Stack" },
          { key: "proj1_badge", label: "Badge Pill", type: "text", placeholder: "Institutional Platform" },
          { key: "proj1_desc", label: "Project Description", type: "textarea", placeholder: "A centralized KPI Monitoring and Evaluation System for Arba Minch University that digitizes the planning, submission, review, approval, and tracking of institutional performance across different organizational levels." },
          { key: "proj1_highlights", label: "Feature Highlights / Bullet Points (one per line)", type: "textarea", placeholder: "Hierarchical organizational structure with configurable roles\nDynamic permissions controlling module and action access\nEnd-to-end KPI planning, submission & approval workflows\nReal-time performance reporting across institutional levels", hint: "One highlight per line. These appear as the green checkmark bullet list on the project card." },
          { key: "proj1_tech", label: "Technologies (comma separated)", type: "text", placeholder: "React, Redux Toolkit, TanStack Query, Node.js, Express.js, PostgreSQL, Sequelize, JWT, Tailwind CSS, Docker" },
          { key: "proj1_demo", label: "Live Demo URL", type: "text", placeholder: "https://github.com/Mati-21" },
          { key: "proj1_github", label: "GitHub Repository URL", type: "text", placeholder: "https://github.com/Mati-21" },
        ],
      },
      {
        title: "Project 1: Main Card & Featured Showcase Image",
        description: "Upload or provide image URL for the main portfolio card and detail page hero",
        fields: [
          { key: "proj1_main_image", label: "Project 1 Main Card Image", type: "image", placeholder: "https://example.com/amu-kpi-main.png", hint: "Displayed on the main portfolio card & top of project detail page (16:9 ratio recommended)" },
        ],
      },
      {
        title: "Project 1: Detail Page Gallery Screenshots",
        description: "Upload or provide up to 4 high-res screenshots for the project detail gallery",
        fields: [
          { key: "proj1_gallery_img1", label: "Gallery Screenshot Slot #1", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj1_gallery_title1", label: "Screenshot 1 Title", type: "text", placeholder: "Executive KPI Dashboard" },
          { key: "proj1_gallery_caption1", label: "Screenshot 1 Caption", type: "textarea", placeholder: "Institutional performance overview displaying quarterly milestones, progress meters, and status summaries." },

          { key: "proj1_gallery_img2", label: "Gallery Screenshot Slot #2", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj1_gallery_title2", label: "Screenshot 2 Title", type: "text", placeholder: "Multi-Tier Approval Pipeline" },
          { key: "proj1_gallery_caption2", label: "Screenshot 2 Caption", type: "textarea", placeholder: "Hierarchical review screen where department chairs, deans, and university directors evaluate and approve KPI submissions." },

          { key: "proj1_gallery_img3", label: "Gallery Screenshot Slot #3", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj1_gallery_title3", label: "Screenshot 3 Title", type: "text", placeholder: "Dynamic Permissions Matrix" },
          { key: "proj1_gallery_caption3", label: "Screenshot 3 Caption", type: "textarea", placeholder: "Granular access configuration allowing administrators to tailor module-level actions per institutional role." },

          { key: "proj1_gallery_img4", label: "Gallery Screenshot Slot #4", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj1_gallery_title4", label: "Screenshot 4 Title", type: "text", placeholder: "Analytical Reporting & Metrics Export" },
          { key: "proj1_gallery_caption4", label: "Screenshot 4 Caption", type: "textarea", placeholder: "Comparative institutional analytics contrasting planned targets against verified achievements with data export." },
        ],
      },

      // ── Project 2: Ripple Chat ──
      {
        title: "Project 2: Ripple Chat — Details & Links",
        description: "Core text and repository links",
        fields: [
          { key: "proj2_title", label: "Project Title", type: "text", placeholder: "Ripple Chat" },
          { key: "proj2_category", label: "Category Label", type: "text", placeholder: "Real-Time & Full-Stack" },
          { key: "proj2_badge", label: "Badge Pill", type: "text", placeholder: "Real-Time Messaging" },
          { key: "proj2_desc", label: "Project Description", type: "textarea", placeholder: "A real-time messaging application designed for fast and interactive communication between users. Provides a modern chat experience with user authentication, conversations, and real-time message delivery." },
          { key: "proj2_highlights", label: "Feature Highlights / Bullet Points (one per line)", type: "textarea", placeholder: "Instant bidirectional messaging powered by Socket.io\nTyping status and real-time active user detection\nOptimized chat histories stored in MongoDB\nSecure token authentication and responsive dark UI", hint: "One highlight per line. These appear as the green checkmark bullet list on the project card." },
          { key: "proj2_tech", label: "Technologies (comma separated)", type: "text", placeholder: "React, Node.js, Express.js, MongoDB, Socket.IO, Redux Toolkit" },
          { key: "proj2_demo", label: "Live Demo URL", type: "text", placeholder: "https://demo.example.com" },
          { key: "proj2_github", label: "GitHub Repository URL", type: "text", placeholder: "https://github.com/Mati-21/ripple-chat" },
        ],
      },
      {
        title: "Project 2: Main Card & Featured Showcase Image",
        description: "Upload or provide image URL for the main portfolio card and detail page hero",
        fields: [
          { key: "proj2_main_image", label: "Project 2 Main Card Image", type: "image", placeholder: "https://example.com/ripple-chat-main.png", hint: "Displayed on the main portfolio card & top of project detail page (16:9 ratio recommended)" },
        ],
      },
      {
        title: "Project 2: Detail Page Gallery Screenshots",
        description: "Upload or provide up to 4 high-res screenshots for the project detail gallery",
        fields: [
          { key: "proj2_gallery_img1", label: "Gallery Screenshot Slot #1", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj2_gallery_title1", label: "Screenshot 1 Title", type: "text", placeholder: "Live Chat Interface" },
          { key: "proj2_gallery_caption1", label: "Screenshot 1 Caption", type: "textarea", placeholder: "Minimalist, responsive messaging window with real-time dispatch, scroll sync, and formatted messages." },

          { key: "proj2_gallery_img2", label: "Gallery Screenshot Slot #2", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj2_gallery_title2", label: "Screenshot 2 Title", type: "text", placeholder: "Conversations & Active Contacts" },
          { key: "proj2_gallery_caption2", label: "Screenshot 2 Caption", type: "textarea", placeholder: "Clean sidebar showing ongoing conversations, presence indicators, and unread notification badges." },

          { key: "proj2_gallery_img3", label: "Gallery Screenshot Slot #3", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj2_gallery_title3", label: "Screenshot 3 Title", type: "text", placeholder: "Security & Session Authentication" },
          { key: "proj2_gallery_caption3", label: "Screenshot 3 Caption", type: "textarea", placeholder: "Secure login flow with JWT authentication and password hashing protection." },

          { key: "proj2_gallery_img4", label: "Gallery Screenshot Slot #4", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj2_gallery_title4", label: "Screenshot 4 Title", type: "text", placeholder: "Instant Typing & Dispatch Stream" },
          { key: "proj2_gallery_caption4", label: "Screenshot 4 Caption", type: "textarea", placeholder: "Live socket events broadcasting real-time typing status and instant delivery feedback." },
        ],
      },

      // ── Project 3: NPQ Game ──
      {
        title: "Project 3: NPQ Game — Details & Links",
        description: "Core text and repository links",
        fields: [
          { key: "proj3_title", label: "Project Title", type: "text", placeholder: "NPQ Game (Number Puzzle Quest)" },
          { key: "proj3_category", label: "Category Label", type: "text", placeholder: "Frontend & Game Engine" },
          { key: "proj3_badge", label: "Badge Pill", type: "text", placeholder: "Interactive Math Game" },
          { key: "proj3_desc", label: "Project Description", type: "textarea", placeholder: "An interactive, math-based arcade puzzle game that challenges players to solve numerical problems under time pressure with multiple game modes and progression." },
          { key: "proj3_highlights", label: "Feature Highlights / Bullet Points (one per line)", type: "textarea", placeholder: "Interactive physics-informed puzzle gameplay\nMultiple levels with progressive difficulty\nClean HTML5 Canvas-based rendering\nLightweight zero-dependency architecture", hint: "One highlight per line. These appear as the green checkmark bullet list on the project card." },
          { key: "proj3_tech", label: "Technologies (comma separated)", type: "text", placeholder: "JavaScript (ES6+), React, Tailwind CSS, HTML5 Canvas, Local Storage" },
          { key: "proj3_demo", label: "Live Demo URL", type: "text", placeholder: "https://demo.example.com" },
          { key: "proj3_github", label: "GitHub Repository URL", type: "text", placeholder: "https://github.com/Mati-21/npq-game" },
        ],
      },
      {
        title: "Project 3: Main Card & Featured Showcase Image",
        description: "Upload or provide image URL for the main portfolio card and detail page hero",
        fields: [
          { key: "proj3_main_image", label: "Project 3 Main Card Image", type: "image", placeholder: "https://example.com/npq-game-main.png", hint: "Displayed on the main portfolio card & top of project detail page (16:9 ratio recommended)" },
        ],
      },
      {
        title: "Project 3: Detail Page Gallery Screenshots",
        description: "Upload or provide up to 4 high-res screenshots for the project detail gallery",
        fields: [
          { key: "proj3_gallery_img1", label: "Gallery Screenshot Slot #1", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj3_gallery_title1", label: "Screenshot 1 Title", type: "text", placeholder: "Game Arena & Puzzle Grid" },
          { key: "proj3_gallery_caption1", label: "Screenshot 1 Caption", type: "textarea", placeholder: "The core gameplay interface presenting interactive arithmetic equations, timer countdown, and score counters." },

          { key: "proj3_gallery_img2", label: "Gallery Screenshot Slot #2", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj3_gallery_title2", label: "Screenshot 2 Title", type: "text", placeholder: "Score Multiplier & Streak Tracker" },
          { key: "proj3_gallery_caption2", label: "Screenshot 2 Caption", type: "textarea", placeholder: "Combo system visualizer giving players dynamic bonus point multipliers for consecutive correct answers." },

          { key: "proj3_gallery_img3", label: "Gallery Screenshot Slot #3", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj3_gallery_title3", label: "Screenshot 3 Title", type: "text", placeholder: "Difficulty Selection & Modes" },
          { key: "proj3_gallery_caption3", label: "Screenshot 3 Caption", type: "textarea", placeholder: "Mode selector configuring math operation pools, speed thresholds, and challenge formats." },

          { key: "proj3_gallery_img4", label: "Gallery Screenshot Slot #4", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj3_gallery_title4", label: "Screenshot 4 Title", type: "text", placeholder: "High-Score Leaderboard & Statistics" },
          { key: "proj3_gallery_caption4", label: "Screenshot 4 Caption", type: "textarea", placeholder: "Persistent local storage leaderboard ranking top speeds, best accuracy, and highest scores." },
        ],
      },

      // ── Project 4: Wholesale Distribution ERP ──
      {
        title: "Project 4: Wholesale Distribution ERP — Details & Links",
        description: "Core text and repository links",
        fields: [
          { key: "proj4_title", label: "Project Title", type: "text", placeholder: "Wholesale Distribution ERP" },
          { key: "proj4_category", label: "Category Label", type: "text", placeholder: "Business System & Enterprise" },
          { key: "proj4_badge", label: "Badge Pill", type: "text", placeholder: "Enterprise ERP" },
          { key: "proj4_desc", label: "Project Description", type: "textarea", placeholder: "A comprehensive enterprise resource planning system tailored for wholesale distributors, managing inventory, sales orders, purchase orders, branch operations, and financial records." },
          { key: "proj4_highlights", label: "Feature Highlights / Bullet Points (one per line)", type: "textarea", placeholder: "Modular ERP with interconnected business workflows\nPermission-based architecture for granular access control\nMulti-branch support with complex relational data models\nREST APIs with JWT auth, Prisma ORM & Docker deployment", hint: "One highlight per line. These appear as the green checkmark bullet list on the project card." },
          { key: "proj4_tech", label: "Technologies (comma separated)", type: "text", placeholder: "React, Node.js, Express.js, PostgreSQL, Sequelize, Tailwind CSS, Docker" },
          { key: "proj4_demo", label: "Live Demo URL", type: "text", placeholder: "https://demo.example.com" },
          { key: "proj4_github", label: "GitHub Repository URL", type: "text", placeholder: "https://github.com/Mati-21/wholesale-erp" },
        ],
      },
      {
        title: "Project 4: Main Card & Featured Showcase Image",
        description: "Upload or provide image URL for the main portfolio card and detail page hero",
        fields: [
          { key: "proj4_main_image", label: "Project 4 Main Card Image", type: "image", placeholder: "https://example.com/wholesale-erp-main.png", hint: "Displayed on the main portfolio card & top of project detail page (16:9 ratio recommended)" },
        ],
      },
      {
        title: "Project 4: Detail Page Gallery Screenshots",
        description: "Upload or provide up to 4 high-res screenshots for the project detail gallery",
        fields: [
          { key: "proj4_gallery_img1", label: "Gallery Screenshot Slot #1", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj4_gallery_title1", label: "Screenshot 1 Title", type: "text", placeholder: "Sales & Purchase Ledger" },
          { key: "proj4_gallery_caption1", label: "Screenshot 1 Caption", type: "textarea", placeholder: "Transaction ledger tracking client invoices, order statuses, payment reconciliations, and vendor receipts." },

          { key: "proj4_gallery_img2", label: "Gallery Screenshot Slot #2", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj4_gallery_title2", label: "Screenshot 2 Title", type: "text", placeholder: "Inventory Stock & Reorder Alerts" },
          { key: "proj4_gallery_caption2", label: "Screenshot 2 Caption", type: "textarea", placeholder: "Warehouse inventory dashboard alerting staff when SKU quantities reach minimum threshold levels." },

          { key: "proj4_gallery_img3", label: "Gallery Screenshot Slot #3", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj4_gallery_title3", label: "Screenshot 3 Title", type: "text", placeholder: "Role-Based Branch Permissions" },
          { key: "proj4_gallery_caption3", label: "Screenshot 3 Caption", type: "textarea", placeholder: "Multi-branch security matrix restricting sensitive financial approvals and warehouse transfer actions." },

          { key: "proj4_gallery_img4", label: "Gallery Screenshot Slot #4", type: "image", placeholder: "Upload or paste URL", hint: "Recommended 1920x1080 resolution" },
          { key: "proj4_gallery_title4", label: "Screenshot 4 Title", type: "text", placeholder: "Multi-Branch Financial Summary" },
          { key: "proj4_gallery_caption4", label: "Screenshot 4 Caption", type: "textarea", placeholder: "Consolidated financial health reports across distribution centers with drill-down export tools." },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    emoji: "📬",
    description: "Contact information, sidebar note and social links",
    groups: [
      {
        title: "Contact Section Information",
        description: "Headings, email, and sidebar card message",
        fields: [
          { key: "heading", label: "Section Heading", type: "text", placeholder: "Have Some Questions?" },
          { key: "subtitle", label: "Section Subtitle", type: "textarea", placeholder: "Feel free to send your message anytime, or reach out directly." },
          { key: "email", label: "Contact Email", type: "email", placeholder: "matimelkamu15@gmail.com" },
          { key: "tagline", label: "Sidebar Card Message", type: "textarea", placeholder: "I'm always open to exciting ideas and collaborations." },
        ],
      },
      {
        title: "Location & Social Profiles",
        description: "Social media URLs and direct links",
        fields: [
          { key: "location", label: "Location", type: "text", placeholder: "Addis Ababa, Ethiopia" },
          { key: "social_github", label: "GitHub Profile URL", type: "text", placeholder: "https://github.com/Mati-21" },
          { key: "social_linkedin", label: "LinkedIn Profile URL", type: "text", placeholder: "https://linkedin.com/in/mati-melkamu" },
          { key: "social_twitter", label: "Twitter / X Profile URL", type: "text", placeholder: "https://x.com/mati" },
        ],
      },
    ],
  },
];

// ── Image Upload Field Component ──────────────────────────────────────────
function ImageUploadField({ label, value, onChange, placeholder, hint }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    const isHeic = file.name && /\.(heic|heif)$/i.test(file.name);
    const isImage = (file.type && file.type.startsWith("image/")) || isHeic;
    if (!isImage) {
      setError("Please select a valid image file (PNG, JPG, WebP, HEIC)");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await uploadApi.uploadImage(file);
      onChange(res.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      const serverMsg = err?.response?.data?.error;
      if (serverMsg) {
        setError(`Upload failed: ${serverMsg}`);
      } else {
        // Fallback: convert to base64 data URL if backend upload fails
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result);
        };
        reader.readAsDataURL(file);
        setError("Upload server unavailable — image saved locally as Data URL");
      }
      setTimeout(() => setError(null), 6000);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="md:col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlMode((prev) => !prev)}
          className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
        >
          {useUrlMode ? (
            <>
              <ImageIcon className="w-3 h-3" />
              Switch to File Upload
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" />
              Paste Image URL instead
            </>
          )}
        </button>
      </div>

      {useUrlMode ? (
        <div className="space-y-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://example.com/avatar.jpg"}
            className="input-field"
          />
          {hint && <p className="text-[11px] text-slate-500 dark:text-gray-400">{hint}</p>}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative p-4 rounded-2xl border-2 border-dashed transition-all duration-200
            ${
              dragOver
                ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif,image/heic,image/heif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = "";
            }}
          />

          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            {/* Thumbnail preview */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 dark:bg-surface-100 border border-slate-300/80 dark:border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative">
              {value ? (
                <img
                  src={value}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400 dark:text-gray-600" />
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1 min-w-48 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-xs py-1.5 px-3.5 gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? "Uploading…" : value ? "Change Image" : "Choose Image File"}
                </button>

                {value && (
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="btn-danger text-xs py-1.5 px-3 gap-1"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400">
                Drag and drop an image file here (PNG, JPG, WebP, HEIC), or click to browse.
              </p>
              {hint && (
                <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">
                  {hint}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section Editor Component with Visual Groups ───────────────────────────
function SectionEditor({ section, data, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"

  useEffect(() => {
    const initial = {};
    section.groups.forEach((g) => {
      g.fields.forEach(({ key, type, placeholder }) => {
        if (data?.[key] !== undefined && data[key] !== null && data[key] !== "") {
          initial[key] = data[key];
        } else if (type !== "image" && placeholder) {
          initial[key] = placeholder;
        } else {
          initial[key] = data?.[key] ?? "";
        }
      });
    });
    setForm(initial);
  }, [data, section]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await contentApi.updateSection(section.id, form);
      setStatus("success");
      onSave(section.id, form);
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {section.groups.map((group, gIdx) => (
        <div
          key={group.title}
          className={`space-y-4 ${
            gIdx > 0 ? "pt-6 border-t border-slate-100 dark:border-white/5" : ""
          }`}
        >
          {/* Group Header */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {group.description}
              </p>
            )}
          </div>

          {/* Group Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {group.fields.map((field) => {
              const { key, label, type, placeholder, hint } = field;

              if (type === "image") {
                return (
                  <ImageUploadField
                    key={key}
                    label={label}
                    value={form[key] || ""}
                    onChange={(val) => handleChange(key, val)}
                    placeholder={placeholder}
                    hint={hint}
                  />
                );
              }

              const isFullWidth = type === "textarea";

              return (
                <div
                  key={key}
                  className={isFullWidth ? "md:col-span-2" : "col-span-1"}
                >
                  <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={form[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="textarea-field"
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="input-field"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Status Message & Save Button (Pinned at bottom of form) ── */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4 flex-wrap sticky bottom-0 bg-white/95 dark:bg-surface-50/95 backdrop-blur-md py-3 z-10 -mx-5 px-5 sm:-mx-6 sm:px-6">
        <div>
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-slide-up">
              <CheckCircle className="w-4 h-4" />
              Saved changes successfully!
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium animate-slide-up">
              <AlertCircle className="w-4 h-4" />
              Failed to save. Please try again.
            </div>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary ml-auto">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Dedicated Skills Editor with Dropdown Card Selector ───────────────────
function SkillsSectionEditor({ section, data, onSave }) {
  const [form, setForm] = useState({});
  const [selectedCardId, setSelectedCardId] = useState("frontend");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const initial = {};
    section.groups.forEach((g) => {
      g.fields.forEach(({ key, type, placeholder }) => {
        if (data?.[key] !== undefined && data[key] !== null && data[key] !== "") {
          initial[key] = data[key];
        } else if (type !== "image" && placeholder) {
          initial[key] = placeholder;
        } else {
          initial[key] = data?.[key] ?? "";
        }
      });
    });

    // Support backward-compatibility aliases
    if (data?.database_title && !initial.databases_title) initial.databases_title = data.database_title;
    if (data?.database_desc && !initial.databases_desc) initial.databases_desc = data.database_desc;
    if (data?.database_tech && !initial.databases_tech) initial.databases_tech = data.database_tech;
    if (data?.tools_title && !initial.devops_title) initial.devops_title = data.tools_title;
    if (data?.tools_desc && !initial.devops_desc) initial.devops_desc = data.tools_desc;
    if (data?.tools_tech && !initial.devops_tech) initial.devops_tech = data.tools_tech;

    setForm(initial);
  }, [data, section]);

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      // Sync aliases
      if (key === "databases_title") updated.database_title = value;
      if (key === "databases_desc") updated.database_desc = value;
      if (key === "databases_tech") updated.database_tech = value;
      if (key === "devops_title") updated.tools_title = value;
      if (key === "devops_desc") updated.tools_desc = value;
      if (key === "devops_tech") updated.tools_tech = value;
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await contentApi.updateSection(section.id, form);
      setStatus("success");
      onSave(section.id, form);
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const cardGroups = section.groups;
  const currentCardIndex = cardGroups.findIndex((g) => g.id === selectedCardId);
  const currentCard = cardGroups[currentCardIndex] || cardGroups[1];

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setSelectedCardId(cardGroups[currentCardIndex - 1].id);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cardGroups.length - 1) {
      setSelectedCardId(cardGroups[currentCardIndex + 1].id);
    }
  };

  const visibleGroups = selectedCardId === "all" ? cardGroups : [currentCard].filter(Boolean);

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Prominent Card Selector Dropdown & Nav ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-500/5 via-indigo-500/5 to-transparent border border-violet-500/20 dark:border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg shadow-sm">
              {currentCard?.emoji || "⚡"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                  Select Skill Card to Edit:
                </span>
                {selectedCardId !== "all" && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold">
                    {currentCardIndex + 1} of {cardGroups.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {selectedCardId === "all"
                  ? "Viewing all skills and technology cards at once"
                  : `Currently editing: ${currentCard?.title}`}
              </p>
            </div>
          </div>

          {/* Controls: Dropdown + Next/Prev */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="input-field text-xs sm:text-sm py-2 px-3 font-semibold w-full sm:w-80 cursor-pointer bg-white dark:bg-surface-50"
            >
              <option value="all">📋 Show All Cards ({cardGroups.length})</option>
              <optgroup label="Overview & General">
                <option value="overview">⚡ Overview: Heading & Core Skills</option>
              </optgroup>
              <optgroup label="Individual Domain Cards (9 Cards)">
                {cardGroups
                  .filter((g) => g.id !== "overview" && g.id !== "approach")
                  .map((g, idx) => (
                    <option key={g.id} value={g.id}>
                      {g.emoji} Card {idx + 1}: {g.title.replace(/^Card \d+:\s*/, "")}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Process & Methodology">
                <option value="approach">🛠️ Development Approach (6 Steps)</option>
              </optgroup>
            </select>

            {selectedCardId !== "all" && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  disabled={currentCardIndex <= 0}
                  className="btn-secondary text-xs p-2 disabled:opacity-40"
                  title="Previous card"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextCard}
                  disabled={currentCardIndex >= cardGroups.length - 1}
                  className="btn-secondary text-xs p-2 disabled:opacity-40"
                  title="Next card"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick-switch pills for fast tapping */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-200/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setSelectedCardId("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              selectedCardId === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All
          </button>
          {cardGroups.map((g) => {
            const isSelected = selectedCardId === g.id;
            const shortName =
              g.id === "overview"
                ? "Header"
                : g.id === "approach"
                ? "Approach"
                : g.title.replace(/^Card \d+:\s*/, "").split(" ")[0];

            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedCardId(g.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{g.emoji}</span>
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Render Selected Card Fields ── */}
      <div className="space-y-8">
        {visibleGroups.map((group, gIdx) => (
          <div
            key={group.id || group.title}
            className={`space-y-5 ${
              gIdx > 0 ? "pt-8 border-t border-slate-200/80 dark:border-white/10" : ""
            }`}
          >
            {/* Group Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{group.emoji || "⚡"}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {group.title}
                  </h3>
                  {group.description && (
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-gray-300 font-semibold">
                {group.fields.length} fields
              </span>
            </div>

            {/* Group Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {group.fields.map((field) => {
                const { key, label, type, placeholder, hint } = field;
                const isFullWidth = type === "textarea";

                return (
                  <div
                    key={key}
                    className={isFullWidth ? "md:col-span-2" : "col-span-1"}
                  >
                    <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={form[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="textarea-field font-sans"
                      />
                    ) : (
                      <input
                        type={type}
                        value={form[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="input-field font-sans"
                      />
                    )}
                    {hint && (
                      <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-1">
                        {hint}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Status Message & Save Button (Pinned at bottom of form) ── */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4 flex-wrap sticky bottom-0 bg-white/95 dark:bg-surface-50/95 backdrop-blur-md py-3 z-10 -mx-5 px-5 sm:-mx-6 sm:px-6">
        <div>
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-slide-up">
              <CheckCircle className="w-4 h-4" />
              Saved skills changes successfully!
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium animate-slide-up">
              <AlertCircle className="w-4 h-4" />
              Failed to save. Please try again.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Skills Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Dedicated Projects Editor with Project Dropdown & Live Preview ────────
function ProjectsSectionEditor({ section, data, onSave }) {
  const [form, setForm] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("amu-kpi");
  const [activeSubTab, setActiveSubTab] = useState("mainCard"); // "mainCard" | "gallery"
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const AVAILABLE_PROJECTS = [
    {
      num: 1,
      id: "amu-kpi",
      name: "AMU KPI Monitoring & Evaluation System",
      category: "Enterprise & Full-Stack",
      badge: "Institutional Platform",
      defaultDesc: "A centralized KPI Monitoring and Evaluation System for Arba Minch University that digitizes the planning, submission, review, approval, and tracking of institutional performance across different organizational levels.",
      defaultHighlights: "Hierarchical organizational structure with configurable roles\nDynamic permissions controlling module and action access\nEnd-to-end KPI planning, submission & approval workflows\nReal-time performance reporting across institutional levels",
      tag: "Enterprise System",
      badgeColor: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/25",
      defaultSlots: [
        { title: "Executive KPI Dashboard", caption: "Institutional performance overview displaying quarterly milestones, progress meters, and status summaries." },
        { title: "Multi-Tier Approval Pipeline", caption: "Hierarchical review screen where department chairs, deans, and university directors evaluate and approve KPI submissions." },
        { title: "Dynamic Permissions Matrix", caption: "Granular access configuration allowing administrators to tailor module-level actions per institutional role." },
        { title: "Analytical Reporting & Metrics Export", caption: "Comparative institutional analytics contrasting planned targets against verified achievements with data export." },
      ],
    },
    {
      num: 2,
      id: "ripple-chat",
      name: "Ripple Chat",
      category: "Real-Time & Full-Stack",
      badge: "Real-Time Messaging",
      defaultDesc: "A real-time messaging application designed for fast and interactive communication between users. Provides a modern chat experience with user authentication, conversations, and real-time message delivery.",
      defaultHighlights: "Instant bidirectional messaging powered by Socket.io\nTyping status and real-time active user detection\nOptimized chat histories stored in MongoDB\nSecure token authentication and responsive dark UI",
      tag: "Real-Time Messaging",
      badgeColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
      defaultSlots: [
        { title: "Live Chat Interface", caption: "Minimalist, responsive messaging window with real-time dispatch, scroll sync, and formatted messages." },
        { title: "Conversations & Active Contacts", caption: "Clean sidebar showing ongoing conversations, presence indicators, and unread notification badges." },
        { title: "Security & Session Authentication", caption: "Secure login flow with JWT authentication and password hashing protection." },
        { title: "Instant Typing & Dispatch Stream", caption: "Live socket events broadcasting real-time typing status and instant delivery feedback." },
      ],
    },
    {
      num: 3,
      id: "npq-game",
      name: "NPQ Game (Number Puzzle Quest)",
      category: "Frontend & Game Engine",
      badge: "Interactive Math Game",
      defaultDesc: "An interactive, math-based arcade puzzle game that challenges players to solve numerical problems under time pressure with multiple game modes and progression.",
      defaultHighlights: "Interactive physics-informed puzzle gameplay\nMultiple levels with progressive difficulty\nClean HTML5 Canvas-based rendering\nLightweight zero-dependency architecture",
      tag: "Interactive Game",
      badgeColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      defaultSlots: [
        { title: "Game Arena & Puzzle Grid", caption: "The core gameplay interface presenting interactive arithmetic equations, timer countdown, and score counters." },
        { title: "Score Multiplier & Streak Tracker", caption: "Combo system visualizer giving players dynamic bonus point multipliers for consecutive correct answers." },
        { title: "Difficulty Selection & Modes", caption: "Mode selector configuring math operation pools, speed thresholds, and challenge formats." },
        { title: "High-Score Leaderboard & Statistics", caption: "Persistent local storage leaderboard ranking top speeds, best accuracy, and highest scores." },
      ],
    },
    {
      num: 4,
      id: "wholesale-erp",
      name: "Wholesale Distribution ERP",
      category: "Business System & Enterprise",
      badge: "Enterprise ERP",
      defaultDesc: "A comprehensive enterprise resource planning system tailored for wholesale distributors, managing inventory, sales orders, purchase orders, branch operations, and financial records.",
      defaultHighlights: "Modular ERP with interconnected business workflows\nPermission-based architecture for granular access control\nMulti-branch support with complex relational data models\nREST APIs with JWT auth, Prisma ORM & Docker deployment",
      tag: "Business ERP",
      badgeColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25",
      defaultSlots: [
        { title: "Sales & Purchase Ledger", caption: "Transaction ledger tracking client invoices, order statuses, payment reconciliations, and vendor receipts." },
        { title: "Inventory Stock & Reorder Alerts", caption: "Warehouse inventory dashboard alerting staff when SKU quantities reach minimum threshold levels." },
        { title: "Role-Based Branch Permissions", caption: "Multi-branch security matrix restricting sensitive financial approvals and warehouse transfer actions." },
        { title: "Multi-Branch Financial Summary", caption: "Consolidated financial health reports across distribution centers with drill-down export tools." },
      ],
    },
  ];

  useEffect(() => {
    const initial = {};
    section.groups.forEach((g) => {
      g.fields.forEach(({ key, type, placeholder }) => {
        if (data?.[key] !== undefined && data[key] !== null && data[key] !== "") {
          initial[key] = data[key];
        } else if (type !== "image" && placeholder) {
          initial[key] = placeholder;
        } else {
          initial[key] = data?.[key] ?? "";
        }
      });
    });

    // Check for legacy database seed values and sanitize with current portfolio defaults
    if (initial.proj1_title === "Bubbly Chat App" || !initial.proj1_title) {
      initial.proj1_title = "AMU KPI Monitoring & Evaluation System";
      initial.proj1_category = "Enterprise & Full-Stack";
      initial.proj1_badge = "Institutional Platform";
      initial.proj1_desc = "A centralized KPI Monitoring and Evaluation System for Arba Minch University that digitizes the planning, submission, review, approval, and tracking of institutional performance across different organizational levels.";
      initial.proj1_tech = "React, Redux Toolkit, TanStack Query, Node.js, Express.js, PostgreSQL, Sequelize, JWT, Tailwind CSS, Docker";
      initial.proj1_demo = initial.proj1_demo || "https://github.com/Mati-21";
      initial.proj1_github = initial.proj1_github || "https://github.com/Mati-21";
    }

    if (initial.proj2_title === "Number Puzzle Quest (NPQ)" && !initial.proj3_title) {
      initial.proj2_title = "Ripple Chat";
      initial.proj2_category = "Real-Time & Full-Stack";
      initial.proj2_badge = "Real-Time Messaging";
      initial.proj2_desc = "A real-time messaging application designed for fast and interactive communication between users. Provides a modern chat experience with user authentication, conversations, and real-time message delivery.";
      initial.proj2_tech = "React, Node.js, Express.js, MongoDB, Socket.IO, Redux Toolkit";
    } else if (!initial.proj2_title) {
      initial.proj2_title = "Ripple Chat";
      initial.proj2_category = "Real-Time & Full-Stack";
      initial.proj2_badge = "Real-Time Messaging";
      initial.proj2_desc = "A real-time messaging application designed for fast and interactive communication between users. Provides a modern chat experience with user authentication, conversations, and real-time message delivery.";
      initial.proj2_tech = "React, Node.js, Express.js, MongoDB, Socket.IO, Redux Toolkit";
      initial.proj2_demo = initial.proj2_demo || "https://github.com/Mati-21";
      initial.proj2_github = initial.proj2_github || "https://github.com/Mati-21/ripple-chat";
    }

    if (initial.proj3_title === "DevCommerce REST Hub" || !initial.proj3_title) {
      initial.proj3_title = "NPQ Game (Number Puzzle Quest)";
      initial.proj3_category = "Frontend & Game Engine";
      initial.proj3_badge = "Interactive Math Game";
      initial.proj3_desc = "An interactive, math-based arcade puzzle game that challenges players to solve numerical problems under time pressure with multiple game modes and progression.";
      initial.proj3_tech = "JavaScript (ES6+), React, Tailwind CSS, HTML5 Canvas, Local Storage";
      initial.proj3_demo = "https://npq-game-front-end.vercel.app/";
      initial.proj3_github = initial.proj3_github || "https://github.com/Mati-21";
    }

    if (initial.proj4_title === "CloudPulse Telemetry Hub" || !initial.proj4_title) {
      initial.proj4_title = "Wholesale Distribution ERP";
      initial.proj4_category = "Business System & Enterprise";
      initial.proj4_badge = "Enterprise ERP";
      initial.proj4_desc = "A comprehensive enterprise resource planning system tailored for wholesale distributors, managing inventory, sales orders, purchase orders, branch operations, and financial records.";
      initial.proj4_tech = "React, Node.js, Express.js, PostgreSQL, Sequelize, Tailwind CSS, Docker";
      initial.proj4_demo = initial.proj4_demo || "https://github.com/Mati-21";
      initial.proj4_github = initial.proj4_github || "https://github.com/Mati-21";
    }

    // Default feature highlights if missing
    AVAILABLE_PROJECTS.forEach((proj) => {
      const hKey = `proj${proj.num}_highlights`;
      if (!initial[hKey]) {
        initial[hKey] = proj.defaultHighlights;
      }
    });

    setForm(initial);
  }, [data, section]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await contentApi.updateSection("projects", form);
      setStatus("success");
      onSave("projects", form);
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const currentProject =
    AVAILABLE_PROJECTS.find(
      (p) => p.id === selectedProjectId || String(p.num) === String(selectedProjectId)
    ) || AVAILABLE_PROJECTS[0];
  const num = currentProject.num;

  const currentTitle = form[`proj${num}_title`] || currentProject.name;

  // ── Dynamic Slot Retrieval & Management ──
  const getProjectSlots = (projectNum) => {
    if (form[`proj${projectNum}_gallery_json`]) {
      try {
        const parsed = JSON.parse(form[`proj${projectNum}_gallery_json`]);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }

    const count = parseInt(form[`proj${projectNum}_gallery_count`], 10) || 4;
    const projectDefaults = AVAILABLE_PROJECTS.find((p) => p.num === projectNum)?.defaultSlots || [];

    const slots = [];
    for (let i = 1; i <= count; i++) {
      const def = projectDefaults[i - 1] || { title: `Screenshot Slot #${i}`, caption: "" };
      slots.push({
        id: i,
        src: form[`proj${projectNum}_gallery_img${i}`] || "",
        title: form[`proj${projectNum}_gallery_title${i}`] ?? def.title,
        caption: form[`proj${projectNum}_gallery_caption${i}`] ?? def.caption,
      });
    }
    return slots;
  };

  const updateProjectSlots = (newSlots) => {
    const indexed = newSlots.map((s, idx) => ({ ...s, id: idx + 1 }));
    setForm((prev) => {
      const next = {
        ...prev,
        [`proj${num}_gallery_json`]: JSON.stringify(indexed),
        [`proj${num}_gallery_count`]: String(indexed.length),
      };
      indexed.forEach((slot, idx) => {
        const slotIdx = idx + 1;
        next[`proj${num}_gallery_img${slotIdx}`] = slot.src || "";
        next[`proj${num}_gallery_title${slotIdx}`] = slot.title || "";
        next[`proj${num}_gallery_caption${slotIdx}`] = slot.caption || "";
      });
      return next;
    });
  };

  const currentSlots = getProjectSlots(num);

  const handleAddSlot = () => {
    const nextSlotNum = currentSlots.length + 1;
    const newSlot = {
      id: nextSlotNum,
      src: "",
      title: `Screenshot Slot #${nextSlotNum}`,
      caption: "",
    };
    updateProjectSlots([...currentSlots, newSlot]);
  };

  const handleRemoveSlot = (indexToRemove) => {
    if (currentSlots.length <= 1) {
      alert("Projects must have at least 1 screenshot slot.");
      return;
    }
    const filtered = currentSlots.filter((_, idx) => idx !== indexToRemove);
    updateProjectSlots(filtered);
  };

  const handleSlotChange = (index, field, value) => {
    const updated = currentSlots.map((slot, idx) => {
      if (idx === index) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    updateProjectSlots(updated);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* ── 1. General Project Section Details ── */}
      <div className="rounded-2xl p-5 bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-4 h-4 text-violet-500" />
            General Projects Section Header
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            Headlines and intro text displayed above all projects on the main portfolio page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Section Badge
            </label>
            <input
              type="text"
              value={form.section_badge || ""}
              onChange={(e) => handleChange("section_badge", e.target.value)}
              placeholder="03 • Featured Work"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Section Heading
            </label>
            <input
              type="text"
              value={form.heading || ""}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="My Projects"
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Section Subtitle
            </label>
            <textarea
              rows={2}
              value={form.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="A selection of work I've built — from real-time apps to full-stack platforms."
              className="textarea-field"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Project Selector Dropdown ── */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 border border-violet-500/20 dark:border-violet-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
                Step 2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Select Project to Update
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Select one of the 4 portfolio projects from the dropdown below to customize its main card on the portfolio page and its detail gallery.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-gray-400 bg-white dark:bg-surface-100 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
            Currently Editing: <span className="text-violet-600 dark:text-violet-400 font-bold">#{num} [{currentProject.id}] {form[`proj${num}_title`] || currentProject.name}</span>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider">
              Choose Project from Dropdown (Select by Project ID / Name):
            </label>
            <span className="text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">
              Selected ID: {currentProject.id}
            </span>
          </div>
          <div className="relative">
            <select
              id="project-select-dropdown"
              value={currentProject.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="input-field text-sm font-semibold pr-10 appearance-none bg-white dark:bg-surface-50 cursor-pointer shadow-sm border-violet-300/80 dark:border-violet-500/40 focus:ring-violet-500"
            >
              {AVAILABLE_PROJECTS.map((proj) => (
                <option key={proj.id} value={proj.id} className="py-2 text-slate-900 dark:text-white">
                  [{proj.id}] #{proj.num}: {form[`proj${proj.num}_title`] || proj.name} ({proj.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-violet-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Sub-Tab Switcher: Main Card vs Detail Gallery ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveSubTab("mainCard")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === "mainCard"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>1. Main Portfolio Card Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("gallery")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSubTab === "gallery"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Images className="w-4 h-4" />
            <span>2. Project Detail Gallery Screenshots (4 Slots)</span>
          </button>
        </div>

        {/* ── SUB-TAB 1: Main Portfolio Card Settings ── */}
        {activeSubTab === "mainCard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Card Image Uploader */}
            <div className="rounded-2xl p-5 bg-violet-500/[0.03] border border-violet-500/20 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-violet-500" />
                  Project #{num} Main Card Image
                </h4>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  This image is displayed directly inside the mockup frame on the main portfolio page and as the top featured showcase on the project detail page.
                </p>
              </div>

              <ImageUploadField
                label={`Project #${num} Main Card & Featured Image`}
                value={form[`proj${num}_main_image`] || ""}
                onChange={(val) => handleChange(`proj${num}_main_image`, val)}
                placeholder="https://example.com/project-main.png"
                hint="Supports PNG, JPG, WebP. Recommended aspect ratio: 16:9 (1920x1080)."
              />
            </div>

            {/* Basic Project Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_title`] || ""}
                  onChange={(e) => handleChange(`proj${num}_title`, e.target.value)}
                  placeholder={currentProject.name}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Category Label
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_category`] || ""}
                  onChange={(e) => handleChange(`proj${num}_category`, e.target.value)}
                  placeholder={currentProject.category}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Badge Pill Text
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_badge`] || ""}
                  onChange={(e) => handleChange(`proj${num}_badge`, e.target.value)}
                  placeholder={currentProject.badge}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_tech`] || ""}
                  onChange={(e) => handleChange(`proj${num}_tech`, e.target.value)}
                  placeholder="React, Node.js, Express, PostgreSQL..."
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={form[`proj${num}_desc`] || ""}
                  onChange={(e) => handleChange(`proj${num}_desc`, e.target.value)}
                  placeholder={currentProject.defaultDesc}
                  className="textarea-field"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Feature Highlights / Card Bullet Points (One per line)
                </label>
                <textarea
                  rows={4}
                  value={form[`proj${num}_highlights`] || ""}
                  onChange={(e) => handleChange(`proj${num}_highlights`, e.target.value)}
                  placeholder={currentProject.defaultHighlights}
                  className="textarea-field font-mono text-xs leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  Each line appears as a green checkmark bullet item on the project card. Enter one highlight per line.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Live Demo URL
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_demo`] || ""}
                  onChange={(e) => handleChange(`proj${num}_demo`, e.target.value)}
                  placeholder="https://demo.example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={form[`proj${num}_github`] || ""}
                  onChange={(e) => handleChange(`proj${num}_github`, e.target.value)}
                  placeholder="https://github.com/Mati-21/repo"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SUB-TAB 2: Detail Page Gallery Screenshots (Dynamic Slots) ── */}
        {activeSubTab === "gallery" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header with Title, Count badge, and + Add Slot button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {currentTitle} &mdash; Detail Gallery
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                    {currentSlots.length} Slots
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  Add, configure, or remove screenshot slots dynamically. These appear in the gallery of the full detail page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs sm:text-sm font-semibold shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Screenshot Slot</span>
              </button>
            </div>

            {/* Grid of Dynamic Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentSlots.map((slot, idx) => (
                <div
                  key={slot.id || idx}
                  className="rounded-2xl p-5 bg-white dark:bg-surface-100 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 relative group/slot"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full">
                        Screenshot Slot #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        1920 × 1080 • Hi-Res
                      </span>
                    </div>

                    {currentSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(idx)}
                        title="Remove this screenshot slot"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Slot</span>
                      </button>
                    )}
                  </div>

                  <ImageUploadField
                    label={`Slot #${idx + 1} Screenshot Image`}
                    value={slot.src || ""}
                    onChange={(val) => handleSlotChange(idx, "src", val)}
                    placeholder="https://example.com/screenshot.png"
                    hint="Upload file or paste image URL for this gallery slot."
                  />

                  <div>
                    <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                      Slot #{idx + 1} Title
                    </label>
                    <input
                      type="text"
                      value={slot.title || ""}
                      onChange={(e) => handleSlotChange(idx, "title", e.target.value)}
                      placeholder={`Screenshot #${idx + 1} Title`}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
                      Slot #{idx + 1} Caption
                    </label>
                    <textarea
                      rows={2}
                      value={slot.caption || ""}
                      onChange={(e) => handleSlotChange(idx, "caption", e.target.value)}
                      placeholder="Brief description of this view..."
                      className="textarea-field"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Large Add Slot Dashed Button at Bottom */}
            <button
              type="button"
              onClick={handleAddSlot}
              className="w-full py-5 border-2 border-dashed border-violet-400/40 hover:border-violet-500 rounded-2xl bg-violet-500/5 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-5 h-5" />
              <span>Add Another Screenshot Slot (#{currentSlots.length + 1})</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Status Message & Save Button (Pinned at bottom of form) ── */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4 flex-wrap sticky bottom-0 bg-white/95 dark:bg-surface-50/95 backdrop-blur-md py-3 z-10 -mx-5 px-5 sm:-mx-6 sm:px-6">
        <div>
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-slide-up">
              <CheckCircle className="w-4 h-4" />
              Saved changes successfully!
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium animate-slide-up">
              <AlertCircle className="w-4 h-4" />
              Failed to save. Please try again.
            </div>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary ml-auto">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Projects Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function UpdateContent() {
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await contentApi.getAll();
      setContent(res.data.content || {});
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = (sectionId, updatedData) => {
    setContent((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...updatedData },
    }));
  };

  const section = SECTIONS.find((s) => s.id === activeSection);
  const totalFields = section?.groups.reduce((acc, g) => acc + g.fields.length, 0) || 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <PenSquare className="w-5 h-5 text-violet-500 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Update Content</h1>
            <p className="text-slate-500 dark:text-gray-500 text-sm mt-0.5">
              Edit all portfolio sections, feature cards, and assets in detail
            </p>
          </div>
        </div>
        <button onClick={fetchContent} className="btn-secondary gap-2" disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </div>

      {/* ── Horizontal Section Tabs (Sticky under navbar) ── */}
      <div className="sticky top-14 z-20 flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100/90 dark:bg-surface-50/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/5 rounded-2xl shadow-sm overflow-x-auto">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold
                transition-all duration-200 whitespace-nowrap flex-1 justify-center
                ${
                  isActive
                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/80 dark:bg-violet-600 dark:text-white dark:border-transparent dark:shadow-violet-600/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                }
              `}
            >
              <span className="text-base leading-none">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Tab Content Panel (Card) ── */}
      <div className="card p-0 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* Card Header */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-white/5 border border-violet-200/60 dark:border-white/10 flex items-center justify-center text-xl">
                  {section?.emoji}
                </div>
                <div>
                  <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-snug">
                    {section?.label} Section
                  </h2>
                  <p className="text-slate-500 dark:text-gray-400 text-xs">
                    {section?.description}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 font-medium">
                {totalFields} fields across {section?.groups.length} groups
              </span>
            </div>

            {/* Active Tab Form (Full Page Scroll) */}
            <div className="p-5 sm:p-6">
              {activeSection === "projects" ? (
                <ProjectsSectionEditor
                  section={section}
                  data={content.projects}
                  onSave={handleSave}
                />
              ) : activeSection === "skills" ? (
                <SkillsSectionEditor
                  section={section}
                  data={content.skills}
                  onSave={handleSave}
                />
              ) : (
                <SectionEditor
                  key={activeSection}
                  section={section}
                  data={content[activeSection]}
                  onSave={handleSave}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
