import React from "react";
import Link from "next/link";
import { useViewportScroll, motion, motionValue } from "framer-motion";

const navItems = [

  {
    name: "Products",
    path: "/products",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const { scrollYProgress } = useViewportScroll();
  const [opacityState, setOpacityState] = React.useState(0);
  scrollYProgress.onChange((value) => {
    value = parseFloat(value.toFixed(3));

    if (opacityState === Math.min(value, 0.2) * 4.2) return;
    setOpacityState(Math.min(value, 0.2) * 4.2);
  });

  return (
    <div className="fixed z-50 w-screen flex  justify-between items-stretch h-16">
      <div className="fixed z-40  w-screen  h-16 flex bg-black justify-between items-stretch py-2 transition-all" style={{ opacity: opacityState }}></div>
      <div className="fixed z-50 flex w-screen h-16 border-b-[1px] lg:border-0 justify-between items-stretch">
        <div className="flex items-center">
          <h1 className="text-4xl text-white px-2 sm:px-12">Brand</h1>
        </div>
        <div className="flex gap-1 sm:gap-4 items-stretch sm:mr-12 mr-4">
          {navItems.map((item) => (
            <Link href={item.path} key={item.name}>
              <div className="flex items-center">
                <a className="text-white text-lg px-1">{item.name}</a>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
