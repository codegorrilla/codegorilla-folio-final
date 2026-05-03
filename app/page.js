"use client";
import React from "react";
import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import Header from "@/components/Header";
import StickyCards from "@/components/StickyCards";
import { MaskReveal } from "@/components/MaskReveal";

const Home = () => {
  const lenis = useLenis((lenis) => {
    //called every scroll
    console.log(lenis);
  });
  return (
    <>
      <Header />
      <ReactLenis root />
      <section className="w-full min-h-screen flex flex-col justify-center items-center bg-brand-blue pt-4">
        <article className="flex flex-col justify-center items-center font-accent text-white text-center uppercase lg-text-trigger leading-[0.75]">
          <div className="m-0 p-0 text-[clamp(3rem,21vw,350px)]">code</div>
          {/* <div className="m-0 p-0 text-[clamp(3rem,18vw,300px)]">gorrilla</div> */}
          <MaskReveal />
        </article>
      </section>
      <StickyCards />
      <footer className="w-full min-h-134.5">footer</footer>
    </>
  );
};

export default Home;
