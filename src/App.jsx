import About from "./components/About";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProjectSection from "./components/ProjectSection";
import { ReactLenis } from "@studio-freight/react-lenis";

function App() {
  return (
    // <ReactLenis root>
    <div className="relative">
      <Header />
      <HeroSection />
      <About />
      <ProjectSection />
      <div className="h-screen"></div>
    </div>
    // </ReactLenis>
  );
}

export default App;
