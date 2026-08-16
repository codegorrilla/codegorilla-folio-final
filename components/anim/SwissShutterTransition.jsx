"use client";
import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Helper to trigger the Swiss Columnar Shutter Reveal Transition
export const navigateWithSwissShutter = (
  router,
  targetUrl,
  event,
  options = {}
) => {
  if (typeof window === "undefined") {
    router.push(targetUrl);
    return;
  }

  window.dispatchEvent(
    new CustomEvent("trigger-swiss-shutter", {
      detail: {
        targetUrl,
        color: options.color || "#141518",
        title: options.title || "PROJECT SPEC",
        category: options.category || "CASE STUDY",
      },
    })
  );
};

export default function SwissShutterTransition() {
  const overlayRef = useRef(null);
  const columnRefs = useRef([]);
  const textRef = useRef(null);
  const pathname = usePathname();

  // Reset / capture 5 column elements
  const setColumnRef = (el, i) => {
    if (el) columnRefs.current[i] = el;
  };

  useEffect(() => {
    const handleShutter = (e) => {
      const { targetUrl, color, title, category } = e.detail;
      const overlay = overlayRef.current;
      const cols = columnRefs.current.filter(Boolean);
      const textEl = textRef.current;
      if (!overlay || cols.length === 0) return;

      gsap.killTweensOf([...cols, overlay, textEl]);

      gsap.set(overlay, {
        opacity: 1,
        pointerEvents: "auto",
      });

      // Prepare columns to sweep down from top
      gsap.set(cols, {
        scaleY: 0,
        transformOrigin: "top center",
        backgroundColor: color || "#141518",
      });

      if (textEl) {
        textEl.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center gap-2 opacity-0 text-white select-none">
            <span class="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">${category}</span>
            <h2 class="font-main font-black text-2xl md:text-4xl uppercase tracking-tight">${title}</h2>
          </div>
        `;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });

      // 1. Stagger columns closing down
      tl.to(cols, {
        scaleY: 1,
        duration: 0.45,
        stagger: {
          each: 0.06,
          from: "start",
        },
        ease: "power3.inOut",
      });

      // 2. Brief typographic watermark flash
      if (textEl && textEl.firstChild) {
        tl.to(
          textEl.firstChild,
          {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.25"
        );
      }
    };

    window.addEventListener("trigger-swiss-shutter", handleShutter);

    return () => {
      window.removeEventListener("trigger-swiss-shutter", handleShutter);
    };
  }, []);

  // On page destination mount: slice columns upward to reveal the content
  useEffect(() => {
    const overlay = overlayRef.current;
    const cols = columnRefs.current.filter(Boolean);
    const textEl = textRef.current;
    if (!overlay || cols.length === 0) return;

    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        gsap.set(overlay, { opacity: 0, pointerEvents: "none" });
      },
    });

    if (textEl && textEl.firstChild) {
      tl.to(textEl.firstChild, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    // Sweep columns up to reveal
    tl.to(cols, {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.55,
      stagger: {
        each: 0.05,
        from: "end",
      },
      ease: "power3.inOut",
    });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden opacity-0"
    >
      {/* 5 Column Swiss Shutter Grid */}
      <div className="w-full h-full flex flex-row">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            ref={(el) => setColumnRef(el, i)}
            className="flex-1 h-full bg-[#141518] border-r border-white/5 last:border-r-0 will-change-transform"
          />
        ))}
      </div>

      {/* Central Typographic Tagline */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      />
    </div>
  );
}
