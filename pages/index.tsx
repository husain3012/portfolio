import {
  motion,
  LazyMotion,
  domAnimation,
  useViewportScroll,
} from "framer-motion";
import React from "react";
import EvenSection from "../components/HomeSections/SectionEven";
import OddSection from "../components/HomeSections/SectionOdd";
import Navbar from "../components/Navbar";
import { SplashScreen } from "../components/SplashScreen";
import SmoothScroll from "../components/Layout/SmoothScroll";
import { useMediaQuery } from "react-responsive";
import {
  AiOutlineLinkedin,
  AiOutlineGithub,
  AiOutlineMail,
} from "react-icons/ai";
import Link from "next/link";
const Home = () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  return (
    <div>
      <SplashScreen splashText="Hi!">
        {/* <Navbar /> */}
        <SmoothScroll active={isBigScreen}>
          <OddSection
            fallbackColor="#000"
            background="/husain-1-square.jpg"
            heading="It's Husain!"
            content={`A full stack developer, designer, and a computer science student at Jamia Millia Islamia, New Delhi.\nI love to code 💖`}
          />
          <EvenSection
            fallbackColor="#fff"
            textColor="#000"
            background="/technologies-white.jpg"
            heading="These are my tools"
          >
            {/* <p>
              I use these tools to build my projects. I am always open to learning new technologies and
              frameworks.

            </p> */}
            <p className="text-black">
              <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                Next.js
              </a>
              ,{" "}
              <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
                React
              </a>
              ,{" "}
              <a
                href="https://www.typescriptlang.org/"
                target="_blank"
                rel="noreferrer"
              >
                Typescript
              </a>
              ,{" "}
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noreferrer"
              >
                TailwindCSS
              </a>
              ,{" "}
              <a
                href="https://framer.com/motion/"
                target="_blank"
                rel="noreferrer"
              >
                Framer Motion
              </a>
              , <br />
              <a
                href="https://www.mongodb.com/"
                target="_blank"
                rel="noreferrer"
              >
                MongoDB
              </a>
              ,{" "}
              <a href="https://expressjs.com/" target="_blank" rel="noreferrer">
                Express
              </a>
              ,{" "}
              <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer">
                Node.js
              </a>
              , <br />
              <a
                href="https://www.python.org/"
                target="_blank"
                rel="noreferrer"
              >
                Python
              </a>
              ,{" "}
              <a
                href="https://www.postgresql.org/"
                target="_blank"
                rel="noreferrer"
              >
                PostgreSQL
              </a>
              ,{" "}
              <a
                href="https://www.docker.com/"
                target="_blank"
                rel="noreferrer"
              >
                Docker
              </a>
              ,{" "}
              <a href="https://www.nginx.com/" target="_blank" rel="noreferrer">
                Nginx
              </a>
              ,{" "}
              <a
                href="https://www.digitalocean.com/"
                target="_blank"
                rel="noreferrer"
              >
                DigitalOcean
              </a>
              ,{" "}
              <a href="https://www.linux.org/" target="_blank" rel="noreferrer">
                Linux
              </a>
            </p>
          </EvenSection>
          <OddSection
            fallbackColor="#000"
            background="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=726&q=80"
            heading="Get in Touch!"
          >
            <p className="text-white">
              I am always open to new opportunities. If you have any questions
              or want to work with me, feel free to contact me.
            </p>
            <br />
            <div className="flex flex-row space-x-4">
              <Link href="mailto:husainshahidrao@gmail.com">
                <a className="text-white bg-black p-2 rounded-md">
                  <AiOutlineMail  size={24} className="inline-block mr-2" />
                  Gmail
                </a>
              </Link>
              <Link href="https://www.linkedin.com/in/husain3012/">
                <a className="text-white bg-black p-2 rounded-md">
                  <AiOutlineLinkedin size={24} className="inline-block mr-2" />
                  LinkedIn
                </a>
              </Link>
              <Link href="https://www.github.com/husain3012">
                <a className="text-white bg-black p-2 rounded-md">
                  <AiOutlineGithub size={24} className="inline-block mr-2" />
                  GitHub
                </a>
              </Link>
            </div>
          </OddSection>
        </SmoothScroll>
      </SplashScreen>
    </div>
  );
};

export default Home;
