"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  return (
    <motion.a
      ref={cardRef}
      key={project.number}
      href={project.href}
      className="group relative border-t border-[#D8D8D0] py-8 grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-start gap-4 md:gap-8 rounded-lg px-4 -mx-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 8 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-[#0A0A0A] -z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ originX: 0 }}
      />

      {/* Number */}
      <motion.span
        className="text-xs font-mono pt-1"
        animate={{ color: hovered ? "#888" : "#888" }}
      >
        {project.number}
      </motion.span>

      {/* Content */}
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
              whileHover={{ scale: 1.1 }}
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
          {project.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              className="text-xs border px-3 py-1 rounded-full"
              animate={{
                borderColor: hovered ? "#444" : "#D8D8D0",
                color: hovered ? "#aaa" : "#555",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.12 + ti * 0.05,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Year + arrow */}
      <div className="flex items-center gap-3 flex-shrink-0 mt-1">
        <motion.span
          className="text-xs font-mono"
          animate={{ color: hovered ? "#888" : "#888" }}
        >
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-32 px-6 max-w-6xl mx-auto border-t border-[#D8D8D0] relative"
    >
      {/* Animated accent line */}
      <motion.div
        className="absolute top-0 left-6 h-[2px] bg-[#FF5500]"
        style={{ width: lineWidth }}
      />

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
        <div>
          <motion.p
            className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ✦ Selected Work
          </motion.p>
          <motion.h2
            className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight leading-tight text-[#0A0A0A]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Things I&apos;ve{" "}
            <motion.span
              className="bg-[#FF5500] text-white px-2 rounded inline-block"
              whileHover={{
                scale: 1.1,
                rotate: -2,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
            >
              shipped.
            </motion.span>
          </motion.h2>
        </div>
        <motion.a
          href="#"
          className="text-sm font-medium text-[#555] uppercase tracking-widest flex-shrink-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ color: "#FF5500", x: 4 }}
        >
          All Projects →
        </motion.a>
      </div>

      {/* Project list */}
      <div className="flex flex-col">
        {projects.map((p, i) => (
          <ProjectCard key={p.number} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
