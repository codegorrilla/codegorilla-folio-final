"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SvgIcon from "../ui/SvgIcon";

import Toolkit from "@/components/ui/Toolkit";
import SocialLinks from "@/components/ui/SocialLinks";
import { ScrambleHoverEffect } from "./ScrambleHoverEffect";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(SplitText, ScrollTrigger);

const ICONS = {
  rocket: "/icons/rocket_icon.svg",
  robot: "/icons/robot_confused_icon.svg",
  react: "/icons/react_icon.svg",
  muscle: "/icons/muscle_icon.svg",
};

export const TextGradientFill = () => {
  const containerRef = useRef(null);
  // Above-word icons (Y-axis animation)
  const rocketIconRef = useRef(null);
  const robotIconRef = useRef(null);
  // Left-of-word icons (X-axis animation)
  const reactIconRef = useRef(null);
  const muscleIconRef = useRef(null);
  const { theme } = useTheme();

  useGSAP(
    () => {
      const aboutCard = containerRef.current?.closest(".sticky-card");
      const allCards = document.querySelectorAll(".sticky-card");
      const lastCard = allCards[allCards.length - 1] || aboutCard;

      // ── SplitText ────────────────────────────────────────────────────────
      const blocks = containerRef.current.querySelectorAll("[data-split]");
      const splits = [];
      const allWords = [];

      blocks.forEach((block) => {
        const split = new SplitText(block, {
          type: "words",
          wordsClass: "tgf-word",
        });
        splits.push(split);
        allWords.push(...split.words);
      });

      gsap.set(allWords, { color: theme === "light" ? "#e3dfdf" : "#313237" });

      // ── Positioning helpers ───────────────────────────────────────────────
      const ICON_SIZE = 32;

      /**
       * Above-word: icon sits 10px above the word's top edge.
       * Starts at word level (y = ICON_SIZE + gap), jumps up to y = 0.
       */
      // ── Main fill scrub timeline ─────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutCard || containerRef.current,
          start: "top top",
          endTrigger: lastCard || aboutCard,
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(allWords, {
        color: theme === "light" ? "#242529" : "#ffffff",
        stagger: { each: 0.15, ease: "none" },
        ease: "none",
        duration: allWords.length * 0.15,
      });

      // ── Scroll range ─────────────────────────────────────────────────────
      // Force ScrollTrigger to compute its start/end synchronously before reading them
      ScrollTrigger.refresh();
      
      const scrollStart = tl.scrollTrigger.start;
      const scrollEnd = tl.scrollTrigger.end;
      const totalScrollRange = scrollEnd - scrollStart;
      const n = allWords.length;
      const currentScroll = window.scrollY;

      function wordTriggerScroll(wordIndex) {
        const progress = wordIndex / (2 * n - 1);
        return scrollStart + progress * totalScrollRange;
      }

      // ── Animation States ────────────────────────────────────────────────
      const showAbove = { opacity: 1, y: 0, x: ICON_SIZE + 10 };
      const hideAbove = { opacity: 0, y: ICON_SIZE + 10, x: ICON_SIZE + 10 };

      const showLeft = { opacity: 1, x: 0 };
      const hideLeft = { opacity: 0, x: -(ICON_SIZE + 20) };

      function positionAboveWord(iconEl, wordEl) {
        if (!iconEl || !wordEl) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const wRect = wordEl.getBoundingClientRect();
        const gap = 10;

        // Use currentScroll to determine initial state so it doesn't blink out when toggling theme mid-scroll
        const startPos = wordTriggerScroll(allWords.indexOf(wordEl));
        const isActive = currentScroll >= startPos && currentScroll < scrollEnd;

        gsap.set(iconEl, {
          left: wRect.left - cRect.left,
          top: wRect.top - cRect.top - ICON_SIZE - gap,
          ...(isActive ? showAbove : hideAbove),
        });
      }

      /**
       * Right-of-word: icon sits 10px to the RIGHT of the word's right edge,
       * vertically centered on the word.
       * Starts further left (x = -(ICON_SIZE + 20)), slides right to x = 0.
       */
      function positionRightOfWord(iconEl, wordEl) {
        if (!iconEl || !wordEl) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const wRect = wordEl.getBoundingClientRect();
        const gap = 10;

        const startPos = wordTriggerScroll(allWords.indexOf(wordEl));
        const isActive = currentScroll >= startPos && currentScroll < scrollEnd;

        gsap.set(iconEl, {
          left: wRect.right - cRect.left + gap, // 10px right of word's right edge
          top: wRect.top - cRect.top + (wRect.height - ICON_SIZE) / 2,
          ...(isActive ? showLeft : hideLeft),
        });
      }

      // ── Word lookups ──────────────────────────────────────────────────────
      const match = (target) => (w) =>
        w.textContent
          .trim()
          .toLowerCase()
          .replace(/[^a-z]/g, "") === target;

      const beganWord = allWords.find(match("began"));
      const restlessnessWord = allWords.find(match("restlessness"));
      const developerWord = allWords.find(match("developer"));
      const rightWord = allWords.find(match("right"));

      positionAboveWord(rocketIconRef.current, beganWord);
      positionAboveWord(robotIconRef.current, restlessnessWord);
      positionRightOfWord(reactIconRef.current, developerWord);
      positionRightOfWord(muscleIconRef.current, rightWord);

      // ── Icon ScrollTrigger factory ────────────────────────────────────────
      /**
       * Creates a range-based ScrollTrigger for one icon.
       * showProps / hideProps define the GSAP tween targets for show/hide.
       * The range covers [wordFillScrollPos → Work's top] so all four
       * directional callbacks work correctly:
       *   onEnter      ↓ past word fill pos  → show
       *   onLeave      ↓ into Work           → hide
       *   onEnterBack  ↑ from Work           → show
       *   onLeaveBack  ↑ past word toward Hero → hide
       */
      function makeIconTrigger(iconEl, wordEl, showProps, hideProps) {
        if (!iconEl || !wordEl) return;
        const startPos = wordTriggerScroll(allWords.indexOf(wordEl));
        ScrollTrigger.create({
          start: startPos,
          end: scrollEnd,
          onEnter: () =>
            gsap.to(iconEl, {
              ...showProps,
              duration: 0.55,
              ease: "back.out(2)",
              overwrite: true,
            }),
          onLeave: () =>
            gsap.to(iconEl, { ...hideProps, duration: 0.2, overwrite: true }),
          onEnterBack: () =>
            gsap.to(iconEl, {
              ...showProps,
              duration: 0.55,
              ease: "back.out(2)",
              overwrite: true,
            }),
          onLeaveBack: () =>
            gsap.to(iconEl, { ...hideProps, duration: 0.2, overwrite: true }),
        });
      }

      // Icons are positioned and initialized with correct states, now create triggers
      makeIconTrigger(rocketIconRef.current, beganWord, showAbove, hideAbove);
      makeIconTrigger(
        robotIconRef.current,
        restlessnessWord,
        showAbove,
        hideAbove,
      );

      makeIconTrigger(reactIconRef.current, developerWord, showLeft, hideLeft);
      makeIconTrigger(muscleIconRef.current, rightWord, showLeft, hideLeft);

      // Return cleanup function
      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: containerRef, dependencies: [theme] },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full font-main font-medium text-[4rem] leading-[1.15] select-none"
    >
      {/* Above-word icons (Y-axis) — decorative, must not intercept mouse */}
      <SvgIcon
        ref={rocketIconRef}
        src={ICONS.rocket}
        className="absolute z-10 pointer-events-none"
      />
      <SvgIcon
        ref={robotIconRef}
        src={ICONS.robot}
        className="absolute z-10 pointer-events-none"
      />

      {/* Left-of-word icons (X-axis) — decorative, must not intercept mouse */}
      <SvgIcon
        ref={reactIconRef}
        src={ICONS.react}
        className="absolute z-10 pointer-events-none"
      />
      <SvgIcon
        ref={muscleIconRef}
        src={ICONS.muscle}
        className="absolute z-10 pointer-events-none"
      />

      <div className="grid grid-cols-[1fr_auto] gap-x-20 items-start">
        <div className="pt-20">
          <span className="block text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-10">
            About
          </span>

          <div className="pb-[60px]" data-split>
            Began as a web designer, spending over a decade crafting layouts and
            delivering across a wide range of disciplines.
          </div>

          <div className="pb-[60px]" data-split>
            But there was always a quiet restlessness — a sense of
            incompleteness — that pushed me to become a self-taught front-end
            developer.
          </div>

          <div className="pb-[60px]" data-split>
            That crossover — a decade of design instinct fused with engineering
            — means I don't just build things that work. I build things that
            feel right.
          </div>

          <div data-split>
            Today I work across the full stack — designing systems, writing
            clean code, and obsessing over the experience in between.
          </div>
          <div className="mt-10">
            <SocialLinks />
          </div>
        </div>

        <div className="pt-20 w-[420px] shrink-0">
          <ScrambleHoverEffect />
          <Toolkit />
        </div>
      </div>
    </div>
  );
};
