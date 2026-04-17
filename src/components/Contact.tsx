"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const socials = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter/X", href: "https://twitter.com" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 px-6 max-w-6xl mx-auto border-t border-[#D8D8D0] relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#FF5500]/[0.06] blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        ✦ Contact
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-12"
        style={{ scale, opacity }}
      >
        {/* Headline */}
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-[#0A0A0A]">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              GOT AN IDEA?{" "}
            </motion.span>
            <motion.span
              className="bg-[#FF5500] text-white px-3 rounded-md inline-block"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{
                scale: 1.1,
                rotate: -3,
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
            >
              LET&apos;S
            </motion.span>{" "}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              BUILD IT.
            </motion.span>
          </h2>
        </div>

        {/* Right side */}
        <motion.div
          className="flex flex-col gap-6 flex-shrink-0 max-w-xs"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <p className="text-sm text-[#555] leading-relaxed">
            I&apos;m always open to new projects, collaborations, and
            conversations. Drop me a line — I reply within 24 hours.
          </p>

          <motion.a
            href="mailto:hello@yourname.dev"
            className="group flex items-center gap-3 text-[#0A0A0A] font-bold text-lg"
            whileHover={{ x: 8, color: "#FF5500" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.span
              className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white text-sm"
              whileHover={{
                backgroundColor: "#FF5500",
                scale: 1.1,
                rotate: 45,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              ↗
            </motion.span>
            hello@yourname.dev
          </motion.a>

          <div className="flex gap-4 pt-2">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-[#888] font-medium"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                whileHover={{
                  color: "#0A0A0A",
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                {s.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
