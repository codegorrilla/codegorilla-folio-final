"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip);

const Preloader = ({ onComplete }) => {
  const container = useRef(null);
  const textRef = useRef(null);
  const blueTextRef = useRef(null);
  const counterRef = useRef(null);
  const counterWrapperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(true);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false);
          onComplete?.(); //if (onComplete) onComplete();
        },
      });

      const counterData = { value: 0 };

      // 1. Loading Phase: Fill text with blue from left to right, and count 0-100
      tl.to(blueTextRef.current, {
        clipPath: "inset(-20% -20% -20% -20%)",
        duration: 2,
        ease: "power2.inOut",
      }).to(
        counterData,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.floor(counterData.value)
                .toString()
                .padStart(3, "0");
            }
          },
        },
        "<", // Sync with text fill
      );

      const mm = gsap.matchMedia();

      // ── 2. The Outro & Text Handoff ──────────────────────────────────────
      // Fade out the background to reveal the page (common to both)
      tl.to(
        container.current,
        {
          backgroundColor: "rgba(255, 255, 255, 0)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "+=0.2",
      );

      // Slide down and fade out the terminal counter (common to both)
      tl.to(
        counterWrapperRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<",
      );

      mm.add("(min-width: 992px)", () => {
        // Desktop: The text physically fits itself over the header logo using Flip
        const headerLogo = document.querySelector("#header-logo");
        if (headerLogo) {
          tl.add(
            Flip.fit(textRef.current, headerLogo, {
              duration: 1.5, // Slower, clearer transition
              ease: "power3.inOut",
              scale: true, // Use scale instead of width/height
            }),
            "<", // Start exactly as the background starts fading
          );
        } else {
          // Fallback
          tl.to(
            textRef.current,
            {
              scale: 0.3,
              y: "-40vh",
              opacity: 0,
              duration: 1.5,
              ease: "power3.inOut",
            },
            "<",
          );
        }
      });

      mm.add("(max-width: 991px)", () => {
        // Mobile/Tablet: A stable "Fade & Slide" transition instead of Flip
        // This avoids layout calculation glitches on mobile Chrome
        tl.to(
          textRef.current,
          {
            y: -100, // Slide up towards the header area
            scale: 0.4,
            opacity: 0,
            duration: 1.5,
            ease: "power3.inOut",
          },
          "<",
        );
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  if (!isMounted) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] bg-brand-blue flex flex-col md:flex-row justify-center items-center pointer-events-none"
    >
      <div
        ref={textRef}
        className="relative text-[12vw] sm:text-[10vw] md:text-[8rem] font-main font-black tracking-tighter lowercase leading-none whitespace-nowrap w-max max-w-none"
        style={{ fontKerning: "none" }}
      >
        {/* Base Outline/Faded Text */}
        <span className="text-white opacity-30">code.gorrilla</span>

        {/* Orange Fill Text (Clipped initially) */}
        <span
          ref={blueTextRef}
          className="absolute inset-0 text-white"
          style={{ clipPath: "inset(-20% 100% -20% -20%)" }}
        >
          code.gorrilla
        </span>
      </div>

      {/* Terminal Hacker Counter */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 md:top-auto md:left-auto md:translate-x-0 md:bottom-10 md:right-10 whitespace-nowrap">
        <div
          ref={counterWrapperRef}
          className="font-main font-black text-white/50 text-[11px] md:text-base text-center lowercase tracking-widest"
        >
          [ loading.gorrilla ...{" "}
          <span ref={counterRef} className="text-white">
            000
          </span>
          % ]
        </div>
      </div>
    </div>
  );
};

export default Preloader;
