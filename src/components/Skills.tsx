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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-32 px-6 max-w-6xl mx-auto border-t border-[#D8D8D0]"
    >
      {/* Label */}
      <motion.p
        className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        ✦ Stack
      </motion.p>

      <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-0">
        {/* Heading */}
        <motion.h2
          className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight text-[#0A0A0A] md:w-1/3 md:pr-12 flex-shrink-0"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Tools I{" "}
          <motion.span
            className="bg-[#FF5500] text-white px-2 rounded inline-block"
            whileHover={{
              scale: 1.1,
              rotate: -2,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
          >
            trust
          </motion.span>
          <br />
          in production.
        </motion.h2>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 flex-1 border border-[#D8D8D0] rounded-2xl overflow-hidden"
          style={{ perspective: "1000px", rotateX }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {groups.map((g, i) => (
            <motion.div
              key={g.category}
              className={`p-6 flex flex-col gap-3 ${
                i % 2 === 0 ? "border-r border-[#D8D8D0]" : ""
              } ${i < 2 ? "border-b border-[#D8D8D0]" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                backgroundColor: "rgba(255, 85, 0, 0.03)",
                transition: { duration: 0.3 },
              }}
            >
              <motion.span
                className="text-xs uppercase tracking-widest text-[#888] font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {g.category}
              </motion.span>
              <motion.ul
                className="flex flex-col gap-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {g.items.map((item) => (
                  <motion.li
                    key={item}
                    className="text-sm text-[#0A0A0A] font-medium flex items-center gap-2"
                    variants={itemVariants}
                    whileHover={{
                      x: 6,
                      color: "#FF5500",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <motion.span
                      className="w-1 h-1 rounded-full bg-[#FF5500] flex-shrink-0"
                      whileHover={{ scale: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
