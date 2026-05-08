import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const splashSeenKey = "portfolio:first-visit-splash:v3";
const browserVisitCountKey = "portfolio:browser-visit-count";
const countApiUrl = "https://api.countapi.xyz/hit/husain3012-portfolio/visits";
const goodbyeRedirectUrl = "https://pointerpointer.com/";
const splashDurationMs = 8000;

type FirstVisitSplashProps = {
  children: React.ReactNode;
};

type VisitorLabel = "Global visitor" | "Browser visit";

function formatVisitCount(value: number) {
  return value.toString().padStart(3, "0");
}

export default function FirstVisitSplash({ children }: FirstVisitSplashProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [visitCount, setVisitCount] = useState(1);
  const [visitorLabel, setVisitorLabel] = useState<VisitorLabel>("Browser visit");
  const [timeRemainingMs, setTimeRemainingMs] = useState(splashDurationMs);

  const handleEnter = () => {
    setShowSplash(false);
  };

  const handleGoodbye = () => {
    setShowSplash(false);

    window.setTimeout(() => {
      window.location.assign(goodbyeRedirectUrl);
    }, 260);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawVisitCount = window.localStorage.getItem(browserVisitCountKey);
    const nextVisitCount = Number.parseInt(rawVisitCount || "0", 10) + 1;
    const hasSeenSplash = window.localStorage.getItem(splashSeenKey) === "1";

    window.localStorage.setItem(browserVisitCountKey, String(nextVisitCount));
    setVisitCount(nextVisitCount);
    setShowSplash(!hasSeenSplash);

    if (!hasSeenSplash) {
      window.localStorage.setItem(splashSeenKey, "1");
    }

    setIsMounted(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2500);

    fetch(countApiUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Counter request failed: ${response.status}`);
        }

        const payload = (await response.json()) as { value?: number };

        if (typeof payload.value === "number") {
          setVisitCount(payload.value);
          setVisitorLabel("Global visitor");
        }
      })
      .catch(() => {
        setVisitCount(nextVisitCount);
        setVisitorLabel("Browser visit");
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!showSplash) {
      return;
    }

    setTimeRemainingMs(splashDurationMs);

    const timeoutId = window.setTimeout(() => {
      setShowSplash(false);
    }, splashDurationMs);

    const intervalId = window.setInterval(() => {
      setTimeRemainingMs((currentValue) => Math.max(0, currentValue - 100));
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [showSplash]);

  const countdownSeconds = Math.ceil(timeRemainingMs / 1000);

  return (
    <>
      {children}
      <AnimatePresence>
        {isMounted && showSplash ? (
          <motion.div
            className="fixed inset-0 z-[140] overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(255,255,255,0.04),transparent_12%),radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.03),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />
            <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:inset-x-16" />
            <div className="absolute inset-x-10 bottom-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:inset-x-16" />
            <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
              <motion.div
                className="relative w-full max-w-4xl px-2 sm:px-6"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative flex min-h-[78vh] flex-col justify-center">
                  <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">
                    <span className="h-px w-10 bg-amber-200/45" />
                    Initializing
                  </div>

                  <motion.h1
                    className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-7xl"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Husain Shahid Rao
                  </motion.h1>

                  <motion.p
                    className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Entering the archive shortly.
                  </motion.p>

                  <motion.div
                    className="mt-10 flex max-w-2xl flex-wrap items-end gap-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        {visitorLabel}
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-white">
                        #{formatVisitCount(visitCount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        Countdown
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-white">
                        0{countdownSeconds}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-8 max-w-xl"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="h-px overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full origin-left bg-amber-200/70"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: splashDurationMs / 1000, ease: "linear" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-12 flex flex-wrap items-center gap-4"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      className="action-link"
                      onClick={handleEnter}
                    >
                      Enter
                    </button>
                    <button
                      type="button"
                      className="muted-link"
                      onClick={handleGoodbye}
                    >
                      Goodbye
                    </button>
                    <div className="text-sm text-zinc-500">
                      Auto-enter in {countdownSeconds}s.
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}