// components/CustomCursor.jsx

"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useGSAP(() => {
    const cursor = cursorRef.current;

    // 1. Setup fast setters for position (Crucial for performance)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

    // 2. Global Mouse Move Listener
    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // 3. Hover Detection Logic
    const handleMouseOver = (e) => {
      // Check if the target is a link, button, or has class 'hover-trigger'
      const target = e.target.closest("a, button, .hover-trigger");
      const lgTarget = e.target.closest(".lg-text-trigger");
      const isRevealZone = e.target.closest(".reveal-zone");

      if (isRevealZone) {
        setIsHovering(true);
        gsap.to(cursor, { scale: 0, duration: 0.3 });
      } else if (target) {
        setIsHovering(true);
        // Animate Cursor State: Grow & Change Color
        gsap.to(cursor, {
          scale: 3.5,
          backgroundColor: "white",
          mixBlendMode: "difference", // Cool negative effect
          duration: 0.3,
        });
      } else if (lgTarget) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 8,
          backgroundColor: "white",
          mixBlendMode: "difference", // Cool negative effect
          duration: 0.3,
        });
      } else {
        setIsHovering(false);
        // Reset Cursor State
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "#f0493a", // Your brand color
          mixBlendMode: "normal",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  });

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-10 h-10 bg-brand-orange rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
    />
  );
}
