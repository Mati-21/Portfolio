import { motion } from "framer-motion";

function About() {
  return (
    <section className="h-screen overflow-hidden relative p-10 bg-gradient-to-b  from-black to- bg-gray-900">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 500 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}
          className="text-4xl md:text-6xl font-bold sm:mb-16  text-center  text-white"
        >
          About Me
        </motion.h1>
      </div>
    </section>
  );
}

export default About;
