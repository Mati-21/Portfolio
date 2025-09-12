import About from "./components/About";
import Footer from "./components/Footer";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Hidden from "./components/Hidden";
import ProjectSection from "./components/ProjectSection";
import Reveal from "./components/Reveal";

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

      <Reveal />
    </div>
    // </ReactLenis>
  );
}

export default App;
