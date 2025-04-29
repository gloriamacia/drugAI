// src/pages/Home.tsx

import { FC, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import heroWebm from "../assets/1A3N_camera-spin.webm";
import heroMp4 from "../assets/1A3N_camera-spin.mp4";

import { ModelsSection } from "../components/ModelsSection";
import { PricingSection } from "../components/PricingSection";

interface HeroVideoProps {
  mp4: string;
  webm: string;
  playbackRate?: number;
}

// Named export for HeroVideo
export const HeroVideo: FC<HeroVideoProps> = ({
  webm,
  mp4,
  playbackRate = 0.75,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className="w-full overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-auto object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
};

const Home: FC = () => (
  <div className="min-h-screen bg-white flex flex-col">
    {/* Hero Section */}
    <main className="flex flex-col md:flex-row items-center justify-between flex-wrap ">
      {/* Left */}
      <div className="w-full md:w-1/2 pr-6">
        <h2 className="font-primary text-5xl font-extrabold text-gray-900 mb-4">
          Accelerate Drug Discovery with AI
        </h2>
        <p className="text-lg font-primary text-gray-600 mb-6">
          Leverage advanced machine learning to identify novel compounds,
          simulate reactions, and optimize trials — all in one secure platform.
        </p>
        <Link
          to="/sign-in"
          className="bg-primary text-white hover:opacity-90 transition px-6 py-3 rounded-lg shadow font-primary"
        >
          Get Started
        </Link>
      </div>
      {/* Right */}
      <div className="w-full md:w-1/2 pl-6 mt-4">
        <HeroVideo webm={heroWebm} mp4={heroMp4} playbackRate={0.3} />
      </div>
    </main>

    {/* Models Section (full-width row beneath the hero) */}
    <ModelsSection />
    <PricingSection />
  </div>
);

export default Home;
