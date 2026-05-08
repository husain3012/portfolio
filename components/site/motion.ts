import { useEffect, useState } from "react";
import { useReducedMotion, type Variants } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const viewportSettings = {
  once: true,
  amount: 0.2,
} as const;

export function useSiteReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [allowReducedMotion, setAllowReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePreference = () => setAllowReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener?.("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion && allowReducedMotion;
}

export function createFadeUp(distance = 24, delay = 0): Variants {
  return {
    hidden: {
      opacity: 0,
      y: distance,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay,
        duration: 0.78,
        ease: motionEase,
      },
    },
  };
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const softScaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: motionEase,
    },
  },
};