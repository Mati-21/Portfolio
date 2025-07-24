import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
function HeroSection() {
  return (
    <section className="h-screen bg-gradient-to-b from-violet-900 to-black flex lg:flex-row  flex-col-reverse items-center justify-between lg:px-24 px-10 relative overflow-hidden py-32">
      {/* Left Side */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center md:text-left z-10 mb-6"
        >
          Building Fast <br /> Relieable Results
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.5 }}
          className="max-w-xl text-center md:text-left"
        >
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum
          similique eius facilis expedita dignissimos laborum voluptatibus
          molestiae itaque. Accusantium dolor architecto dignissimos nobis
          consectetur eos aut dicta cum mollitia doloribus!
        </motion.p>
      </div>
      {/* Right Side  */}

      <div className="w-[600px] h-[600px]">
        <Spline scene="https://prod.spline.design/b4u-ViwvMcbtUD07/scene.splinecode" />
      </div>
    </section>
  );
}

export default HeroSection;
