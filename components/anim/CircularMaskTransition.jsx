"use client";
import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Helper function to calculate the radius needed to cover the entire screen from any point (x, y)
export const calculateMaxRadius = (x, y) => {
  if (typeof window === "undefined") return 1500;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dx = Math.max(x, w - x);
  const dy = Math.max(y, h - y);
  return Math.sqrt(dx * dx + dy * dy) + 60;
};

// Global navigation trigger that triggers the expanding circular mask transition
export const navigateWithCircularMask = (router, targetUrl, event, maskColor = "#1a1b1e") => {
  if (typeof window === "undefined") {
    router.push(targetUrl);
    return;
  }

  const clientX = event?.clientX ?? window.innerWidth / 2;
  const clientY = event?.clientY ?? window.innerHeight / 2;

  window.dispatchEvent(
    new CustomEvent("trigger-circular-transition", {
      detail: {
        x: clientX,
        y: clientY,
        targetUrl,
        maskColor,
      },
    })
  );
};

export default function CircularMaskTransition() {
  const overlayRef = useRef(null);
  const circleRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleTransition = (e) => {
      const { x, y, targetUrl, maskColor } = e.detail;
      const circle = circleRef.current;
      const overlay = overlayRef.current;
      if (!circle || !overlay) return;

      const maxR = calculateMaxRadius(x, y);

      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("fill", maskColor || "#1a1b1e");

      gsap.killTweensOf(circle);

      // 1. Expand circle to fill entire screen
      gsap.fromTo(
        circle,
        { attr: { r: 0 } },
        {
          attr: { r: maxR },
          duration: 0.65,
          ease: "power4.inOut",
          onComplete: () => {
            // Navigate to new URL
            window.location.href = targetUrl;
          },
        }
      );
    };

    window.addEventListener("trigger-circular-transition", handleTransition);

    return () => {
      window.removeEventListener("trigger-circular-transition", handleTransition);
    };
  }, []);

  // On page load/mount, animate out (shrink circle) to reveal the new page
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxR = calculateMaxRadius(cx, cy);

    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);

    gsap.fromTo(
      circle,
      { attr: { r: maxR } },
      {
        attr: { r: 0 },
        duration: 0.7,
        delay: 0.1,
        ease: "power4.out",
      }
    );
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          ref={circleRef}
          cx="50%"
          cy="50%"
          r="0"
          fill="#1a1b1e"
        />
      </svg>
    </div>
  );
}
