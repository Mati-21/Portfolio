import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function ProjectSection() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Card 1 animations
  const card1X = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7],
    ["120%", "0%", "0%", "-120%"]
  );
  const card1Opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.45, 0.65],
    [0, 1, 1, 0]
  );
  const card1Scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);

  // Card 2 animations
  const card2X = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7, 0.9],
    ["120%", "0%", "0%", "-120%"]
  );
  const card2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.65, 0.85],
    [0, 1, 1, 0]
  );
  const card2Scale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  // Background color change
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#f0f9ff", "#eef2ff", "#faf5ff"]
  );

  // Title animation
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.8, 0.9],
    [1, 0, 0, 1]
  );
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.1, 0.8, 0.9],
    [0, -20, 20, 0]
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.1 && latest < 0.8) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative top-0 h-[400vh]">
      {/* Sticky wrapper with animated background */}
      <motion.div
        style={{ backgroundColor }}
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Animated title */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute top-12 z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Scroll to explore my work and see the details of each project
          </p>
        </motion.div>

        {/* Main content that fades out during scroll */}
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-0"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bringing Ideas to Life
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-600"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Explore my projects that combine creativity, functionality, and
              modern web technologies.
            </motion.p>

            <motion.div
              className="flex space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                React
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                Tailwind CSS
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                Node.js
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Card 1 - Bubbly Chat App */}
        <motion.div
          style={{
            x: card1X,
            opacity: card1Opacity,
            scale: card1Scale,
          }}
          className="absolute   transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl flex flex-col md:flex-row h-[70%] w-[85%] max-w-5xl items-stretch shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Image */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Bubbly Chat App</h3>
              <p className="text-blue-100">Real-time messaging application</p>
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Bubbly Chat App
            </h2>
            <p className="text-gray-600 mb-6">
              A real-time messaging application built with React, Redux, and
              Socket.IO. Users can create chat groups, send messages, share
              files, and enjoy a smooth, interactive experience.
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  React
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                  Redux
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                  Socket.IO
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  Node.js
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">
                  MongoDB
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-auto">
              <a
                href="#"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </a>
              <a
                href="#"
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Source Code
              </a>
            </div>
          </div>
        </motion.div>

        {/* Card 2 - NPQ Game */}
        <motion.div
          style={{
            x: card2X,
            opacity: card2Opacity,
            scale: card2Scale,
          }}
          className="absolute  transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl flex flex-col md:flex-row h-[70%] w-[85%] max-w-5xl items-stretch shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Image */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">NPQ Game</h3>
              <p className="text-purple-100">Educational number game</p>
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Number Place Quantity (NPQ) Game
            </h2>
            <p className="text-gray-600 mb-6">
              An educational web app designed to help players understand place
              value and number construction through fun interactive challenges.
              Built with React and Tailwind CSS.
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  React
                </span>
                <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs">
                  Tailwind CSS
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  JavaScript
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                  HTML5
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-auto">
              <a
                href="#"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </a>
              <a
                href="#"
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition duration-300 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Source Code
              </a>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg
              className="w-6 h-6"
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
      </motion.div>
    </div>
  );
}

export default ProjectSection;
