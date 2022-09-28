import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { EaseInLine } from "./EaseInLine";
import { Roll } from "react-awesome-reveal";

export const SplashScreen = ({ children, splashText }: { children: React.ReactNode, splashText:string|null }) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [unmountTrash, setUnmountTrash] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      setAnimationComplete(true);
    }, 2000);
    setWindowWidth(Math.max(window.innerWidth, window.outerWidth));
    return () => {
      setWindowWidth(0);
    };
  }, []);
  useEffect(() => {
    if (animationComplete) {
      setTimeout(() => {
        setUnmountTrash(true);
      }, 3000);
    }
  }, [animationComplete]);

  return (
    <>
      {!unmountTrash && (
        <motion.div
          animate={{
            // scale: 0,
            x: 0 - windowWidth,
            transition: {
              delay: 2,
              type: "spring",
              damping: 20,
              stiffness: 180,
            },
          }}
          className="h-screen w-screen absolute top-0 left-0 bg-black flex content-center items-center justify-center z-[100]"
        >
          <motion.div
            animate={{
              x: 1.2 * windowWidth,
              opacity: 0,

              transition: {
                delay: 2,
                type: "spring",
                damping: 20,
                stiffness: 180,
              },
            }}
          >
            <Roll>
              <h1 className="text-center sm:text-6xl text-4xl font-bold text-white">{splashText}</h1>
            </Roll>
          </motion.div>
        </motion.div>
      )}

      {animationComplete && children}
    </>
  );
};
