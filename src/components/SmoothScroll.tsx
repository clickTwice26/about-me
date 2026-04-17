"use client";

import { ReactNode, useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

/*
  Magnetic scroll snapping:
  - Each <section> is a snap target
  - When scroll settles near a section boundary (first/last ~10%), it auto-scrolls
    to lock onto that section's start (or the next section)
  - The middle ~80% is free-scroll for scroll-driven animations
  - Stats (short section) snaps fully — any proximity pulls you in
*/

const SNAP_ZONE = 0.10;        // 10% of section height = magnetic zone
const IDLE_DELAY = 120;         // ms after last scroll event to trigger snap
const SNAP_DURATION = 1.0;     // snap animation duration
const MIN_SNAP_DISTANCE = 8;   // px — don't snap if already close enough

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isSnapping = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapToNearest = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis || isSnapping.current) return;

    const sections = Array.from(document.querySelectorAll("main > section")) as HTMLElement[];
    if (!sections.length) return;

    const scrollTop = lenis.scroll;
    const vh = window.innerHeight;
    let snapTarget: number | null = null;

    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
      const top = el.offsetTop;
      const height = el.offsetHeight;
      const scrollable = Math.max(height - vh, 1);

      // How far through this section (0 = at top, 1 = scrolled to end)
      const progress = (scrollTop - top) / scrollable;

      // Short sections (Stats-like, < 1.5vh) — snap to their top if we're anywhere near
      if (height < vh * 1.5) {
        if (progress > -0.3 && progress < 1.3) {
          const distToTop = Math.abs(scrollTop - top);
          const distToEnd = Math.abs(scrollTop - (top + height));
          if (distToTop < vh * 0.4) {
            snapTarget = top;
            break;
          } else if (distToEnd < vh * 0.4) {
            // Snap to next section if closer to bottom
            const nextSection = sections[i + 1];
            if (nextSection) {
              snapTarget = nextSection.offsetTop;
              break;
            }
          }
        }
        continue;
      }

      // Tall sections — magnetic edges only
      if (progress >= -0.02 && progress <= 1.02) {
        if (progress < SNAP_ZONE) {
          // In the entry zone — pull to section start
          snapTarget = top;
          break;
        } else if (progress > 1 - SNAP_ZONE) {
          // In the exit zone — push to next section (or end of this one)
          const nextSection = sections[i + 1];
          snapTarget = nextSection ? nextSection.offsetTop : top + scrollable;
          break;
        }
        // Middle zone — free scroll, no snap
        break;
      }
    }

    if (snapTarget !== null && Math.abs(scrollTop - snapTarget) > MIN_SNAP_DISTANCE) {
      isSnapping.current = true;
      lenis.scrollTo(snapTarget, {
        duration: SNAP_DURATION,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
        onComplete: () => {
          isSnapping.current = false;
        },
      });
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Listen for scroll events — debounce to detect idle
    lenis.on("scroll", () => {
      if (isSnapping.current) return;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(snapToNearest, IDLE_DELAY);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      lenis.destroy();
    };
  }, [snapToNearest]);

  return <>{children}</>;
}
