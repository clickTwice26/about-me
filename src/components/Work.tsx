"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    number: "01",
    title: "SaaS Dashboard",
    description:
      "A full-featured analytics dashboard for SaaS founders. Real-time metrics, cohort analysis, and revenue tracking.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "D3.js"],
    year: "2024",
    href: "#",
    highlight: true,
  },
  {
    number: "02",
    title: "AI Content Studio",
    description:
      "Multi-modal AI content generation platform integrating multiple LLM providers with a unified streaming API.",
    tags: ["React", "Node.js", "OpenAI", "Stripe"],
    year: "2024",
    href: "#",
    highlight: false,
  },
  {
    number: "03",
    title: "Open Commerce",
    description:
      "Headless e-commerce storefront with edge-cached product pages, optimistic cart updates, and sub-second checkout.",
    tags: ["Next.js", "Shopify", "Tailwind", "Redis"],
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

  return (
    <motion.a
      href={project.href}
      className="group relative border-t border-[#D8D8D0] py-8 md:py-10 grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-start gap-4 md:gap-8 rounded-lg px-6 -mx-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 8 }}
    >
      <motion.span
        className="text-sm font-mono pt-1 text-[#888]"
      >
        {project.number}
      </motion.span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <motion.h3
            className="text-2xl md:text-3xl font-bold tracking-tight"
            animate={{ color: hovered ? "#FF5500" : "#0A0A0A" }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
          {project.highlight && (
            <motion.span
              className="text-xs font-semibold uppercase tracking-widest bg-[#FF5500] text-white px-3 py-1 rounded-full"
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
          className="text-base md:text-lg leading-relaxed max-w-2xl text-[#555]"
        >
          {project.description}
        </motion.p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              className="text-sm border border-[#D8D8D0] text-[#555] px-4 py-1.5 rounded-full"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 mt-1">
        <motion.span className="text-sm font-mono" animate={{ color: "#888" }}>
          {project.year}
        </motion.span>
        <motion.span
          className="w-10 h-10 rounded-full border flex items-center justify-center text-lg"
          animate={{
            borderColor: hovered ? "#FF5500" : "#D8D8D0",
            backgroundColor: hovered ? "#FF5500" : "rgba(255,85,0,0)",
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

  const inView = useInView(ref, { once: false, amount: 0.5 });
  const exitOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section id="work" ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#F7F6F2]">
        <motion.div className="w-full relative" style={{ opacity: exitOpacity }}>

          {/* Vertical heading — absolutely positioned on the far left, outside content flow */}
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#FF5500] font-semibold whitespace-nowrap">
                ✦ Selected Work
              </p>
              <h2
                className="font-bold tracking-tight text-[#0A0A0A] whitespace-nowrap"
                style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1 }}
              >
                Things I&apos;ve{" "}
                <motion.span
                  className="bg-[#FF5500] text-white px-2 rounded inline-block"
                  whileHover={{ scale: 1.08 }}
                >
                  shipped.
                </motion.span>
              </h2>
            </div>
          </motion.div>

          {/* Projects — stay in normal centered container, unaffected by vertical text */}
          <div className="max-w-6xl mx-auto px-6">
            

            <div className="flex flex-col">
              {projects.map((p, i) => (
                <ProjectCard key={p.number} project={p} index={i} />
              ))}
              <div className="border-t border-[#D8D8D0]" />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
