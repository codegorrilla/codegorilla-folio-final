"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AboutPage from "@/app/pages/AboutPage";
import WorkPage from "@/app/pages/WorkPage";

gsap.registerPlugin(ScrollTrigger);

const StickyCards = () => {
  const container = useRef(null);

  //Sticky card animation
  useGSAP(() => {
    const stickyCards = document.querySelectorAll(".sticky-card");

    stickyCards.forEach((card, index) => {
      if (index < stickyCards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: stickyCards[stickyCards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
      }
    });
  });

  return (
    <section className="w-full h-full relative bg-white">
      <AboutPage className="w-full min-h-screen flex gap-3 p-20 relative bg-brand-dark text-white will-change-transform sticky-card">
        About
      </AboutPage>
      <WorkPage className="w-full min-h-screen flex gap-3 p-20 relative bg-brand-yellow text-white will-change-transform sticky-card">
        Work
      </WorkPage>
    </section>
  );
};

export default StickyCards;
