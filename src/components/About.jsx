import { motion } from "framer-motion";
import profile from "../asset/pro2.png";

function About() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-white"
        >
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Me
          </span>
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Full Stack Developer
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              I am a Full Stack Software Developer with a strong passion for
              building scalable, user-friendly, and visually engaging
              applications. With expertise in MongoDB, Express.js, React, and
              Node.js (MERN stack), I specialize in developing end-to-end web
              solutions — from designing intuitive user interfaces to
              implementing robust backend systems.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              I have hands-on experience with modern tools and frameworks such
              as Tailwind CSS for responsive design and Figma for UI/UX
              prototyping, ensuring that every project I work on is both
              functional and visually appealing.
            </p>

            <p className="text-gray-300 leading-relaxed mb-10 text-lg">
              I enjoy solving complex problems, optimizing performance, and
              delivering high-quality digital solutions that meet real-world
              needs. My goal is to continuously learn, grow, and contribute to
              impactful projects that make a difference.
            </p>

            {/* Skills tags */}
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
                  className="px-4 py-2 bg-gray-800 text-gray-200 rounded-full text-sm font-medium hover:bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Image container */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <div className="relative z-10 w-80 h-96 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
                <img
                  src={profile}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border-2 border-transparent bg-gradient-to-br from-blue-500 to-purple-600"></div>

              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-50"></div>
            </div>
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">Interested in working together?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
