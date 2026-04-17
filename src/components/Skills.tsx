"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useCallback, useState } from "react";
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiGit,
  SiRedis,
  SiFigma,
  SiVercel,
  SiExpress,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const skills = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Prisma", icon: SiPrisma, color: "#2D3748" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "AWS", icon: FaAws, color: "#FF9900" },
  { name: "Redis", icon: SiRedis, color: "#DC382D" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "Vercel", icon: SiVercel, color: "#000000" },
  { name: "Express", icon: SiExpress, color: "#000000" },
];

function MarqueeRow() {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [scales, setScales] = useState<number[]>([]);

  const doubled = [...skills, ...skills];

  const updateSpotlight = useCallback(() => {
    if (!trackRef.current) return;
    const centerX = window.innerWidth / 2;
    const spotlightRadius = window.innerWidth * 0.15; // 15% of viewport = spotlight zone
    const newScales: number[] = [];

    itemRefs.current.forEach((el) => {
      if (!el) {
        newScales.push(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(itemCenter - centerX);
      // 0 = at center, 1 = at edge of spotlight
      const t = Math.min(dist / spotlightRadius, 1);
      // Smooth easing: 1 at center, 0 outside
      const intensity = t < 1 ? Math.cos(t * Math.PI * 0.5) : 0;
      newScales.push(intensity);
    });

    setScales(newScales);
    rafRef.current = requestAnimationFrame(updateSpotlight);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateSpotlight);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateSpotlight]);

  return (
    <div className="relative overflow-hidden">
      {/* Spotlight glow indicator */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[30vw] bg-gradient-to-r from-transparent via-[#FF550008] to-transparent z-10" />

      <motion.div
        ref={trackRef}
        className="flex items-center gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((skill, i) => {
          const intensity = scales[i] || 0;
          const s = 1 + intensity * 0.6; // scale: 1 → 1.6
          const Icon = skill.icon;

          return (
            <div
              key={`s-${i}`}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="flex flex-col items-center gap-2 flex-shrink-0 transition-transform duration-100"
              style={{
                transform: `scale(${s})`,
                zIndex: intensity > 0.3 ? 10 : 1,
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-shadow duration-200"
                style={{
                  backgroundColor: intensity > 0.2 ? skill.color : "#E8E8E0",
                  boxShadow: intensity > 0.3 ? `0 8px 30px ${skill.color}40` : "none",
                }}
              >
                <Icon
                  size={32}
                  color={intensity > 0.2 ? "#fff" : "#888"}
                />
              </div>
              <span
                className="text-sm font-semibold text-[#0A0A0A] whitespace-nowrap transition-opacity duration-150"
                style={{
                  opacity: intensity > 0.3 ? 1 : 0,
                  transform: `translateY(${intensity > 0.3 ? 0 : 8}px)`,
                }}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const exitOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <section id="skills" ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F7F6F2]">
        <motion.div className="w-full" style={{ opacity: exitOpacity }}>
          {/* Header */}
          <motion.div
            className="text-center mb-20 px-6"
            style={{ opacity: headingOpacity, y: headingY }}
          >
            <p className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-4">
              ✦ Stack
            </p>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-[#0A0A0A]">
              Tools I{" "}
              <span className="bg-[#FF5500] text-white px-2 rounded inline-block">
                trust
              </span>{" "}
              in production.
            </h2>
          </motion.div>

          {/* Single marquee row with spotlight */}
          <MarqueeRow />
        </motion.div>
      </div>
    </section>
  );
}
