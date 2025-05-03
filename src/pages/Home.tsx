// src/pages/Home.tsx
import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ModelsSection } from "../components/ModelsSection";
import { PricingSection } from "../components/PricingSection";
import { HeroSection } from "../components/HeroSection";

const Home: FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const elem = document.getElementById(id);
      if (elem) {
        // slight delay to ensure element is rendered
        setTimeout(() => elem.scrollIntoView({ behavior: "smooth" }), 0);
      }
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-white flex flex-col" id="top">
      {/* Hero Section */}
      <HeroSection playbackRate={0.3} />

      {/* Models Section */}
      <section id="models">
        <ModelsSection />
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection />
      </section>
    </div>
  );
};

export default Home;
