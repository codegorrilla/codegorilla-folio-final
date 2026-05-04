"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip);

const Preloader = ({ onComplete }) => {
  const container = useRef(null);
  const textRef = useRef(null);
  const blueTextRef = useRef(null);
  const [isMounted, setIsMounted] = useState(true);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsMounted(false);
          if (onComplete) onComplete();
        },
      });

      // 1. Loading Phase: Fill text with blue from left to right
      tl.to(blueTextRef.current, {
        clipPath: "inset(-20% -20% -20% -20%)",
        duration: 2,
        ease: "power2.inOut",
      });

      // 2. The Outro & Text Handoff
      // Fade out the background to reveal the page
      tl.to(
        container.current,
        {
          backgroundColor: "rgba(255, 255, 255, 0)",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "+=0.2",
      );

      // The text physically fits itself over the header logo using Flip
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
        // The text remains fully opaque until 3.7s, when the preloader instantly unmounts
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
    },
    { scope: container },
  );

  if (!isMounted) return null;

  return (
    <div
      ref={container}
      className="fixed inset-0 z-100 bg-brand-blue flex justify-center items-center pointer-events-none"
    >
      <div
        ref={textRef}
        className="relative text-[15vw] md:text-[8rem] font-main font-black tracking-tighter lowercase leading-none"
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
    </div>
  );
};

export default Preloader;
