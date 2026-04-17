"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    number: "01",
    title: "SaaS Dashboard",
    description:
      "A full-featured analytics dashboard for SaaS founders. Real-time metrics, cohort analysis, and revenue tracking built with Next.js and D3.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "D3.js"],
    year: "2024",
    href: "#",
    highlight: true,
  },
  {
    number: "02",
    title: "AI Content Studio",
    description:
      "Multi-modal AI content generation platform integrating multiple LLM providers with a unified streaming API and credit management system.",
    tags: ["React", "Node.js", "OpenAI", "Stripe"],
    year: "2024",
    href: "#",
    highlight: false,
  },
  {
    number: "03",
    title: "Open Commerce",
    description:
      "Headless e-commerce storefront with edge-cached product pages, optimistic cart updates, and sub-second checkout flows.",
    tags: ["Next.js", "Shopify", "Tailwind", "Redis"],
    year: "2023",
    href: "#",
    highlight: false,
  },
  {
    number: "04",
    title: "Design System",
    description:
      "A token-driven component library used across 3 products. Full Storybook documentation, A11y compliant, and tree-shakeable.",
    tags: ["React", "TypeScript", "Storybook", "Radix UI"],
    year: "2023",
    href: "#",
    highlight: false,
  },
];

function ProjectCard({
  project,
  progress,
  index,
}: {
  project: (typeof projects)[0];
  progress: MotionValue<number>;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const total = projects.length;
  const start = index / total;
  const mid = (index + 0.3) / total;
  const end = (index + 0.8) / total;
  const exit = (index + 1) / total;

  const opacity = useTransform(progress, [start, mid, end, exit], [0, 1, 1, index === total - 1 ? 1 : 0.3]);
  const y = useTransform(progress, [start, mid], [60, 0]);
  const scale = useTransform(progress, [start, mid, end, exit], [0.95, 1, 1, index === total - 1 ? 1 : 0.97]);

  return (
    <motion.a
      href={project.href}
      className="group relative border-t border-[#D8D8D0] py-8 grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-start gap-4 md:gap-8 rounded-lg px-4 -mx-4"
      style={{ opacity, y, scale }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 8 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg bg-[#0A0A0A] -z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ originX: 0 }}
      />

      <motion.span
        className="text-xs font-mono pt-1"
        animate={{ color: hovered ? "#888" : "#888" }}
      >
        {project.number}
      </motion.span>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <motion.h3
            className="text-xl font-bold tracking-tight"
            animate={{ color: hovered ? "#ffffff" : "#0A0A0A" }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
          {project.highlight && (
            <motion.span
              className="text-[10px] font-semibold uppercase tracking-widest bg-[#FF5500] text-white px-2 py-0.5 rounded-full"
              animate={{
                boxShadow: hovered
                  ? "0 0 20px rgba(255,85,0,0.4)"
                  : "0 0 0px rgba(255,85,0,0)",
              }}
            >
              Featured
            </motion.span>
          )}
        </div>
        <motion.p
          className="text-sm leading-relaxed max-w-xl"
          animate={{ color: hovered ? "#aaa" : "#555" }}
          transition={{ duration: 0.3 }}
        >
          {project.description}
        </motion.p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              className="text-xs border px-3 py-1 rounded-full"
              animate={{
                borderColor: hovered ? "#444" : "#D8D8D0",
                color: hovered ? "#aaa" : "#555",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 mt-1">
        <motion.span className="text-xs font-mono" animate={{ color: "#888" }}>
          {project.year}
        </motion.span>
        <motion.span
          className="w-8 h-8 rounded-full border flex items-center justify-center"
          animate={{
            borderColor: hovered ? "#ffffff" : "#D8D8D0",
            backgroundColor: hovered ? "#FF5500" : "transparent",
            color: hovered ? "#ffffff" : "#555",
            rotate: hovered ? 45 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          ↗
        </motion.span>
      </div>
    </motion.a>
  );
}

export default function Work() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [40, 0]);
  const lineWidth = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const projectProgress = useTransform(scrollYProgress, [0.1, 0.95], [0, 1]);

  // Exit
  const exitOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  return (
    <section id="work" ref={ref} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#F7F6F2]">
        <motion.div className="max-w-6xl mx-auto px-6 w-full relative" style={{ opacity: exitOpacity }}>
          {/* Accent line */}
          <motion.div
            className="absolute -top-4 left-0 right-0 h-[2px] bg-[#FF5500]"
            style={{ width: lineWidth }}
          />

          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
            style={{ opacity: headerOpacity, y: headerY }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-4">
                ✦ Selected Work
              </p>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight leading-tight text-[#0A0A0A]">
                Things I&apos;ve{" "}
                <motion.span
                  className="bg-[#FF5500] text-white px-2 rounded inline-block"
                  whileHover={{ scale: 1.1, rotate: -2 }}
                >
                  shipped.
                </motion.span>
              </h2>
            </div>
            <motion.a
              href="#"
              className="text-sm font-medium text-[#555] uppercase tracking-widest flex-shrink-0"
              whileHover={{ color: "#FF5500", x: 4 }}
            >
              All Projects →
            </motion.a>
          </motion.div>

          {/* Projects */}
          <div className="flex flex-col">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.number}
                project={p}
                progress={projectProgress}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
