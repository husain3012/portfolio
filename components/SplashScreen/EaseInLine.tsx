import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
export const EaseInLine = () => {
  const [windowWidth, setWindowWidth] = useState(2000);

  useEffect(() => {
    setWindowWidth(Math.max(window.innerWidth));
    return () => {
      setWindowWidth(0);
    };
  }, []);
  return (
    <motion.div
      initial={{
        x: 0 - windowWidth,
      }}
      animate={{
        x: 0,
        transition: {
          delay: 0.38,
          type: "spring",
          damping: 50,
          stiffness: 400,
        },
      }}
      className="h-2 w-72 sm:w-96 mx-auto bg-primary-light shadow-lg rounded"
    ></motion.div>
  );
};
