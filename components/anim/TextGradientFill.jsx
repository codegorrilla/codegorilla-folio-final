"use client";
import React, { useRef, useState, useEffect } from "react";
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

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1200px)");

    const timeoutId = setTimeout(() => {
      setIsDesktop(mediaQuery.matches);
    }, 0);

    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      clearTimeout(timeoutId);
    };
  }, []);

  useGSAP(
    () => {
      // Only enable SplitText and on-scroll text gradient fill animation on desktop (>= 1200px)
      if (!isDesktop) return;

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

      // ── In-Content Icons (Only on screen size >= 1200px) ─────────────────
      const ICON_SIZE = 32;

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

      const showAbove = { opacity: 1, y: 0, x: ICON_SIZE + 10 };
      const hideAbove = { opacity: 0, y: ICON_SIZE + 10, x: ICON_SIZE + 10 };

      const showLeft = { opacity: 1, x: 0 };
      const hideLeft = { opacity: 0, x: -(ICON_SIZE + 20) };

      function positionAboveWord(iconEl, wordEl) {
        if (!iconEl || !wordEl) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const wRect = wordEl.getBoundingClientRect();
        const gap = 10;

        const startPos = wordTriggerScroll(allWords.indexOf(wordEl));
        const isActive = currentScroll >= startPos && currentScroll < scrollEnd;

        gsap.set(iconEl, {
          left: wRect.left - cRect.left,
          top: wRect.top - cRect.top - ICON_SIZE - gap,
          ...(isActive ? showAbove : hideAbove),
        });
      }

      function positionRightOfWord(iconEl, wordEl) {
        if (!iconEl || !wordEl) return;
        const cRect = containerRef.current.getBoundingClientRect();
        const wRect = wordEl.getBoundingClientRect();
        const gap = 10;

        const startPos = wordTriggerScroll(allWords.indexOf(wordEl));
        const isActive = currentScroll >= startPos && currentScroll < scrollEnd;

        gsap.set(iconEl, {
          left: wRect.right - cRect.left + gap,
          top: wRect.top - cRect.top + (wRect.height - ICON_SIZE) / 2,
          ...(isActive ? showLeft : hideLeft),
        });
      }

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
    { scope: containerRef, dependencies: [theme, isDesktop] },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full font-main font-medium text-[clamp(1.125rem,1.85vw,2.25rem)] xl:text-[clamp(1.25rem,2.1vw,2.75rem)] leading-[1.28] select-none"
    >
      {/* Above-word and side icons — visible ONLY for >= 1200px */}
      {isDesktop && (
        <>
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
        </>
      )}

      <div className="grid grid-cols-1 min-[1200px]:grid-cols-[1fr_auto] gap-y-10 min-[1200px]:gap-x-16 xl:gap-x-20 items-start">
        <div className="pt-4 sm:pt-6 min-[1200px]:pt-12">
          <span className="block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-[clamp(0.75rem,2vh,2rem)]">
            About
          </span>

          <div className="pb-[clamp(0.875rem,2.2vh,2.25rem)]" data-split>
            Began as a web designer, spending over a decade crafting layouts and
            delivering across a wide range of disciplines.
          </div>

          <div className="pb-[clamp(0.875rem,2.2vh,2.25rem)]" data-split>
            But there was always a quiet restlessness — a sense of
            incompleteness — that pushed me to become a self-taught front-end
            developer.
          </div>

          <div className="pb-[clamp(0.875rem,2.2vh,2.25rem)]" data-split>
            That crossover — a decade of design instinct fused with engineering
            — means I don&apos;t just build things that work. I build things that
            feel right.
          </div>

          <div data-split>
            Today I work across the full stack — designing systems, writing
            clean code, and obsessing over the experience in between.
          </div>

          <div className="mt-[clamp(1rem,2.5vh,2.5rem)]">
            <SocialLinks />
          </div>

          {/* Profile image & Toolkit section on mobile/tablet (< 1200px) */}
          <div className="w-full flex flex-col items-center px-4 mt-8 min-[1200px]:hidden">
            <div className="w-full max-w-none min-[992px]:max-w-[480px]">
              <ScrambleHoverEffect />
            </div>
            <div className="w-full max-w-none min-[992px]:max-w-[480px]">
              <Toolkit />
            </div>
          </div>
        </div>

        {/* Desktop sidebar: Profile image and Toolkit (>= 1200px) */}
        <div className="hidden min-[1200px]:block pt-4 min-[1200px]:pt-12 w-[360px] xl:w-[420px] shrink-0">
          <ScrambleHoverEffect />
          <Toolkit />
        </div>
      </div>
    </div>
  );
};

