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
  useGSAP(
    () => {
      const stickyCards = document.querySelectorAll(".sticky-card");

      stickyCards.forEach((card, index) => {
        // this pins all the cards except the last one
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

        // this animates the cards i.e. scaling down and rotating
        if (index < stickyCards.length - 1) {
          ScrollTrigger.create({
            trigger: stickyCards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              const scale = 1 - progress * 0.25;
              const rotation = (index % 2 === 0 ? 5 : -5) * progress;
              const afterOpacity = progress;

              gsap.set(card, {
                scale: scale,
                rotation: rotation,
                "--after-opacity": afterOpacity,
              });
            },
          });
        }
      });
    },
    { scope: container },
  );

  return (
    <section className="w-full h-full relative bg-white" ref={container}>
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
