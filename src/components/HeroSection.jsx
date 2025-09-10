import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import myVideo from "../asset/3141208-uhd_3840_2160_25fps.mp4";

function HeroSection() {
  const videoRef = useRef(null);

  // Slow down video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3; // slow motion
    }
  }, []);

  return (
    <section className="absolute h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        ref={videoRef}
        src={myVideo}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-40 transform -translate-x-1/2 flex flex-col items-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-sm mb-2 text-white">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
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

      {/* Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-24 text-center lg:text-left max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="text-2xl sm:text-5xl md:text-6xl lg:text-4xl font-bold text-white mb-6 leading-tight"
        >
          Hi I'am Mati Melkamu
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.5 }}
          className="mt-8 text-2xl bg-orange-500 bg-clip-text text-transparent font-bold "
        >
          Full-Stack developer and UI Designer
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3 }}
          className="max-w-full sm:max-w-lg md:max-w-xl text-white mx-auto lg:mx-0 text-base sm:text-lg md:text-xl leading-relaxed mt-4"
        >
          When I'm not coding, I enjoy exploring new technologies, learning
          about sustainable development projects, and building practical
          solutions that make a positive impact.
        </motion.p>

        {/* Optional CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.5 }}
          className="mt-8"
        >
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition"
          >
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
