import { useScroll, useTransform, motion } from "framer-motion";
import Skills from "./Skills";

function Hidden() {
  const { scrollY } = useScroll();

  // ✅ Use numbers, not %
  const scale = useTransform(scrollY, [0, 1000], [1.7, 1]);
  const opacity = useTransform(scrollY, [1600, 2000], [1, 0]);
  const clipPath = useTransform(
    scrollY,
    [0, 1300],
    ["circle(2% at 25% 60%)", "circle(100% at 50% 50%)"]
  );

  return (
    <motion.div
      className="h-screen bg-amber-50 sticky top-0"
      style={{
        // backgroundImage: `url("https://images.hdqwalls.com/download/hot-spicy-burger-ys-3840x2160.jpg")`,
        backgroundImage: `url("https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg")`,
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
        scale, // zooms in/out
        opacity, // fades away
        clipPath, // rotates in degrees
      }}
    >
      <div id="skills" className="h-full w-full bg-black/50">
        <Skills />
      </div>
    </motion.div>
  );
}

export default Hidden;
