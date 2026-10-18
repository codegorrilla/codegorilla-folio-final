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

// High performance deterministic scramble text helper
const scrambleText = (el, targetText, duration = 650) => {
  if (!el || !targetText) return;
  if (el._scrambleTimer) clearInterval(el._scrambleTimer);

  const length = targetText.length;
  const startTime = Date.now();

  el._scrambleTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const revealedCount = Math.floor(progress * length);

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

    if (progress >= 1) {
      clearInterval(el._scrambleTimer);
      el._scrambleTimer = null;
      el.textContent = targetText;
    }
  }, 22);
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
        // Initial state for desktop: #333 text (backgroundPosition at 100% 0%)
        lines.forEach((line) => {
          line.style.backgroundPosition = "100% 0%";
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

        lines.forEach((line) => {
          fillTl.fromTo(
            line,
            { backgroundPosition: "100% 0%" },
            {
              backgroundPosition: "0% 0%",
              ease: "none",
              duration: 1,
            },
            "+=0.15"
          );
        });
      });

      // Mobile / tablets < 992px: NO text animation! Sits naturally centered in solid yellow
      mm.add("(max-width: 991px)", () => {
        lines.forEach((line) => {
          line.style.backgroundPosition = "";
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

  // ── GSAP Magnetic Repel for Profile Card + Parallax for 'My Story' Button ──────
  useEffect(() => {
    const container = containerRef.current;
    const card = profileCardRef.current;
    const anchor = myStoryBtnAnchorRef.current;
    const btn = myStoryBtnRef.current;
    if (!container || !card || !btn) return;

    // quickTo for Card (prominent repelling magnetic motion)
    const cardXTo = gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" });
    const cardYTo = gsap.quickTo(card, "y", { duration: 0.8, ease: "power3.out" });

    // quickTo for Button Anchor (moves with card to stay anchored at bottom-center-right)
    const anchorXTo = anchor
      ? gsap.quickTo(anchor, "x", { duration: 0.8, ease: "power3.out" })
      : null;
    const anchorYTo = anchor
      ? gsap.quickTo(anchor, "y", { duration: 0.8, ease: "power3.out" })
      : null;

    // quickTo for Button (independent parallax foreground layer)
    const btnXTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const btnYTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

    const handleMouseMove = (e) => {
      if (isStoryOpen || window.innerWidth < 992) return;
      const rect = container.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        cardXTo(0);
        cardYTo(0);
        if (anchorXTo) anchorXTo(0);
        if (anchorYTo) anchorYTo(0);
        btnXTo(0);
        btnYTo(0);
        return;
      }

      // ── 1. Profile Card Repelling Magnetic Effect ──────────────────────────
      // On moving mouse closer to profile card, it moves AWAY from the mouse
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const diffX = cardCenterX - e.clientX;
      const diffY = cardCenterY - e.clientY;
      const distToCard = Math.hypot(diffX, diffY);

      const maxCardDist = 900;
      if (distToCard < maxCardDist) {
        const pull = Math.pow((maxCardDist - distToCard) / maxCardDist, 1.1);
        // Prominent displacement away from mouse: diffX > 0 pushes right (+x)
        const targetCardX = Math.max(-105, Math.min(105, diffX * 0.25 * pull));

        // When cursor is below the card center (e.g. over last two caption lines),
        // give the card a larger upward repulsion perimeter so it moves up further
        let targetCardY;
        if (diffY < 0) {
          // Cursor is below the card center -> card moves UP further
          targetCardY = Math.max(-145, diffY * 0.38 * pull);
        } else {
          // Cursor is above the card center -> card moves DOWN
          targetCardY = Math.min(85, diffY * 0.24 * pull);
        }

        cardXTo(targetCardX);
        cardYTo(targetCardY);
        if (anchorXTo) anchorXTo(targetCardX);
        if (anchorYTo) anchorYTo(targetCardY);
      } else {
        cardXTo(0);
        cardYTo(0);
        if (anchorXTo) anchorXTo(0);
        if (anchorYTo) anchorYTo(0);
      }

      // ── 2. Parallax Layer Shift for 'My Story' Button ───────────────────────
      // Button moves with its own foreground layer dynamic relative to the card
      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const btnDiffX = e.clientX - btnCenterX;
      const btnDiffY = e.clientY - btnCenterY;
      const distToBtn = Math.hypot(btnDiffX, btnDiffY);

      const maxBtnDist = 420;
      if (distToBtn < maxBtnDist) {
        const btnPull = Math.pow((maxBtnDist - distToBtn) / maxBtnDist, 1.25);
        // Magnetic pull creates distinct opposite parallax motion across the card
        const targetBtnX = Math.max(-50, Math.min(50, btnDiffX * 0.45 * btnPull));
        const targetBtnY = Math.max(-35, Math.min(35, btnDiffY * 0.45 * btnPull));
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
      if (anchorXTo) anchorXTo(0);
      if (anchorYTo) anchorYTo(0);
      btnXTo(0);
      btnYTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
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
            className="relative w-[min(600px,92vw)] h-[min(550px,65vh)] rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)] cursor-pointer shrink-0 bg-brand-dark group pointer-events-auto will-change-transform"
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
              a decade of design instinct.
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
              engineered to feel right.
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
              crafting systems across the stack.
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
              obsessing over the experience in between.
            </span>
          </h2>
        </div>

        {/* ── Mobile-Only Section (< 992px): Profile Card & 'My Story' Button positioned below caption text ── */}
        <div className="block min-[992px]:hidden w-full flex flex-col items-center justify-center my-5 sm:my-6 pointer-events-none">
          <div className="relative w-[min(340px,84vw)] h-[210px] sm:w-[400px] sm:h-[260px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-brand-dark flex items-end justify-center pointer-events-auto">
            <div onClick={openStory} className="absolute inset-0 cursor-pointer">
              <ScrambleHoverEffect className="w-full h-full" />
            </div>
            <div className="relative z-10 mb-3.5 pointer-events-auto">
              <button
                onClick={openStory}
                className="group rounded-full px-5 py-2.5 bg-brand-orange text-white font-main font-bold text-xs tracking-wider uppercase cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center gap-2 select-none"
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
                className="group rounded-full px-7 py-3.5 bg-brand-orange text-white font-main font-bold text-xs sm:text-sm tracking-widest uppercase cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center gap-2.5 shrink-0 select-none pointer-events-auto whitespace-nowrap will-change-transform"
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
