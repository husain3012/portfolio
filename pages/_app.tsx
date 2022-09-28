import "../styles/globals.css";
import { useRef } from "react";
import type { AppProps } from "next/app";
import { ParallaxProvider } from "react-scroll-parallax";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ParallaxProvider>
      <Head>
        <title>Husain - Developer</title>
        <meta
          name="description"
          content="A full stack developer, designer, and a computer science student at Jamia Millia Islamia, New Delhi"
        />
        <meta property="og:title" content="Husain  - Developer" />
        <meta
          property="og:description"
          content="A full stack developer, designer, and a computer science student at Jamia Millia Islamia, New Delhi"
        />
        <meta property="og:url" content="https://husain.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
    </ParallaxProvider>
  );
}

export default MyApp;
