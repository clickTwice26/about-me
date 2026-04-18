"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Immediately visible when section enters view
  const inView = useInView(ref, { once: false, amount: 0.5 });

  // Exit: fade + shrink as we scroll past
  const exitOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.8, 1], [1, 0.95]);

  return (
    <section id="about" ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[#F7F6F2]">
        <motion.div
          className="max-w-6xl mx-auto px-6 w-full"
          style={{ opacity: exitOpacity, scale: exitScale }}
        >
          {/* Label */}
          <motion.p
            className="text-xs uppercase tracking-widest text-[#FF5500] font-semibold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            ✦ About Me
          </motion.p>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
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
            <motion.div
              className="flex flex-col gap-6 text-[#555] leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p>
                Hi, I&apos;m{" "}
                <strong className="text-[#0A0A0A]">Shagato Chowdhury</strong> — a
                full-stack developer based in Dhaka. I specialise in
                React, Next.js, and Node.js, building products that feel as good
                as they perform.
              </p>
              <p>
                My background sits at the intersection of engineering and
                design. I care deeply about the details: the micro-interaction
                that makes something feel alive, the query that keeps a page
                snappy, the component API that your future self will thank you
                for.
              </p>
              <p>
                When I&apos;m not shipping features, I&apos;m reading, sketching
                interfaces, or contributing to open-source. I believe great
                software is a form of craft.
              </p>

              <div className="pt-4 flex flex-col gap-3 text-sm">
                {[
                  <>
                    Currently working at{" "}
                    <strong className="text-[#0A0A0A]">DSAT School</strong>
                  </>,
                  "Open to freelance & consulting",
                  "Based in Dhaka, remote-friendly",
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
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
