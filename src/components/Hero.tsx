"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const letterVariants = {
  hidden: { y: 120, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay: 0.04 * i,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  }),
};

function AnimatedWord({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="inline-flex overflow-hidden">
      {word.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i + offset}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0.3, 0.7], [0, 10]);

  return (
    <section id="hero" ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-end pb-20 pt-32 px-6 max-w-6xl mx-auto overflow-hidden">
        <motion.div
          style={{ opacity, scale, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
        >
          {/* Available badge */}
          <motion.div
            className="mb-10"
            style={{ y: y3 }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span
              className="inline-flex items-center gap-2 border border-[#D8D8D0] rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#555]"
              whileHover={{ scale: 1.05, borderColor: "#FF5500" }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Available for work
            </motion.span>
          </motion.div>

          {/* Main headline — each line parallaxes at different speed */}
          <div className="mb-8">
            <h1 className="text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.03em] text-[#0A0A0A]">
              <motion.span className="block overflow-hidden" style={{ y: y1 }}>
                <AnimatedWord word="FULL-STACK" offset={0} />
              </motion.span>
              <motion.span className="block overflow-hidden" style={{ y: y2 }}>
                <AnimatedWord word="DEVELOPER" offset={10} />
              </motion.span>
              <motion.span
                className="block flex flex-wrap items-center gap-3"
                style={{ y: y3 }}
              >
                <motion.span
                  className="bg-[#FF5500] text-white px-4 py-1 rounded-md inline-block origin-left"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.215, 0.61, 0.355, 1] }}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                >
                  & DESIGNER
                </motion.span>
              </motion.span>
            </h1>
          </div>

          {/* Bottom row */}
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-[#D8D8D0] pt-8"
            style={{ y: y3 }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="max-w-md text-base text-[#555] leading-relaxed font-light">
              I build fast, thoughtful digital products that sit at the
              intersection of clean engineering and considered design. Every
              pixel earns its place.
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <motion.a
                href="#work"
                className="bg-[#0A0A0A] text-white font-semibold text-sm px-7 py-4 rounded-full"
                whileHover={{ scale: 1.05, backgroundColor: "#FF5500" }}
                whileTap={{ scale: 0.97 }}
              >
                View Work →
              </motion.a>
              <motion.a
                href="#about"
                className="border border-[#D8D8D0] text-[#0A0A0A] font-semibold text-sm px-7 py-4 rounded-full"
                whileHover={{ scale: 1.05, borderColor: "#0A0A0A" }}
                whileTap={{ scale: 0.97 }}
              >
                About Me
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#888]">
            Scroll to explore
          </span>
          <motion.div className="w-5 h-9 rounded-full border border-[#D8D8D0] flex justify-center pt-2">
            <motion.div
              className="w-1 h-2.5 rounded-full bg-[#FF5500]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
