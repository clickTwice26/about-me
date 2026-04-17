"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "TypeScript", icon: "TS" },
  { name: "JavaScript", icon: "JS" },
  { name: "React", icon: "Re" },
  { name: "Next.js", icon: "Nx" },
  { name: "Node.js", icon: "No" },
  { name: "Python", icon: "Py" },
  { name: "Tailwind", icon: "Tw" },
  { name: "PostgreSQL", icon: "Pg" },
  { name: "Prisma", icon: "Pr" },
  { name: "Docker", icon: "Dk" },
  { name: "Git", icon: "Gt" },
  { name: "AWS", icon: "Aw" },
  { name: "Redis", icon: "Rd" },
  { name: "Figma", icon: "Fg" },
  { name: "Express", icon: "Ex" },
  { name: "Vercel", icon: "Vc" },
];

// Duplicate for seamless loop
const row1 = skills;
const row2 = [...skills].reverse();

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
            className="text-center mb-16 px-6"
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

          {/* Marquee Row 1 — scrolls left */}
          <div className="relative mb-6 overflow-hidden">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...row1, ...row1].map((skill, i) => (
                <div
                  key={`r1-${i}`}
                  className="flex items-center gap-3 bg-white border border-[#E8E8E0] rounded-full px-6 py-3 flex-shrink-0 hover:border-[#FF5500] transition-colors duration-200"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#0A0A0A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {skill.icon}
                  </span>
                  <span className="text-base font-medium text-[#0A0A0A] whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Marquee Row 2 — scrolls right */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            >
              {[...row2, ...row2].map((skill, i) => (
                <div
                  key={`r2-${i}`}
                  className="flex items-center gap-3 bg-white border border-[#E8E8E0] rounded-full px-6 py-3 flex-shrink-0 hover:border-[#FF5500] transition-colors duration-200"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#FF5500] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {skill.icon}
                  </span>
                  <span className="text-base font-medium text-[#0A0A0A] whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
