import { useScroll, useTransform, motion } from "framer-motion";
import Skills from "./Skills";

function Hidden() {
  const { scrollY } = useScroll();

  // Smooth reveals without clipping at scroll 0
  const scale = useTransform(scrollY, [100, 1100], [1.3, 1]);
  const opacity = useTransform(scrollY, [0, 120, 1500, 1900], [0, 1, 1, 0]);
  const pointerEvents = useTransform(scrollY, (val) => (val > 100 && val < 1900 ? "auto" : "none"));
  const clipPath = useTransform(
    scrollY,
    [100, 1200],
    ["circle(0% at 50% 50%)", "circle(120% at 50% 50%)"]
  );

  return (
    <motion.div
      className="h-screen bg-gray-950 sticky top-0"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg")`,
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
        scale, // zooms in/out
        opacity, // fades away
        clipPath, // reveals smoothly
        pointerEvents,
      }}
    >
      <div id="skills" className="h-full w-full bg-black/75 backdrop-blur-[2px]">
        <Skills />
      </div>
    </motion.div>
  );
}

export default Hidden;
