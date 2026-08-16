"use client";
import React, { useRef, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Helper to calculate maximum screen radius from click point
const calculateMaxRadius = (x, y) => {
  if (typeof window === "undefined") return 1600;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dx = Math.max(x, w - x);
  const dy = Math.max(y, h - y);
  return Math.sqrt(dx * dx + dy * dy) * 1.25 + 100;
};

// Generates an organic, slightly wobbly blob path around (cx, cy) with radius r and wobble phase
const generateOrganicBlobPath = (cx, cy, r, wobble = 0) => {
  if (r <= 0) return `M ${cx} ${cx} Z`;

  // 8 control points for an organic fluid squircle/blob
  const p1 = r * (1 + 0.12 * Math.sin(wobble));
  const p2 = r * (1 - 0.15 * Math.cos(wobble + 1));
  const p3 = r * (1 + 0.18 * Math.sin(wobble + 2));
  const p4 = r * (1 - 0.10 * Math.cos(wobble + 3));

  const k = 0.5522847498; // cubic bezier circle constant

  const top = cy - p1;
  const bottom = cy + p3;
  const left = cx - p4;
  const right = cx + p2;

  const topControl = p1 * k;
  const bottomControl = p3 * k;
  const leftControl = p4 * k;
  const rightControl = p2 * k;

  return `
    M ${cx} ${top}
    C ${cx + rightControl} ${top}, ${right} ${cy - topControl}, ${right} ${cy}
    C ${right} ${cy + bottomControl}, ${cx + rightControl} ${bottom}, ${cx} ${bottom}
    C ${cx - leftControl} ${bottom}, ${left} ${cy + bottomControl}, ${left} ${cy}
    C ${left} ${cy - topControl}, ${cx - leftControl} ${top}, ${cx} ${top}
    Z
  `;
};

// Navigation trigger for the Organic Gorilla Blob transition
export const navigateWithOrganicBlob = (
  router,
  targetUrl,
  event,
  options = {}
) => {
  if (typeof window === "undefined") {
    router.push(targetUrl);
    return;
  }

  const clientX = event?.clientX ?? window.innerWidth / 2;
  const clientY = event?.clientY ?? window.innerHeight / 2;

  window.dispatchEvent(
    new CustomEvent("trigger-organic-blob", {
      detail: {
        x: clientX,
        y: clientY,
        targetUrl,
        color: options.color || "#141518",
        title: options.title || "PROJECT",
        category: options.category || "CASE STUDY",
      },
    })
  );
};

export default function OrganicBlobTransition() {
  const overlayRef = useRef(null);
  const pathRef = useRef(null);
  const labelRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleBlobTransition = (e) => {
      const { x, y, targetUrl, color, title, category } = e.detail;
      const overlay = overlayRef.current;
      const path = pathRef.current;
      const label = labelRef.current;
      if (!overlay || !path) return;

      const maxR = calculateMaxRadius(x, y);

      gsap.killTweensOf(overlay);

      gsap.set(overlay, {
        opacity: 1,
        pointerEvents: "auto",
      });

      path.setAttribute("fill", color || "#141518");

      if (label) {
        label.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center gap-1.5 opacity-0 text-white select-none">
            <span class="font-mono text-xs uppercase tracking-[0.3em] text-brand-orange">${category}</span>
            <h3 class="font-main font-black text-2xl md:text-4xl lowercase tracking-tight">${title}</h3>
          </div>
        `;
      }

      const animState = { progress: 0, wobble: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        },
      });

      // 1. Expand organic fluid blob outward
      tl.to(animState, {
        progress: 1,
        wobble: Math.PI * 2,
        duration: 0.65,
        ease: "power3.inOut",
        onUpdate: () => {
          const currentR = animState.progress * maxR;
          const d = generateOrganicBlobPath(x, y, currentR, animState.wobble);
          path.setAttribute("d", d);
        },
      });

      if (label && label.firstChild) {
        tl.to(
          label.firstChild,
          {
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.28"
        );
      }
    };

    window.addEventListener("trigger-organic-blob", handleBlobTransition);

    return () => {
      window.removeEventListener("trigger-organic-blob", handleBlobTransition);
    };
  }, []);

  // On destination page mount: immediately cover with full-radius blob to
  // prevent FOUC, then retract smoothly and signal page to reveal itself.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxR = calculateMaxRadius(cx, cy);

    // Instantly paint the blob at full coverage — no gap, no flash
    const fullPath = generateOrganicBlobPath(cx, cy, maxR, Math.PI);
    path.setAttribute("d", fullPath);
    gsap.set(overlay, { opacity: 1, pointerEvents: "none" });
  }, [pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    const label = labelRef.current;
    if (!overlay || !path) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxR = calculateMaxRadius(cx, cy);

    const animState = { progress: 1, wobble: Math.PI };

    const tl = gsap.timeline({
      delay: 0.05,
      onComplete: () => {
        gsap.set(overlay, { opacity: 0, pointerEvents: "none" });
        // Signal destination page it can now reveal itself
        window.dispatchEvent(new CustomEvent("blob-page-revealed"));
      },
    });

    if (label && label.firstChild) {
      tl.to(label.firstChild, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      });
    }

    tl.to(animState, {
      progress: 0,
      wobble: 0,
      duration: 0.6,
      ease: "power4.out",
      onUpdate: () => {
        const currentR = animState.progress * maxR;
        const d = generateOrganicBlobPath(cx, cy, currentR, animState.wobble);
        path.setAttribute("d", d);
      },
    });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden opacity-0"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="M 0 0 Z"
          fill="#141518"
        />
      </svg>

      <div
        ref={labelRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      />
    </div>
  );
}
