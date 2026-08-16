"use client";
import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Helper to trigger the Shared Element Card Expansion Morph Transition
export const navigateWithCardMorph = (
  router,
  targetUrl,
  event,
  options = {}
) => {
  if (typeof window === "undefined") {
    router.push(targetUrl);
    return;
  }

  // Find the closest card container or calculate center
  const cardElement = event?.currentTarget?.closest(".card-item");
  let rect = null;

  if (cardElement) {
    rect = cardElement.getBoundingClientRect();
  } else {
    // Fallback: center rectangle
    const w = Math.min(320, window.innerWidth * 0.8);
    const h = w * 1.33;
    rect = {
      top: window.innerHeight / 2 - h / 2,
      left: window.innerWidth / 2 - w / 2,
      width: w,
      height: h,
    };
  }

  window.dispatchEvent(
    new CustomEvent("trigger-card-morph", {
      detail: {
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        targetUrl,
        color: options.color || "#1c1d22",
        title: options.title || "Project",
        category: options.category || "Case Study",
      },
    })
  );
};

export default function CardMorphTransition() {
  const overlayRef = useRef(null);
  const morphBoxRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleMorph = (e) => {
      const { rect, targetUrl, color, title, category } = e.detail;
      const overlay = overlayRef.current;
      const box = morphBoxRef.current;
      const content = contentRef.current;
      if (!overlay || !box) return;

      gsap.killTweensOf([box, overlay, content]);

      // Set initial geometry matching the clicked 3D card
      gsap.set(overlay, {
        opacity: 1,
        pointerEvents: "auto",
      });

      gsap.set(box, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: "1.5rem",
        backgroundColor: color || "#1c1d22",
        scale: 1,
        transformOrigin: "center center",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      });

      if (content) {
        content.innerHTML = `
          <div class="p-8 md:p-14 flex flex-col justify-between h-full w-full opacity-0 text-white transition-opacity">
            <span class="font-mono text-xs uppercase tracking-[0.25em] text-brand-orange">${category}</span>
            <h2 class="font-main font-black text-3xl md:text-5xl">${title}</h2>
          </div>
        `;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });

      // 1. Morph & scale from card rectangle to full viewport canvas
      tl.to(box, {
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        duration: 0.68,
        ease: "power4.inOut",
      });

      if (content) {
        tl.to(
          content.firstChild,
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    };

    window.addEventListener("trigger-card-morph", handleMorph);

    return () => {
      window.removeEventListener("trigger-card-morph", handleMorph);
    };
  }, []);

  // On page navigation change / mount: fade out the morph overlay smoothly
  useEffect(() => {
    const overlay = overlayRef.current;
    const box = morphBoxRef.current;
    if (!overlay || !box) return;

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.55,
      delay: 0.15,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: "none" });
      },
    });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden opacity-0"
    >
      <div
        ref={morphBoxRef}
        className="absolute overflow-hidden will-change-transform"
      >
        <div ref={contentRef} className="w-full h-full" />
      </div>
    </div>
  );
}
