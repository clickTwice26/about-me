"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";
import { useRef, useEffect } from "react";

const stats = [
  { value: 50, suffix: "+", label: "Projects Built" },
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Open Source Heart" },
];

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (active) {
      const ctrl = animate(count, value, {
        duration: 2.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      return ctrl.stop;
    }
  }, [active, count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative py-8 bg-[#F7F6F2]">
      <motion.div className="border-y border-[#D8D8D0]" style={{ opacity }}>
        <motion.div
          className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4"
          style={{ x }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`py-14 px-6 flex flex-col gap-1 ${
                i < stats.length - 1 ? "border-r border-[#D8D8D0]" : ""
              } ${i < 2 ? "border-b border-[#D8D8D0] md:border-b-0" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                backgroundColor: "rgba(255,85,0,0.04)",
                transition: { duration: 0.3 },
              }}
            >
              <span className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-[#0A0A0A] tracking-tight">
                <Counter value={s.value} suffix={s.suffix} active={isInView} />
              </span>
              <motion.span
                className="text-xs uppercase tracking-widest text-[#888]"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.4, duration: 0.5 }}
              >
                {s.label}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
