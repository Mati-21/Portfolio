import { motion } from "framer-motion";

function About() {
  return (
    <section
      id="About"
      className="relative py-24 bg-gray-800 text-white overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
            About Me
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get to know my background, skills, and what drives me as a developer
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-8 md:px-16 lg:px-24">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex-1 order-1 lg:order-1"
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Full Stack Developer
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I am a Full Stack Software Developer with a strong passion for
                building scalable, user-friendly, and visually engaging
                applications...
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I have hands-on experience with modern tools and frameworks such
                as Tailwind CSS for responsive design and Figma for UI/UX
                prototyping...
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I enjoy solving complex problems, optimizing performance, and
                delivering high-quality digital solutions...
              </p>
            </div>

            {/* Skills */}
            <div className="mb-10">
              <h3 className="text-xl font-medium text-white mb-4">
                Technologies I Work With
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "JavaScript",
                  "React",
                  "Node.js",
                  "MongoDB",
                  "Express",
                  "Tailwind CSS",
                  "Figma",
                  "MERN Stack",
                ].map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium shadow-sm border border-gray-600 hover:shadow-md transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-gray-700 rounded-lg shadow-sm border border-gray-600"
              >
                <div className="text-2xl font-bold text-white mb-1">4+</div>
                <div className="text-sm text-gray-300">Projects Completed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-gray-700 rounded-lg shadow-sm border border-gray-600"
              >
                <div className="text-2xl font-bold text-white mb-1">2+</div>
                <div className="text-sm text-gray-300">Years Experience</div>
              </motion.div>
            </div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Download Resume
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                Contact Me
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true, amount: 0.5 }}
            className="flex-1 flex justify-center order-2 lg:order-2"
          >
            <div className="relative">
              <div className="relative z-10 w-96 h-[36rem] rounded-xl overflow-hidden shadow-lg border-4 border-gray-700">
                <img
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg"
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
