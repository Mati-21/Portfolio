import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

function ProjectSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // track scroll inside this section
  });

  // 🔹 Log scroll progress on every change
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      console.log("Scroll Progress:", latest.toFixed(3)); // 0 → 1
    });
  }, [scrollYProgress]);

  // Card 1 animations
  const card1X = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    ["150%", "0%", "-200%"]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.21, 1.2]);

  // Card 2 animations
  const card2X = useTransform(
    scrollYProgress,
    [0.4, 0.6, 0.7, 1],
    ["150%", "50%", "0%", "-210%"]
  );
  const scale2 = useTransform(scrollYProgress, [0.4, 1], [0.21, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative top-0 bg-slate-50 h-[400vh]">
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center">
        <h1 className="text-gray-900 pt-4 text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          My Projects
        </h1>

        {/* Static content */}
        <motion.div
          style={{ opacity }}
          className="h-full w-full bg-green-400 flex flex-col justify-center items-center text-center p-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Crafting Innovative Digital Experiences
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl mb-8">
            Welcome to my project showcase! Here, I transform ideas into
            interactive, responsive, and scalable web applications using modern
            technologies like React, Tailwind CSS, Node.js, and more. Each
            project tells a story of creativity, problem-solving, and technical
            expertise.
          </p>
          <p className="text-lg md:text-xl text-white/90 italic">
            Explore, get inspired, and see how code meets design.
          </p>
        </motion.div>

        {/* Card 1 */}
        <motion.div
          style={{ x: card1X, scale }}
          className="absolute top-[20%] bg-white rounded-2xl flex flex-col md:flex-row h-[80%] w-[70%] items-center shadow-2xl overflow-hidden"
        >
          {/* Image */}
          <img
            src="/images/Cherry-Garcia.png"
            alt="Project 1"
            className="w-full md:w-1/2 h-full object-cover"
          />

          {/* Content */}
          <div className="p-6 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Food Ordering Web App
            </h2>
            <p className="text-gray-600 mb-4">
              A progressive web app that allows users to browse menus, order
              food, and track delivery in real-time. Built with React, Tailwind,
              and Node.js.
            </p>
            <a
              href="https://github.com/yourusername/food-ordering-app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
            >
              View Project
            </a>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          style={{ x: card2X, scale: scale2 }}
          className="absolute top-[20%] bg-white rounded-2xl flex flex-col md:flex-row h-[80%] w-[70%] items-center shadow-2xl overflow-hidden"
        >
          {/* Image */}
          <img
            src="/images/coffee-buzz.png"
            alt="Project 2"
            className="w-full md:w-1/2 h-full object-cover"
          />

          {/* Content */}
          <div className="p-6 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              KPI Management Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              A dashboard for tracking business KPIs grouped by goals and KRAs
              with filtering and visualization. Developed with React, Redux, and
              MongoDB.
            </p>
            <a
              href="https://github.com/yourusername/kpi-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
            >
              View Project
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProjectSection;
