"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const groups = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis"],
  },
  {
    category: "Tooling",
    items: ["Git", "Docker", "Vercel", "AWS", "Figma"],
  },
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const labelOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0.05, 0.18], [0, 1]);
  const headingX = useTransform(scrollYProgress, [0.05, 0.18], [-60, 0]);

  // Each grid cell has its own timing
  const cell0 = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const cell1 = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const cell2 = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const cell3 = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const cellProgress = [cell0, cell1, cell2, cell3];

  const cellY0 = useTransform(cell0, [0, 1], [30, 0]);
  const cellY1 = useTransform(cell1, [0, 1], [30, 0]);
  const cellY2 = useTransform(cell2, [0, 1], [30, 0]);
  const cellY3 = useTransform(cell3, [0, 1], [30, 0]);
  const cellYValues = [cellY0, cellY1, cellY2, cellY3];

  const gridScale = useTransform(scrollYProgress, [0.15, 0.35], [0.95, 1]);
  const exitOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <section id="skills" ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#F7F6F2]">
        <motion.div className="max-w-6xl mx-auto px-6 w-full" style={{ opacity: exitOpacity }}>
          <motion.p
            className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
            style={{ opacity: labelOpacity }}
          >
            ✦ Stack
          </motion.p>

          <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
            <motion.h2
              className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight text-[#0A0A0A] md:w-1/3 md:pr-12 flex-shrink-0"
              style={{ opacity: headingOpacity, x: headingX }}
            >
              Tools I{" "}
              <motion.span
                className="bg-[#FF5500] text-white px-2 rounded inline-block"
                whileHover={{ scale: 1.1, rotate: -2 }}
              >
                trust
              </motion.span>
              <br />
              in production.
            </motion.h2>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-0 flex-1 border border-[#D8D8D0] rounded-2xl overflow-hidden"
              style={{ scale: gridScale }}
            >
              {groups.map((g, i) => (
                  <motion.div
                    key={g.category}
                    className={`p-6 flex flex-col gap-3 ${
                      i % 2 === 0 ? "border-r border-[#D8D8D0]" : ""
                    } ${i < 2 ? "border-b border-[#D8D8D0]" : ""}`}
                    style={{ opacity: cellProgress[i], y: cellYValues[i] }}
                    whileHover={{
                      backgroundColor: "rgba(255,85,0,0.03)",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <span className="text-xs uppercase tracking-widest text-[#888] font-semibold">
                      {g.category}
                    </span>
                    <ul className="flex flex-col gap-2">
                      {g.items.map((item) => (
                        <motion.li
                          key={item}
                          className="text-sm text-[#0A0A0A] font-medium flex items-center gap-2 cursor-default"
                          whileHover={{
                            x: 6,
                            color: "#FF5500",
                            transition: { duration: 0.2 },
                          }}
                        >
                          <motion.span
                            className="w-1 h-1 rounded-full bg-[#FF5500] flex-shrink-0"
                            whileHover={{ scale: 3 }}
                          />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
