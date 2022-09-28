import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";
import { SplashScreen, EaseInLine } from "../components/SplashScreen";

const Splash = ({ children }: { children: React.ReactNode }) => {
  const [unmountOnAnimationComplete, setUnmountOnAnimationComplete] = useState(false);
  const animation = useAnimation();

  const sequence = useCallback(async () => {
    await animation.start({
      y: 0,
      opacity: 1,
      transition: {
        delay: 1,
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    });
    await animation.start({
      y: 25,
      opacity: 0,
      transition: {
        delay: 1,
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    });
  }, []);
  useEffect(() => {
    sequence();
  }, []);

  return (
    <div>
      <div className="h-screen w-screen flex flex-col items-center content-center ">
        <div className="m-auto">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={animation} className="text-center text-4xl  sm:text-5xl font-bold text-primary-dark mb-4">
            BrandName
          </motion.h1>
          <EaseInLine />
        </div>
      </div>
    </div>
  );
};

export default Splash;
