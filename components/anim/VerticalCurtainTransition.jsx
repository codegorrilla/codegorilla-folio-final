"use client";
import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const CURTAIN_FLAG = "curtain-transition";

// Navigation helper — call this to trigger the curtain
export const navigateWithVerticalCurtain = (
  router,
  targetUrl,
  event,
  options = {}
) => {
  if (typeof window === "undefined") {
    router.push(targetUrl);
    return;
  }

  // Mark that a curtain transition is pending so destination page knows to cover
  sessionStorage.setItem(CURTAIN_FLAG, "1");

  window.dispatchEvent(
    new CustomEvent("trigger-vertical-curtain", {
      detail: {
        targetUrl,
        title: options.title || "PROJECT",
        category: options.category || "CASE STUDY",
      },
    })
  );
};

export default function VerticalCurtainTransition() {
  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const pathname = usePathname();

  // ── OUTGOING transition ─────────────────────────────────────────────────────
  // Curtain rises from below, covers the screen, then navigates
  useEffect(() => {
    const handleCurtain = (e) => {
      const { targetUrl, title, category } = e.detail;
      const curtain = curtainRef.current;
      const label = labelRef.current;
      if (!curtain) return;

      gsap.killTweensOf(curtain);

      // Position curtain below the viewport, ready to rise
      gsap.set(curtain, { y: "100%", opacity: 1, pointerEvents: "auto" });

      if (label) {
        label.innerHTML = `
          <div class="opacity-0 flex flex-col items-center justify-center text-center gap-2 text-white select-none">
            <span class="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">${category}</span>
            <h2 class="font-main font-black text-3xl md:text-5xl lowercase tracking-tight leading-[1.1]">${title}</h2>
          </div>
        `;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });

      // Rise up from bottom
      tl.to(curtain, {
        y: "0%",
        duration: 0.6,
        ease: "power4.inOut",
      });

      // Flash label as curtain settles
      if (label && label.firstChild) {
        tl.to(
          label.firstChild,
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.18"
        );
      }
    };

    window.addEventListener("trigger-vertical-curtain", handleCurtain);
    return () =>
      window.removeEventListener("trigger-vertical-curtain", handleCurtain);
  }, []);

  // ── INCOMING transition ─────────────────────────────────────────────────────
  // The anti-FOUC <script> in <head> already set --curtain-y before first paint.
  // Here we just animate the retract if a curtain transition was pending.
  useEffect(() => {
    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!curtain) return;

    const hasCurtain = sessionStorage.getItem(CURTAIN_FLAG);
    if (!hasCurtain) return; // Normal page load — nothing to retract

    sessionStorage.removeItem(CURTAIN_FLAG);

    // Ensure GSAP agrees with the CSS var (0% = covering)
    gsap.set(curtain, { y: "0%", pointerEvents: "none" });

    const tl = gsap.timeline({
      delay: 0.05,
      onComplete: () => {
        gsap.set(curtain, { y: "100%", pointerEvents: "none" });
        window.dispatchEvent(new CustomEvent("curtain-page-revealed"));
      },
    });

    if (label && label.firstChild) {
      tl.to(label.firstChild, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      });
    }

    tl.to(curtain, {
      y: "-100%",
      duration: 0.65,
      ease: "expo.inOut",
    });
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      style={{ transform: "translateY(var(--curtain-y, 100%))" }}
      className="fixed inset-0 z-[99999] bg-[#141518] pointer-events-none overflow-hidden flex items-center justify-center"
    >
      {/* Top accent line — rides the curtain edge as it rises */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-yellow" />

      {/* Typographic label */}
      <div ref={labelRef} className="pointer-events-none" />
    </div>
  );
}
