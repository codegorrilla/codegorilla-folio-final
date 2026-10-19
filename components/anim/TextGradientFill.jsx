"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Toolkit from "@/components/ui/Toolkit";
import SocialLinks from "@/components/ui/SocialLinks";
import { ScrambleHoverEffect } from "./ScrambleHoverEffect";

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_0101";

// High performance deterministic scramble text helper (mutates spans in-place to preserve collision classes)
const scrambleText = (el, targetText, duration = 650) => {
  if (!el || !targetText) return;
  if (el._scrambleTimer) clearInterval(el._scrambleTimer);

  const charSpans = el.querySelectorAll(".caption-char");
  const length = targetText.length;
  const startTime = Date.now();

  el._scrambleTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const revealedCount = Math.floor(progress * length);

    if (charSpans.length === length) {
      for (let i = 0; i < length; i++) {
        const char = targetText[i];
        if (char === " ") {
          charSpans[i].textContent = "\u00A0";
        } else if (char === "." || char === "\n") {
          charSpans[i].textContent = char;
        } else if (i < revealedCount) {
          charSpans[i].textContent = char;
        } else {
          charSpans[i].textContent =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
    } else {
      let output = "";
      for (let i = 0; i < length; i++) {
        const char = targetText[i];
        if (char === " " || char === "." || char === "\n") {
          output += char;
        } else if (i < revealedCount) {
          output += char;
        } else {
          output +=
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = output;
    }

    if (progress >= 1) {
      clearInterval(el._scrambleTimer);
      el._scrambleTimer = null;
      if (charSpans.length === length) {
        for (let i = 0; i < length; i++) {
          charSpans[i].textContent = targetText[i] === " " ? "\u00A0" : targetText[i];
        }
      } else {
        el.textContent = targetText;
      }
    }
  }, 22);
};

// Helper to render caption line split into words and characters with 1:1 character index tracking
const renderCaptionChars = (text) => {
  const words = text.split(" ");
  return words.map((word, wIdx) => (
    <React.Fragment key={wIdx}>
      <span className="caption-word inline-block whitespace-nowrap">
        {Array.from(word).map((char, cIdx) => (
          <span key={cIdx} className="caption-char inline-block">
            {char}
          </span>
        ))}
      </span>
      {wIdx < words.length - 1 && (
        <span className="caption-char caption-space inline-block">
          {"\u00A0"}
        </span>
      )}
    </React.Fragment>
  ));
};

export const TextGradientFill = () => {
  const containerRef = useRef(null);

  // 4 Display caption line refs for scramble effects
  const captionLine1Ref = useRef(null);
  const captionLine2Ref = useRef(null);
  const captionLine3Ref = useRef(null);
  const captionLine4Ref = useRef(null);

  // Profile card, button anchor & button refs
  const profileCardRef = useRef(null);
  const myStoryBtnAnchorRef = useRef(null);
  const myStoryBtnRef = useRef(null);

  // Hidden 500x300 Card & Backdrop refs
  const storyBackdropRef = useRef(null);
  const storyCardRef = useRef(null);

  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Helper: restrict hover scramble exclusively to desktop (>= 992px)
  const handleCaptionHover = (el, targetText) => {
    if (typeof window !== "undefined" && window.innerWidth < 992) return;
    scrambleText(el, targetText, 600);
  };

  // ── Scroll Entrance & Sticky Gradient Fill Timelines (Desktop Only >= 992px) ──
  useGSAP(
    () => {
      const aboutCard = containerRef.current?.closest(".sticky-card");
      if (!aboutCard) return;

      const lines = [
        captionLine1Ref.current,
        captionLine2Ref.current,
        captionLine3Ref.current,
        captionLine4Ref.current,
      ].filter(Boolean);

      const mm = gsap.matchMedia();

      // Desktop / screens >= 992px: card pinning, bottom entrance, and sticky gradient fill
      mm.add("(min-width: 992px)", () => {
        // Initial state for desktop: measure row & char offsets, set #333 text (--sweep: 0)
        lines.forEach((line) => {
          const lineRect = line.getBoundingClientRect();
          line.style.setProperty("--row-w", `${lineRect.width}px`);
          line.style.setProperty("--sweep", "0");
          const charSpans = line.querySelectorAll(".caption-char");
          charSpans.forEach((span) => {
            const sRect = span.getBoundingClientRect();
            const charX = sRect.left - lineRect.left;
            span.style.setProperty("--char-x", `${charX}px`);
          });
        });

        // 1. Entrance: as user scrolls into About section, rows appear from bottom staggered in #333
        gsap.fromTo(
          lines,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutCard,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          }
        );

        // 2. Gradient Fill: while About section remains sticky at top: 0,
        // each row fills with smooth gradient from #333 to yellow as user scrolls past
        const fillTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutCard,
            start: "top top",
            end: "+=2200",
            scrub: 0.8,
          },
        });

        const sweepProgress = { l0: 0, l1: 0, l2: 0, l3: 0 };
        const keys = ["l0", "l1", "l2", "l3"];

        lines.forEach((line, idx) => {
          const key = keys[idx];
          fillTl.fromTo(
            sweepProgress,
            { [key]: 0 },
            {
              [key]: 1,
              ease: "none",
              duration: 1,
              onUpdate: () => {
                line.style.setProperty("--sweep", sweepProgress[key]);
              },
            },
            "+=0.15"
          );
        });
      });

      // Mobile / tablets < 992px: NO text animation! Sits naturally centered in solid yellow
      mm.add("(max-width: 991px)", () => {
        lines.forEach((line) => {
          line.style.removeProperty("--sweep");
          line.style.removeProperty("--row-w");
        });
        gsap.set(lines, { clearProps: "all" });
      });

      // Initial setup for hidden 500x300 detail card & backdrop
      if (storyCardRef.current) {
        gsap.set(storyCardRef.current, {
          y: 150,
          scaleY: 1.5,
          scaleX: 0.8,
          opacity: 0,
          pointerEvents: "none",
        });
      }
      if (storyBackdropRef.current) {
        gsap.set(storyBackdropRef.current, {
          opacity: 0,
          pointerEvents: "none",
        });
      }

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // ── GSAP Magnetic Repel for Profile Card + Character Overlap Collision Engine ──
  useEffect(() => {
    const container = containerRef.current;
    const card = profileCardRef.current;
    const anchor = myStoryBtnAnchorRef.current;
    const btn = myStoryBtnRef.current;
    if (!container || !card || !btn) return;

    // Set initial stylish tilts on profile card and 'My Story' button
    gsap.set(card, { rotation: -2.5 });
    gsap.set(btn, { rotation: 3.5 });

    // quickTo for Card (prominent repelling magnetic motion)
    const cardXTo = gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" });
    const cardYTo = gsap.quickTo(card, "y", { duration: 0.8, ease: "power3.out" });

    // Ensure button anchor stays completely stationary in resting position
    if (anchor) {
      gsap.set(anchor, { clearProps: "all" });
    }

    // quickTo for Button (subtle tactile magnetic micro-pull, not repelled)
    const btnXTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" });
    const btnYTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" });

    // ── Character Overlap Collision Engine ──────────────────────────────────
    let cachedChars = [];
    let lastCardLeft = null;
    let lastCardTop = null;

    const measureChars = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 992) {
        const activeNodes = container.querySelectorAll(".caption-char.is-overlapping");
        activeNodes.forEach((n) => n.classList.remove("is-overlapping"));
        cachedChars = [];
        return;
      }

      const lines = [
        captionLine1Ref.current,
        captionLine2Ref.current,
        captionLine3Ref.current,
        captionLine4Ref.current,
      ].filter(Boolean);

      lines.forEach((line) => {
        const lineRect = line.getBoundingClientRect();
        line.style.setProperty("--row-w", `${lineRect.width}px`);
        const charSpans = line.querySelectorAll(".caption-char");
        charSpans.forEach((span) => {
          const sRect = span.getBoundingClientRect();
          const charX = sRect.left - lineRect.left;
          span.style.setProperty("--char-x", `${charX}px`);
        });
      });

      const nodes = container.querySelectorAll(".caption-char");
      cachedChars = Array.from(nodes).map((node) => {
        const r = node.getBoundingClientRect();
        return {
          node,
          rect: {
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
          },
          isOverlapping: node.classList.contains("is-overlapping"),
        };
      });
      lastCardLeft = null;
      lastCardTop = null;
      checkCollision();
    };

    const checkCollision = () => {
      if (isStoryOpen || window.innerWidth < 992 || cachedChars.length === 0) return;
      const cardRect = card.getBoundingClientRect();

      // Skip tick if card hasn't moved noticeably
      if (
        lastCardLeft !== null &&
        Math.abs(cardRect.left - lastCardLeft) < 0.25 &&
        Math.abs(cardRect.top - lastCardTop) < 0.25
      ) {
        return;
      }
      lastCardLeft = cardRect.left;
      lastCardTop = cardRect.top;

      const margin = 5; // ~5px closing range threshold requested
      const left = cardRect.left - margin;
      const right = cardRect.right + margin;
      const top = cardRect.top - margin;
      const bottom = cardRect.bottom + margin;
      const r = 24 + margin; // card rounded-3xl corner radius (24px) + margin

      for (let i = 0; i < cachedChars.length; i++) {
        const item = cachedChars[i];
        const c = item.rect;

        // AABB intersection check with 5px closing range
        let overlaps =
          c.right >= left &&
          c.left <= right &&
          c.bottom >= top &&
          c.top <= bottom;

        // Rounded corner quadrant exclusion
        if (overlaps) {
          const cx = (c.left + c.right) / 2;
          const cy = (c.top + c.bottom) / 2;
          if (cx < left + r && cy < top + r) {
            overlaps = Math.hypot(cx - (left + r), cy - (top + r)) <= r;
          } else if (cx > right - r && cy < top + r) {
            overlaps = Math.hypot(cx - (right - r), cy - (top + r)) <= r;
          } else if (cx < left + r && cy > bottom - r) {
            overlaps = Math.hypot(cx - (left + r), cy - (bottom - r)) <= r;
          } else if (cx > right - r && cy > bottom - r) {
            overlaps = Math.hypot(cx - (right - r), cy - (bottom - r)) <= r;
          }
        }

        if (overlaps !== item.isOverlapping) {
          item.isOverlapping = overlaps;
          if (overlaps) {
            item.node.classList.add("is-overlapping");
          } else {
            item.node.classList.remove("is-overlapping");
          }
        }
      }
    };

    // Initial measurement after layout and font load
    const rafId = requestAnimationFrame(() => {
      measureChars();
    });
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureChars);
    }

    window.addEventListener("resize", measureChars);
    window.addEventListener("scroll", measureChars, { passive: true });
    gsap.ticker.add(checkCollision);

    const handleMouseMove = (e) => {
      if (isStoryOpen || window.innerWidth < 992) return;
      if (
        e.clientX < -80 ||
        e.clientX > window.innerWidth + 80 ||
        e.clientY < -80 ||
        e.clientY > window.innerHeight + 80
      ) {
        cardXTo(0);
        cardYTo(0);
        btnXTo(0);
        btnYTo(0);
        return;
      }

      // ── 1. Profile Card Repelling Magnetic Effect ──────────────────────────
      // Calculate cursor position relative to the exact resting center of the card
      const cardBaseRect = card.getBoundingClientRect();
      const currentCardX = gsap.getProperty(card, "x") || 0;
      const currentCardY = gsap.getProperty(card, "y") || 0;
      const cardRestingCenterX = cardBaseRect.left + cardBaseRect.width / 2 - currentCardX;
      const cardRestingCenterY = cardBaseRect.top + cardBaseRect.height / 2 - currentCardY;

      const diffX = cardRestingCenterX - e.clientX;
      const diffY = cardRestingCenterY - e.clientY;
      const distToCenter = Math.hypot(diffX, diffY);

      const maxCardDist = 950;
      if (distToCenter < maxCardDist) {
        const proximity = (maxCardDist - distToCenter) / maxCardDist;
        const repelPower = Math.pow(proximity, 0.75);

        // Directional unit vector pointing away from mouse
        const safeDist = Math.max(1, distToCenter);
        const dirX = diffX / safeDist;
        const dirY = diffY / safeDist;

        // Expanded push to completely clear lines 3 & 4 (upward up to -340px, horizontal up to ±320px)
        const basePushX = 330 * repelPower;
        const basePushY = 320 * repelPower;

        const targetCardX = Math.max(-320, Math.min(320, dirX * basePushX * 1.15 + diffX * 0.22));

        let targetCardY;
        if (diffY < 0) {
          // Cursor is below card center (e.g. over 'system across' or 'over the experience')
          // Strong upward propulsion (up to -340px) clears the card completely above lines 3 & 4
          targetCardY = Math.max(-340, Math.min(0, dirY * basePushY * 1.35 + diffY * 0.35 - 40 * repelPower));
        } else {
          // Cursor is above card center -> pushes DOWN (up to +250px) to clear lines 1 & 2
          targetCardY = Math.min(250, Math.max(0, dirY * basePushY * 1.08 + diffY * 0.25));
        }

        cardXTo(targetCardX);
        cardYTo(targetCardY);
      } else {
        cardXTo(0);
        cardYTo(0);
      }

      // ── 2. Tactile Magnetic Attraction for 'My Story' Button (Clickable CTA) ─
      // The button DOES NOT repel with the card. It remains stationary in its resting
      // spot, with a subtle tactile micro-pull (max ±12px) TOWARDS the mouse when close,
      // making it effortless and intuitive for the end-user to click.
      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const btnDiffX = e.clientX - btnCenterX;
      const btnDiffY = e.clientY - btnCenterY;
      const distToBtn = Math.hypot(btnDiffX, btnDiffY);

      const maxBtnDist = 130;
      if (distToBtn < maxBtnDist) {
        const btnPull = Math.pow((maxBtnDist - distToBtn) / maxBtnDist, 1.15);
        // Gentle micro-pull towards cursor (making clicking easy and satisfying)
        const targetBtnX = Math.max(-12, Math.min(12, btnDiffX * 0.22 * btnPull));
        const targetBtnY = Math.max(-10, Math.min(10, btnDiffY * 0.22 * btnPull));
        btnXTo(targetBtnX);
        btnYTo(targetBtnY);
      } else {
        btnXTo(0);
        btnYTo(0);
      }
    };

    const handleMouseLeave = () => {
      cardXTo(0);
      cardYTo(0);
      btnXTo(0);
      btnYTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", measureChars);
      window.removeEventListener("scroll", measureChars);
      gsap.ticker.remove(checkCollision);
    };
  }, [isStoryOpen]);

  // ── Jump Animation on click 'My Story' (matches bottom sticky dock jump) ──────
  const openStory = useCallback(() => {
    setIsStoryOpen(true);
    const card = storyCardRef.current;
    const backdrop = storyBackdropRef.current;
    if (!card) return;

    gsap.killTweensOf([card, backdrop]);

    if (backdrop) {
      gsap.to(backdrop, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    }

    gsap.fromTo(
      card,
      {
        y: 150,
        scaleY: 1.5,
        scaleX: 0.8,
        opacity: 0,
        pointerEvents: "auto",
      },
      {
        y: 0,
        scaleY: 1,
        scaleX: 1,
        opacity: 1,
        pointerEvents: "auto",
        duration: 1.2,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      }
    );
  }, []);

  const closeStory = useCallback(() => {
    const card = storyCardRef.current;
    const backdrop = storyBackdropRef.current;
    if (!card) return;

    gsap.killTweensOf([card, backdrop]);

    if (backdrop) {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }

    gsap.to(card, {
      y: 120,
      scaleY: 1.35,
      scaleX: 0.85,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      pointerEvents: "none",
      onComplete: () => {
        setIsStoryOpen(false);
      },
    });
  }, []);

  // Close story on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isStoryOpen) {
        closeStory();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStoryOpen, closeStory]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[86vh] flex flex-col justify-between select-none"
    >
      {/* ── State 1: Primary About Section Canvas ────────────────────────────── */}
      <div className="relative w-full flex-1 flex flex-col justify-between py-3 sm:py-5 xl:py-6">
        
        {/* ── Layer 1 (Desktop Only, z-0): 600x550 Borderless Profile Card Behind Caption Text ── */}
        <div className="hidden min-[992px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none items-center justify-center">
          <div
            id="my-story-profile-card"
            ref={profileCardRef}
            onClick={openStory}
            className="relative w-[min(600px,92vw)] h-[min(550px,65vh)] rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)] cursor-pointer shrink-0 bg-brand-dark group pointer-events-auto will-change-transform rotate-[-2.5deg]"
            title="Click to view My Story"
          >
            <ScrambleHoverEffect className="w-full h-full" />
          </div>
        </div>

        {/* ── Layer 2 (Middle, z-10): Caption Text in FRONT of Profile Card ── */}
        <div className="relative z-10 w-full text-center min-[992px]:text-left flex flex-col items-center min-[992px]:items-start pointer-events-none">
          <span className="block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-2 min-[992px]:mb-6 pointer-events-auto mx-auto min-[992px]:mx-0">
            About
          </span>

          {/* 4 Caption Text Rows — Compact on mobile (< 992px), Large Full-Stage on desktop (>= 992px) */}
          <h2 className="font-main font-black lowercase text-[clamp(1.1rem,3.4vw,1.65rem)] sm:text-[clamp(1.3rem,3.6vw,1.85rem)] min-[992px]:text-[clamp(2.35rem,5.4vw,6rem)] xl:min-[992px]:text-[clamp(3.1rem,6.2vw,7.4rem)] leading-[1.2] sm:leading-[1.22] min-[992px]:leading-[1.08] sm:min-[992px]:leading-[1.12] tracking-tight select-none max-w-full space-y-1 sm:space-y-1.5 min-[992px]:space-y-3 sm:min-[992px]:space-y-4 xl:min-[992px]:space-y-5 flex flex-col items-center min-[992px]:items-start text-center min-[992px]:text-left">
            <span
              ref={captionLine1Ref}
              onMouseEnter={() =>
                handleCaptionHover(
                  captionLine1Ref.current,
                  "a decade of design instinct."
                )
              }
              className="caption-fill-row block cursor-pointer pointer-events-auto w-fit select-none will-change-[transform,opacity] pb-0.5 min-[992px]:pb-2 text-center min-[992px]:text-left mx-auto min-[992px]:mx-0 whitespace-normal min-[992px]:whitespace-nowrap"
            >
              {renderCaptionChars("a decade of design instinct.")}
            </span>
            <span
              ref={captionLine2Ref}
              onMouseEnter={() =>
                handleCaptionHover(
                  captionLine2Ref.current,
                  "engineered to feel right."
                )
              }
              className="caption-fill-row block cursor-pointer pointer-events-auto w-fit select-none will-change-[transform,opacity] pb-0.5 min-[992px]:pb-2 text-center min-[992px]:text-left mx-auto min-[992px]:mx-0 whitespace-normal min-[992px]:whitespace-nowrap"
            >
              {renderCaptionChars("engineered to feel right.")}
            </span>
            <span
              ref={captionLine3Ref}
              onMouseEnter={() =>
                handleCaptionHover(
                  captionLine3Ref.current,
                  "crafting systems across the stack."
                )
              }
              className="caption-fill-row block cursor-pointer pointer-events-auto w-fit select-none will-change-[transform,opacity] pb-0.5 min-[992px]:pb-2 text-center min-[992px]:text-left mx-auto min-[992px]:mx-0 whitespace-normal min-[992px]:whitespace-nowrap"
            >
              {renderCaptionChars("crafting systems across the stack.")}
            </span>
            <span
              ref={captionLine4Ref}
              onMouseEnter={() =>
                handleCaptionHover(
                  captionLine4Ref.current,
                  "obsessing over the experience in between."
                )
              }
              className="caption-fill-row block cursor-pointer pointer-events-auto w-fit select-none will-change-[transform,opacity] pb-0.5 min-[992px]:pb-2 text-center min-[992px]:text-left mx-auto min-[992px]:mx-0 whitespace-normal min-[992px]:whitespace-nowrap"
            >
              {renderCaptionChars("obsessing over the experience in between.")}
            </span>
          </h2>
        </div>

        {/* ── Mobile-Only Section (< 992px): Profile Card & 'My Story' Button positioned below caption text ── */}
        <div className="block min-[992px]:hidden w-full flex flex-col items-center justify-center my-5 sm:my-6 pointer-events-none">
          <div className="relative w-[min(340px,84vw)] h-[210px] sm:w-[400px] sm:h-[260px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-brand-dark flex items-end justify-center pointer-events-auto rotate-[-2deg]">
            <div onClick={openStory} className="absolute inset-0 cursor-pointer">
              <ScrambleHoverEffect className="w-full h-full" />
            </div>
            <div className="relative z-10 mb-3.5 pointer-events-auto">
              <button
                onClick={openStory}
                className="group rounded-full px-5 py-2.5 bg-brand-orange text-white font-main font-bold text-xs tracking-wider uppercase cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center gap-2 select-none rotate-[2.5deg]"
              >
                <span>My story</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Layer 3 (Desktop Only, z-20): 'My Story' Button at Bottom Center-Right with Parallax ── */}
        <div className="hidden min-[992px]:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[min(600px,92vw)] h-[min(550px,65vh)] items-end justify-center">
          <div
            ref={myStoryBtnAnchorRef}
            className="w-full h-full relative flex items-end justify-center pointer-events-none will-change-transform"
          >
            <div className="mb-7 ml-12 sm:ml-16 pointer-events-auto">
              <button
                id="my-story-btn"
                ref={myStoryBtnRef}
                onClick={openStory}
                className="group rounded-full px-7 py-3.5 bg-brand-orange text-white font-main font-bold text-xs sm:text-sm tracking-widest uppercase cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center gap-2.5 shrink-0 select-none pointer-events-auto whitespace-nowrap will-change-transform rotate-[3.5deg]"
              >
                <span>My story</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Social Icons (Left) & Toolkit Trigger (Right) ── */}
        <div className="w-full flex items-end justify-between mt-auto pt-4 sm:pt-6 relative z-10 pointer-events-none shrink-0">
          {/* Bottom Left: Social Icons replacing 'Curated dossier' */}
          <div className="pointer-events-auto flex items-center">
            <SocialLinks />
          </div>

          {/* Bottom Right: My Toolkit Link & Staggered Stacked Items */}
          <div className="pointer-events-auto relative">
            <Toolkit />
          </div>
        </div>
      </div>

      {/* ── State 2: Spacious Detail Card with Elastic Jump Entrance ──── */}
      {/* Subtle Backdrop overlay for click-dismiss outside */}
      <div
        ref={storyBackdropRef}
        onClick={closeStory}
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* The Enlarged Detail Card Centered with Zero Sticky Scroll */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div
          ref={storyCardRef}
          style={{
            boxShadow:
              "0 30px 80px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
          }}
          className="w-[min(880px,94vw)] min-h-[380px] sm:min-h-[440px] bg-brand-orange rounded-3xl border border-white/25 flex flex-col p-6 sm:p-9 text-white pointer-events-auto select-text will-change-transform shadow-2xl justify-between"
        >
          {/* Non-sticky Card Header */}
          <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/25 shrink-0">
            <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-white">
              About // My Story
            </span>
            <button
              id="my-story-close-btn"
              onClick={closeStory}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer text-sm font-bold"
              aria-label="Close story"
            >
              ✕
            </button>
          </div>

          {/* Technical Bio Story */}
          <div className="pt-5 sm:pt-6 font-main font-medium text-[15px] sm:text-[16px] xl:text-[17px] leading-relaxed text-white space-y-3.5 sm:space-y-4">
            <p>
              I began my career in digital product and web design, spending over a decade crafting interfaces, design systems, and responsive layouts across diverse web ecosystems.
            </p>
            <p>
              Driven to engineer the full lifecycle of modern applications, I evolved into a React full-stack developer. My core workflow centers on architecting scalable frontends using React and Next.js, backed by modular Node.js/Express server services and RESTful APIs.
            </p>
            <p>
              On the data layer, I work proficiently across both document and relational paradigms—designing scalable schemas and aggregation pipelines in MongoDB, as well as structured relational models, indexes, and optimized queries in PostgreSQL.
            </p>
            <p>
              Bridging a decade of UI/UX discipline with full-stack engineering, I build production-grade software that unites clean, maintainable backend code with performant, pixel-accurate user experiences.
            </p>

            {/* Technical Stack Tags */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                React / Next.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                Node.js / Express
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                MongoDB
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                PostgreSQL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase border border-white/20">
                TypeScript / Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
