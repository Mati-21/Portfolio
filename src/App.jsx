import About from "./components/About";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Hidden from "./components/Hidden";
import ProjectSection from "./components/ProjectSection";
import { ReactLenis } from "@studio-freight/react-lenis";

function App() {
  return (
    // <ReactLenis root>
    <div className="relative">
      <div className="h-[2000px] ">
        <Header />
        <HeroSection />
        <Hidden />
      </div>

      <About />
      <ProjectSection />
      <div className="h-screen"></div>
    </div>
    // </ReactLenis>
  );
}

export default App;

{
  /* <ReactLenis root>
  <Header />
  <HeroSection />
  <CenteredImage />
</ReactLenis>; */
}
