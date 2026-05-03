"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const MaskReveal = () => {
  const container = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const size = 300; // Mask diameter

  useGSAP(
    () => {
      const el = container.current;

      // 1. Setup "quickTo" for high-performance variable updates
      // This replaces the 'animate' prop.
      // duration: 0.5 + ease: "back.out(1.7)" matches your Framer transition
      const xTo = gsap.quickTo(el, "--x", {
        duration: 0.5,
        ease: "back.out(1.7)",
      });
      const yTo = gsap.quickTo(el, "--y", {
        duration: 0.5,
        ease: "back.out(1.7)",
      });
      const sizeTo = gsap.quickTo(el, "--mask-size", {
        duration: 0.3,
        ease: "power3",
      });

      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();

        // Calculate absolute mouse position within the expanded container
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);

        // Check if mouse is hovering the reveal zone to control the scale
        const isRevealZone = e.target.closest(".reveal-zone");
        sizeTo(isRevealZone ? 300 : 0);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container },
  );

  return (
    <div className="relative w-full h-full reveal-zone grid grid-cols-1 grid-rows-1 justify-items-center items-center overflow-visible">
      {/* LAYER 2: The Body (Background) Content (Placed First so it's behind) */}
      <div className="col-start-1 row-start-1 w-full h-full flex justify-center items-center text-[#afa18f] z-0">
        <p className="text-[clamp(3rem,21vw,300px)] text-white m-0 leading-none">
          gorrilla
        </p>
      </div>

      {/* LAYER 1: The Masked (Revealed) Content (Placed Second so it's on top) */}
      <div
        className="absolute inset-[-100vh] z-10  bg-brand-orange mouse-mask flex justify-center items-center pointer-events-none"
        ref={container}
        style={{ "--x": 0, "--y": 0, "--mask-size": 0 }} // Initialize to size 0
      >
        <p
          className="text-[clamp(3rem,21vw,300px)] text-black whitespace-nowrap m-0 leading-none pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          that works!
        </p>
      </div>
    </div>
  );
};
