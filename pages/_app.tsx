import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ParallaxProvider } from "react-scroll-parallax";
import Head from "next/head";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

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
          content="Technical portfolio powered by Sanity CMS with projects, research papers, links, and resume content."
        />
        <meta name="theme-color" content="#050816" />
        <meta property="og:title" content="Husain Shahid Rao" />
        <meta
          property="og:description"
          content="Technical portfolio powered by Sanity CMS with projects, research papers, links, and resume content."
        />
        <meta property="og:url" content="https://husain.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <div className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Component {...pageProps} />
      </div>
    </ParallaxProvider>
  );
}

export default MyApp;
