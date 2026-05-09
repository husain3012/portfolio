import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { createFadeUp, motionEase, staggerContainer, useSiteReducedMotion } from "./motion";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/signals", label: "Signals" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/links", label: "Links" },
  { href: "/resume", label: "Resume" },
];

const solarPlanets = [
  {
    name: "Mercury",
    orbitClass: "orbit-mercury",
    className: "planet-mercury",
  },
  {
    name: "Venus",
    orbitClass: "orbit-venus",
    className: "planet-venus",
  },
  {
    name: "Earth",
    orbitClass: "orbit-earth",
    className: "planet-earth",
  },
  {
    name: "Mars",
    orbitClass: "orbit-mars",
    className: "planet-mars",
  },
  {
    name: "Jupiter",
    orbitClass: "orbit-jupiter",
    className: "planet-jupiter",
  },
  {
    name: "Saturn",
    orbitClass: "orbit-saturn",
    className: "planet-saturn",
  },
  {
    name: "Neptune",
    orbitClass: "orbit-neptune",
    className: "planet-neptune",
  },
] as const;

const backgroundStars = [
  "star-1",
  "star-2",
  "star-3",
  "star-4",
  "star-5",
  "star-6",
  "star-7",
  "star-8",
  "star-9",
  "star-10",
  "star-11",
  "star-12",
] as const;

function isActive(currentPath: string, href: string) {
  return href === "/" ? currentPath === href : currentPath.startsWith(href);
}

type SiteLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function SiteLayout({
  children,
  title,
  description,
}: SiteLayoutProps) {
  const router = useRouter();
  const shouldReduceMotion = useSiteReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.18,
  });
  const pageTitle = title ? `${title} | Husain Shahid Rao` : "Husain Shahid Rao";
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>

      <div className="relative min-h-screen">
        <motion.div
          className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-white/40 via-white to-white/40"
          style={{ scaleX: progress }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="space-backdrop absolute inset-0" />
          <div className="space-starfield absolute inset-0">
            {backgroundStars.map((star) => (
              <span key={star} className={`space-star ${star}`} aria-hidden="true" />
            ))}
          </div>
          <motion.div
            className="solar-system"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: [0, 1, 0, -0.6, 0],
                    scale: [1, 1.01, 1, 0.996, 1],
                  }
            }
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="solar-glow" />
            <div className="solar-sun" />
            {solarPlanets.map((planet) => (
              <div key={planet.name} className={`solar-orbit ${planet.orbitClass}`}>
                <span
                  className={`solar-planet ${planet.className}`}
                  aria-hidden="true"
                />
              </div>
            ))}
          </motion.div>
          <div className="space-vignette absolute inset-0" />
        </div>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-8 lg:px-10">
          <motion.header
            className="panel sticky top-4 z-30 mb-10 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: motionEase }}
          >
            <div>
              <Link href="/" className="font-display text-xl font-semibold text-slate-50">
                Husain Shahid Rao
              </Link>
              <p className="mt-1 text-sm text-slate-400">
                Portfolio, research, and selected work.
              </p>
            </div>

            <nav className="flex flex-wrap gap-2 text-sm">
              {navItems.map((item) => {
                const active = isActive(router.pathname, item.href);
                return (
                  <Link key={item.href} href={item.href} className="block">
                    <motion.span
                      className={
                        active
                          ? "block rounded-full border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_30px_rgba(0,0,0,0.32)]"
                          : "block rounded-full border border-white/10 px-4 py-2 font-semibold text-slate-300"
                      }
                      whileHover={
                        shouldReduceMotion
                          ? undefined
                          : {
                              y: -2,
                              borderColor: "rgba(226,232,240,0.28)",
                              backgroundColor: "rgba(255,255,255,0.06)",
                            }
                      }
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.24, ease: motionEase }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>
          </motion.header>

          <motion.main
            className="flex-1"
            variants={shouldReduceMotion ? undefined : staggerContainer}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
          >
            {childrenArray.map((child, index) => (
              <motion.div
                key={React.isValidElement(child) && child.key != null ? String(child.key) : `section-${index}`}
                variants={shouldReduceMotion ? undefined : createFadeUp(26, index * 0.03)}
              >
                {child}
              </motion.div>
            ))}
          </motion.main>

          <motion.footer
            className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-500"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: motionEase }}
          >
            Built with Next.js, React, Tailwind CSS, and Sanity.
          </motion.footer>
        </div>
      </div>
    </>
  );
}