// src/components/HeroSection.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import { HeroVideo } from "./HeroVideo";
import heroWebm from "../assets/1A3N_camera-spin.webm";
import heroMp4 from "../assets/1A3N_camera-spin.mp4";

export const HeroSection: FC<{ playbackRate?: number }> = ({
  playbackRate = 0.3,
}) => (
  <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
    <div className="flex flex-col md:flex-row items-center justify-between flex-wrap">
      <div className="w-full md:w-1/2 pr-6">
        <h2 className="font-primary text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Accelerate Drug Discovery with AI
        </h2>
        <p className="text-base md:text-lg font-primary text-gray-600 mb-6">
          Leverage advanced machine learning to identify novel compounds,
          simulate reactions, and optimize trials — all in one secure platform.
        </p>
        <Link
          to="/sign-in?redirect_url=/dashboard"
          className="bg-primary text-white hover:opacity-90 transition px-6 py-3 rounded-lg shadow font-primary"
        >
          Get Started
        </Link>
      </div>
      <div className="w-full md:w-1/2 md:pl-6 mt-4 pt-3 md:pt-0">
        <HeroVideo webm={heroWebm} mp4={heroMp4} playbackRate={playbackRate} />
      </div>
    </div>
  </section>
);
