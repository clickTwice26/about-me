"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const socials = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter/X", href: "https://twitter.com" },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Dark background wipe-in
  const bgOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Content reveals
  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  const word1Opacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const word1Y = useTransform(scrollYProgress, [0.15, 0.3], [80, 0]);

  const badgeOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const badgeScale = useTransform(scrollYProgress, [0.25, 0.4], [0.5, 1]);
  const badgeRotate = useTransform(scrollYProgress, [0.25, 0.4], [-12, 0]);

  const word2Opacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const word2Y = useTransform(scrollYProgress, [0.35, 0.5], [80, 0]);

  const rightOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.5, 0.65], [60, 0]);

  // Glow
  const glowScale = useTransform(scrollYProgress, [0.3, 0.9], [0.3, 1.8]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [0, 0.4, 0.15]);

  // Footer reveal at the end
  const footerOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.7, 0.85], [30, 0]);

  const year = new Date().getFullYear();

  return (
    <section id="contact" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Dark background wipe */}
        <motion.div
          className="absolute inset-0 bg-[#0A0A0A]"
          style={{ opacity: bgOpacity }}
        />

        {/* Animated glow orb */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#FF5500] blur-[150px] pointer-events-none"
          style={{ scale: glowScale, opacity: glowOpacity }}
        />

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-center">
          <motion.p
            className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
            style={{ opacity: labelOpacity }}
          >
            ✦ Contact
          </motion.p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
            {/* Headline */}
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
                <motion.span
                  className="inline-block text-white"
                  style={{ opacity: word1Opacity, y: word1Y }}
                >
                  GOT AN IDEA?{" "}
                </motion.span>
                <motion.span
                  className="bg-[#FF5500] text-white px-3 rounded-md inline-block"
                  style={{
                    opacity: badgeOpacity,
                    scale: badgeScale,
                    rotate: badgeRotate,
                  }}
                  whileHover={{ scale: 1.1, rotate: -3 }}
                >
                  LET&apos;S
                </motion.span>{" "}
                <motion.span
                  className="inline-block text-white"
                  style={{ opacity: word2Opacity, y: word2Y }}
                >
                  BUILD IT.
                </motion.span>
              </h2>
            </div>

            {/* Right side */}
            <motion.div
              className="flex flex-col gap-6 flex-shrink-0 max-w-xs"
              style={{ opacity: rightOpacity, x: rightX }}
            >
              <p className="text-sm text-[#888] leading-relaxed">
                I&apos;m always open to new projects, collaborations, and
                conversations. Drop me a line — I reply within 24 hours.
              </p>

              <motion.a
                href="mailto:hello@yourname.dev"
                className="group flex items-center gap-3 text-white font-bold text-lg"
                whileHover={{ x: 8, color: "#FF5500" }}
              >
                <motion.span
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0A0A0A] text-sm"
                  whileHover={{
                    backgroundColor: "#FF5500",
                    color: "#ffffff",
                    scale: 1.1,
                    rotate: 45,
                  }}
                >
                  ↗
                </motion.span>
                hello@yourname.dev
              </motion.a>

              <div className="flex gap-4 pt-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-widest text-[#666] font-medium"
                    whileHover={{ color: "#FF5500", y: -2 }}
                  >
                    {s.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Integrated footer — reveals at end of scroll */}
        <motion.footer
          className="relative z-10 border-t border-[#222] px-6 py-6"
          style={{ opacity: footerOpacity, y: footerY }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-[#555] font-mono">
              © {year} Your Name — Built with Next.js &amp; Tailwind CSS
            </p>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs text-[#555] uppercase tracking-widest">
                All systems operational
              </span>
            </div>
            <p className="text-xs text-[#555] uppercase tracking-widest">
              Designed &amp; developed with care.
            </p>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
