"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F6F2]/90 backdrop-blur-sm border-b border-[#D8D8D0]"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="text-[#0A0A0A] font-bold text-lg tracking-tight hover:text-[#FF5500] transition-colors"
          >
            &lt;YN /&gt;
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <motion.a
                href={l.href}
                className="text-sm font-medium text-[#555] uppercase tracking-widest relative"
                whileHover={{ color: "#0A0A0A" }}
              >
                {l.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] bg-[#FF5500]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.a
          href="mailto:hello@yourname.dev"
          className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-medium px-5 py-2.5 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#FF5500",
          }}
          whileTap={{ scale: 0.97 }}
        >
          Hire me
        </motion.a>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-0.5 bg-[#0A0A0A]"
            animate={{
              rotate: open ? 45 : 0,
              y: open ? 8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-[#0A0A0A]"
            animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-[#0A0A0A]"
            animate={{
              rotate: open ? -45 : 0,
              y: open ? -8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden bg-[#F7F6F2] border-t border-[#D8D8D0] px-6 py-6 flex flex-col gap-4 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-[#0A0A0A]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                whileHover={{ x: 8, color: "#FF5500" }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="mailto:hello@yourname.dev"
              className="mt-2 inline-flex w-fit items-center gap-2 bg-[#0A0A0A] text-white text-sm font-medium px-5 py-2.5 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ scale: 1.05, backgroundColor: "#FF5500" }}
            >
              Hire me
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#FF5500] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.header>
  );
}
