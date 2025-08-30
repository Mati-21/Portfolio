import { motion } from "framer-motion";
import profile from "../asset/profile.png";

function About() {
  return (
    <section className="relative p-10 bg-gradient-to-b  pt-20 from-black to-gray-900 ">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 300 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}
          className="text-4xl md:text-6xl font-bold sm:mb-16 mt-10  text-center  text-white"
        >
          About Me
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 200 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
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
        <div className="flex-1">
          <img
            src={profile}
            alt=""
            className="size-300 object-contain md:size-[500px] md:object-cover md:object-center "
          />
        </div>
      </motion.div>
    </section>
  );
}

export default About;
