import { motion } from "framer-motion";
import profile from "../asset/pro2.png";

function About() {
  return (
    <section className="relative p-10 bg-gradient-to-b  pt-20 from-black to-gray-900 ">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5, once: true }}
          className="text-4xl md:text-6xl font-bold sm:mb-16 mt-10  text-center  text-white"
        >
          About Me
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.1 }}
        className="flex flex-col gap-2 p-2 md:flex-row md:items-center mt-6"
      >
        {/* Detail about me  */}
        <div className="flex-1">
          <p className="text-xs sm:text-sm  md:p-12 leading-4 ">
            I am a Full Stack Software Developer with a strong passion for
            building scalable, user-friendly, and visually engaging
            applications. With expertise in MongoDB, Express.js, React, and
            Node.js (MERN stack), I specialize in developing end-to-end web
            solutions — from designing intuitive user interfaces to implementing
            robust backend systems.
            <br /> <br /> I have hands-on experience with modern tools and
            frameworks such as Tailwind CSS for responsive design and Figma for
            UI/UX prototyping, ensuring that every project I work on is both
            functional and visually appealing. <br /> <br />I enjoy solving
            complex problems, optimizing performance, and delivering
            high-quality digital solutions that meet real-world needs. My goal
            is to continuously learn, grow, and contribute to impactful projects
            that make a difference.
          </p>
        </div>
        {/* image */}
        <div className="flex-1 flex justify-center  p-5">
          <div className="h-[400px] w-96  shadow-[0_0_20px_rgba(255,255,255,0.5)] rounded-lg co ">
            <img src={profile} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default About;
