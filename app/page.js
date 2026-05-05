"use client";
import React from "react";
import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";

import StickyCards from "@/components/StickyCards";
import Preloader from "@/components/anim/Preloader";

const Home = () => {
  const lenis = useLenis((lenis) => {
    //called every scroll
    // console.log(lenis);
  });

  return (
    <>
      <Preloader />
      <ReactLenis root />
      <StickyCards />
      <footer className="w-full min-h-134.5">footer</footer>
    </>
  );
};

export default Home;
