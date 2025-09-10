import { useScroll, useTransform, motion } from "framer-motion";

function Hidden() {
  const { scrollY } = useScroll();

  // ✅ Use numbers, not %
  const scale = useTransform(scrollY, [0, 1000], [1.7, 1]);
  const opacity = useTransform(scrollY, [1600, 2000], [1, 0]);
  const clipPath = useTransform(
    scrollY,
    [0, 1300],
    ["circle(2% at 30% 50%)", "circle(100% at 50% 50%)"]
  );

  return (
    <motion.div
      className="h-screen bg-amber-50 sticky top-0"
      style={{
        backgroundImage: `url("https://images.hdqwalls.com/download/hot-spicy-burger-ys-3840x2160.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
        scale, // zooms in/out
        opacity, // fades away
        clipPath, // rotates in degrees
      }}
    />
  );
}

export default Hidden;
