"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function Home() {
  return (
    <SmoothScroll>
      <ParticleField />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
