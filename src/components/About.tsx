"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Scroll-driven transforms for cinematic reveal
  const labelOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0, 0.1], [30, 0]);

  const headingOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const headingX = useTransform(scrollYProgress, [0.05, 0.2], [-80, 0]);

  const p1Opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const p1X = useTransform(scrollYProgress, [0.2, 0.35], [60, 0]);

  const p2Opacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const p2Y = useTransform(scrollYProgress, [0.35, 0.5], [40, 0]);

  const p3Opacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const p3Y = useTransform(scrollYProgress, [0.5, 0.65], [40, 0]);

  const arrowsOpacity = useTransform(scrollYProgress, [0.65, 0.8], [0, 1]);
  const arrowsX = useTransform(scrollYProgress, [0.65, 0.8], [-30, 0]);

  // Exit: everything fades as we scroll past
  const exitOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.85, 1], [1, 0.95]);

  return (
    <section id="about" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#F7F6F2]">
        <motion.div
          className="max-w-6xl mx-auto px-6 w-full"
          style={{ opacity: exitOpacity, scale: exitScale }}
        >
          {/* Label */}
          <motion.p
            className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
            style={{ opacity: labelOpacity, y: labelY }}
          >
            ✦ About Me
          </motion.p>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Heading */}
            <motion.div style={{ opacity: headingOpacity, x: headingX }}>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight tracking-tight text-[#0A0A0A]">
                I write code the way a{" "}
                <motion.span
                  className="bg-[#FF5500] text-white px-2 rounded inline-block"
                  whileHover={{ scale: 1.1, rotate: -2 }}
                >
                  good sentence
                </motion.span>{" "}
                is written—clear, purposeful, nothing wasted.
              </h2>
            </motion.div>

            {/* Body */}
            <div className="flex flex-col gap-6 text-[#555] leading-relaxed">
              <motion.p style={{ opacity: p1Opacity, x: p1X }}>
                Hi, I&apos;m{" "}
                <strong className="text-[#0A0A0A]">Your Name</strong> — a
                full-stack developer based in [Your City]. I specialise in
                React, Next.js, and Node.js, building products that feel as good
                as they perform.
              </motion.p>
              <motion.p style={{ opacity: p2Opacity, y: p2Y }}>
                My background sits at the intersection of engineering and
                design. I care deeply about the details: the micro-interaction
                that makes something feel alive, the query that keeps a page
                snappy, the component API that your future self will thank you
                for.
              </motion.p>
              <motion.p style={{ opacity: p3Opacity, y: p3Y }}>
                When I&apos;m not shipping features, I&apos;m reading, sketching
                interfaces, or contributing to open-source. I believe great
                software is a form of craft.
              </motion.p>

              <motion.div
                className="pt-4 flex flex-col gap-3 text-sm"
                style={{ opacity: arrowsOpacity, x: arrowsX }}
              >
                {[
                  <>
                    Currently working at{" "}
                    <strong className="text-[#0A0A0A]">Company Name</strong>
                  </>,
                  "Open to freelance & consulting",
                  "Based in [Your City], remote-friendly",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className="text-[#FF5500] font-bold"
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
