import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { useContent } from "../context/ContentContext";

function HeroSection() {
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { content } = useContent();
  const hero = content?.hero || {};

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly enforce muted state for strict browser autoplay policies
    video.muted = true;
    video.defaultMuted = true;

    const startPlayback = () => {
      video.playbackRate = 0.4;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
          })
          .catch(() => {
            // Autoplay was prevented by browser/power-saver, poster image handles background flawlessly
          });
      }
    };

    if (video.readyState >= 3) {
      startPlayback();
    } else {
      video.addEventListener("canplay", startPlayback, { once: true });
      video.addEventListener("playing", () => setIsVideoPlaying(true), { once: true });
    }

    return () => {
      video.removeEventListener("canplay", startPlayback);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-slate-950"
    >
      {/* Instant visual fallback poster so first paint is 0ms */}
      <img
        src="/hero-frame.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Lightweight Streamable Video Background (3.5 MB with faststart, playsInline) */}
      <video
        ref={videoRef}
        src="/hero-bg.mp4"
        poster="/hero-frame.jpg"
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 select-none ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onPlaying={() => setIsVideoPlaying(true)}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-40 transform -translate-x-1/2 flex flex-col items-center text-slate-700 dark:text-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-sm mb-2 text-slate-700 dark:text-white font-medium">
          {hero.scroll_hint || "Scroll to explore"}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6 text-slate-700 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Adaptive Overlay for crisp light & sleek dark mode */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-50/85 dark:bg-black/65 backdrop-blur-[1.5px] transition-colors duration-300"></div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-24 text-center lg:text-left max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-heading font-extrabold text-slate-950 dark:text-white mb-4 leading-tight tracking-tight"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
            {hero.name || "Mati Melkamu"}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-violet-700 dark:text-cyan-400 mb-6"
        >
          {hero.title || "Full-Stack Developer & UI Designer"}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full sm:max-w-xl text-slate-700 dark:text-gray-200 text-base sm:text-lg leading-relaxed mb-8"
        >
          {hero.subtitle ||
            "Building modern, scalable web applications, robust backend microservices, and interactive user experiences that make a lasting impact."}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white font-medium rounded-xl shadow-lg shadow-violet-600/30 transition-all active:scale-95 text-sm"
          >
            {hero.cta || "Explore Projects"}
          </a>
          <a
            href={hero.cv_url || "/Mati Melkamu.pdf"}
            download={hero.cv_download_name || "Mati Melkamu.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300/80 dark:border-violet-500/30 text-slate-800 dark:text-white font-medium rounded-xl backdrop-blur-md transition-all active:scale-95 text-sm cursor-pointer shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4 text-violet-600 dark:text-cyan-400" />
            <span>{hero.cta_secondary && hero.cta_secondary !== "Contact Me" ? hero.cta_secondary : "Download CV"}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
