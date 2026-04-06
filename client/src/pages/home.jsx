import CursorFollower from "../components/CursorFollower";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#050505] text-white overflow-x-hidden"
      style={{ cursor: "none" }}
    >
      <CursorFollower />
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
    </div>
  );
}