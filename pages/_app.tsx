import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ParallaxProvider } from "react-scroll-parallax";
import Head from "next/head";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import FirstVisitSplash from "../components/site/FirstVisitSplash";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ParallaxProvider>
      <Head>
        <title>Husain Shahid Rao</title>
        <meta
          name="description"
          content="Portfolio with projects, research, links, and resume content."
        />
        <meta property="og:title" content="Husain Shahid Rao" />
        <meta
          property="og:description"
          content="Portfolio with projects, research, links, and resume content."
        />
        <meta property="og:url" content="https://husain.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className={`${displayFont.variable} ${bodyFont.variable}`}>
        <FirstVisitSplash>
          <Component {...pageProps} />
        </FirstVisitSplash>
      </div>
    </ParallaxProvider>
  );
}

export default MyApp;
