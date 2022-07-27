import { NFTProvider } from "context/NFTContext";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Script from "next/script";
import React from "react";
import { Navbar, Footer } from ".";

const AppProviders = ({ children }) => {
  return (
    <NFTProvider>
      <ThemeProvider attribute="class">
        <Head>
          <title>NFT Marketplace - Chris Risner</title>
          <meta name="description" content="NFT Marketplace created with Next JS" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="dark:bg-nft-dark bg-white min-h-screen">
          <Navbar />
          <div className="pt-65">{children}</div>
          <Footer />
        </div>
        <Script
          src="https://kit.fontawesome.com/d30a15a549.js"
          crossorigin="anonymous"
        />
      </ThemeProvider>
    </NFTProvider>
  );
};

export default AppProviders;
