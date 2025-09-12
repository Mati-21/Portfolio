import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useEffect } from "react";

function Reveal() {
  const containerRef = useRef(null);

  // 👇 track parent instead of sticky child
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Debug log
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      console.log("progress:", v.toFixed(3));
    });
  }, [scrollYProgress]);

  //   const scale = useTransform(scrollYProgress, [0, 1], [0, 6.4]);
  //   const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["circle(10% at 50% 50%)", "circle(100% at 50% 50%)"]
  );

  return (
    <div id="contact" ref={containerRef} className="h-[2000px] relative">
      <motion.div
        style={{
          backgroundColor: "white",

          clipPath,
        }}
        className="sticky top-0 h-screen flex items-center justify-center"
      >
        <motion.h1 className="text-black ">The end</motion.h1>
      </motion.div>
    </div>
  );
}

export default Reveal;
