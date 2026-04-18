"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
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

  const inView = useInView(ref, { once: false, amount: 0.5 });
  const footerOpacity = useTransform(scrollYProgress, [0.7, 0.88], [0, 1]);
  const footerY = useTransform(scrollYProgress, [0.7, 0.88], [30, 0]);

  const year = new Date().getFullYear();

  return (
    <section id="contact" ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden bg-[#F7F6F2]">

        {/* Main content */}
        <motion.div
          className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8">
            ✦ Contact
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
            {/* Headline */}
            <div className="max-w-2xl">
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-[#0A0A0A]">
                GOT AN IDEA?{" "}
                <span className="bg-[#FF5500] text-white px-3 rounded-md inline-block">
                  LET&apos;S
                </span>{" "}
                BUILD IT.
              </h2>
            </div>

            {/* Right side */}
            <div className="flex flex-col gap-6 flex-shrink-0 max-w-xs">
              <p className="text-base text-[#555] leading-relaxed">
                I&apos;m always open to new projects, collaborations, and
                conversations. Drop me a line — I reply within 24 hours.
              </p>

              <motion.a
                href="mailto:hello@yourname.dev"
                className="group flex items-center gap-3 text-[#0A0A0A] font-bold text-lg"
                whileHover={{ x: 8 }}
              >
                <motion.span
                  className="w-10 h-10 rounded-full border border-[#0A0A0A] flex items-center justify-center text-[#0A0A0A] text-sm"
                  whileHover={{
                    backgroundColor: "#FF5500",
                    borderColor: "#FF5500",
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
                    className="text-xs uppercase tracking-widest text-[#888] font-medium"
                    whileHover={{ color: "#FF5500", y: -2 }}
                  >
                    {s.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="border-t border-[#D8D8D0] px-6 py-6"
          style={{ opacity: footerOpacity, y: footerY }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-[#888] font-mono">© {year} Shagato</p>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs text-[#888] uppercase tracking-widest">
                All systems operational
              </span>
            </div>
            <p className="text-xs text-[#888] uppercase tracking-widest">
              Designed &amp; developed with care.
            </p>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}
