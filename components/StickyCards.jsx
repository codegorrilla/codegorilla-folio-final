// components/StickyCards.jsx
"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import HeroPage from "@/app/pages/hero/page";
import AboutPage from "@/app/pages/about/page";
import WorkPage from "@/app/pages/work/page";
import FooterPage from "@/app/pages/footer/page";
import { TextGradientFill } from "@/components/anim/TextGradientFill";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

const StickyCards = () => {
  const container = useRef(null);
  const sentinelRef = useRef(null);
  const { theme } = useTheme();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const stickyCards = document.querySelectorAll(".sticky-card");

        stickyCards.forEach((card, index) => {
          // Pin all cards except the last one
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
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <section className="w-full h-full relative" ref={container}>
      <HeroPage className="w-full min-h-screen rounded-0 lg:rounded-t-2xl relative flex flex-col justify-center items-center bg-brand-blue pt-4 overflow-hidden sticky-card z-[1]" />

      <AboutPage
        className={`w-full min-h-screen rounded-0 lg:rounded-t-2xl flex gap-3 p-6 md:p-10 lg:p-20 relative transition-colors duration-500 will-change-transform sticky-card z-[2] ${
          theme === "light"
            ? "bg-white text-brand-dark"
            : "bg-brand-dark text-white"
        }`}
      >
        <TextGradientFill />
      </AboutPage>

      {/*
        Scroll spacer — sits between About and Work in the DOM.
        Because About is pinned with pinSpacing:false, this spacer is visually
        covered by the pinned About card. Its height extends the scroll distance
        from About hitting the top → Work hitting the top, giving the text-fill
        animation enough room to complete before Work slides in.
        Adjust height to control fill speed (taller = slower fill).
      */}
      <div aria-hidden="true" className="hidden min-[1200px]:block h-[3000px]" />

      <WorkPage
        className={`w-full min-h-screen rounded-0 lg:rounded-t-2xl flex gap-3 p-6 md:p-10 lg:p-20 relative will-change-transform sticky-card z-[3] ${
          theme === "light"
            ? "bg-white text-brand-orange"
            : "bg-brand-yellow text-white"
        }`}
      ></WorkPage>

      {/* 
        Final spacer to reveal the footer. 
        As we scroll this distance, the pinned cards will eventually unpin 
        or the container will finish, revealing the 'fixed' footer behind.
        Also used as the ScrollTrigger target for footer animations.
      */}
      <div ref={sentinelRef} aria-hidden="true" className="h-screen w-full pointer-events-none" />

      <FooterPage className="flex gap-3 p-6 md:p-10 lg:p-20 text-white" triggerRef={sentinelRef}></FooterPage>
    </section>
  );
};

export default StickyCards;
