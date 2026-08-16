// components/ui/CustomCursor.jsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useGSAP(
    () => {
      // Custom cursor + icon tooltip only make sense on devices with a fine
      // pointer (mouse). Skip everything on touch/mobile.
      const isDesktop = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;

      if (!isDesktop) return;

      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dot || !label) return;

      // Fast position setters — cursor dot
      const xTo = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3" });
      const yTo = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3" });

      // Fast position setters — label (offset 20px to the right)
      const lxTo = gsap.quickTo(label, "x", { duration: 0.3, ease: "power3" });
      const lyTo = gsap.quickTo(label, "y", { duration: 0.3, ease: "power3" });

      // Show cursor dot on desktop; center label pill horizontally on its anchor point
      gsap.set(dot, { opacity: 1 });
      gsap.set(label, { xPercent: -50 }); // center pill over its x position

      const handleMouseMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        lxTo(e.clientX); // horizontally centered above icon
        lyTo(e.clientY - 52); // 52px above cursor (sits above icon)
      };

      const handleMouseOver = (e) => {
        const iconTarget = e.target.closest("[data-label]");
        const hoverTarget = e.target.closest("a, button, .hover-trigger");
        const lgTarget = e.target.closest(".lg-text-trigger");
        const revealTarget = e.target.closest(".reveal-zone");

        if (iconTarget) {
          // ── Toolkit icon: shrink dot + recolor + show label ──────────────
          const techName = iconTarget.dataset.label || "";
          const techColor = iconTarget.dataset.cursorColor || "#f0493a";

          label.textContent = techName;

          gsap.to(dot, {
            scale: 0.35,
            backgroundColor: techColor,
            mixBlendMode: "normal",
            duration: 0.25,
          });
          gsap.to(label, {
            opacity: 1,
            x: "+=0",
            duration: 0.25,
            color: techColor,
          });
        } else if (revealTarget) {
          gsap.to(dot, { scale: 0, duration: 0.3 });
          gsap.to(label, { opacity: 0, duration: 0.2 });
        } else if (lgTarget) {
          gsap.to(dot, {
            scale: 8,
            backgroundColor: "white",
            mixBlendMode: "difference",
            duration: 0.3,
          });
          gsap.to(label, { opacity: 0, duration: 0.2 });
        } else if (hoverTarget) {
          gsap.to(dot, {
            scale: 2,
            backgroundColor: "white",
            mixBlendMode: "difference",
            duration: 0.3,
          });
          gsap.to(label, { opacity: 0, duration: 0.2 });
        } else {
          // ── Default: reset everything ─────────────────────────────────────
          gsap.to(dot, {
            scale: 1,
            backgroundColor: "#f0493a",
            mixBlendMode: "normal",
            duration: 0.3,
          });
          gsap.to(label, { opacity: 0, duration: 0.15 });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseover", handleMouseOver);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseover", handleMouseOver);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      {/* Cursor dot — hidden by default, shown only on desktop via GSAP */}
      <div
        ref={dotRef}
        className="hidden lg:block fixed top-0 left-0 w-8 h-8 bg-brand-orange rounded-full pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 opacity-0"
      />

      {/*
        Label pill — appears ABOVE the hovered icon.
        GSAP sets x = clientX (centered via xPercent:-50) and y = clientY - 52.
        The div IS the pill — label.textContent set directly via JS.
      */}
      <div
        ref={labelRef}
        className="
          hidden lg:block
          fixed top-0 left-0 pointer-events-none z-9999 opacity-0
          px-4 py-1.5
          rounded-full
          bg-black/85 backdrop-blur-md
          border-2 border-current
          text-sm font-main font-semibold
          whitespace-nowrap tracking-wider
        "
      />
    </div>
  );
}
