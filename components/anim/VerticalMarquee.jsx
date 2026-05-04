"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const VerticalMarquee = ({ text = "code.gorrilla", speed = 10 }) => {
  const container = useRef(null);
  const innerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");

    // Set initial value
    setIsVisible(mediaQuery.matches);

    // Handle window resize
    const handler = (e) => setIsVisible(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (!isVisible) return; // Don't animate if not visible

      // Animate the inner container moving horizontally by 50%
      // Since it contains two identical sets of items, moving -50% perfectly loops it.
      const tween = gsap.to(innerRef.current, {
        xPercent: -50,
        ease: "none",
        duration: speed,
        repeat: -1,
      });

      // Scroll direction and velocity tracking
      ScrollTrigger.create({
        trigger: document.body, // Track scroll across the whole page
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // self.direction is 1 (down) or -1 (up)
          // Add velocity to speed it up. Divide by a constant to scale velocity effect.
          const targetTimeScale = self.direction + velocity / 300;

          gsap.to(tween, {
            timeScale: targetTimeScale,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              // Gracefully return to a normal timeScale (1 or -1) when scrolling stops
              gsap.to(tween, {
                timeScale: self.direction,
                duration: 0.5,
              });
            },
          });
        },
      });
    },
    { scope: container, dependencies: [isVisible] },
  );

  if (!isVisible) return null;

  // Array of text to fill the screen
  const items = new Array(8).fill(text);

  return (
    <div
      ref={container}
      className="w-100 h-full overflow-hidden flex justify-center items-center absolute left-[-5vw] inset-0 pointer-events-none"
    >
      <div className="-rotate-90 flex justify-center items-center">
        <div ref={innerRef} className="flex flex-row items-center">
          {/* Set 1 */}
          <div className="flex flex-row items-center">
            {items.map((item, i) => (
              <h1
                key={`set1-${i}`}
                className="text-[clamp(1rem,10vw,3rem)] font-main font-black odd:text-blue-700 even:text-blue-600 lowercase whitespace-nowrap leading-none opacity-100 m-0 px-4"
              >
                {item}
              </h1>
            ))}
          </div>
          {/* Set 2 (Exact Clone for infinite loop) */}
          <div className="flex flex-row items-center">
            {items.map((item, i) => (
              <h1
                key={`set2-${i}`}
                className="text-[clamp(1rem,10vw,3rem)] font-main font-black odd:text-blue-700 even:text-blue-600 lowercase whitespace-nowrap leading-none opacity-100 m-0 px-4"
              >
                {item}
              </h1>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
