"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

const SPEC_GROUPS = [
  {
    index: "01",
    category: "UI DESIGN",
    skills: ["Figma", "Illustrator"],
  },
  {
    index: "02",
    category: "FRONT-END",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    index: "03",
    category: "BACK-END",
    skills: ["Node.js", "Express.js", "MongoDB"],
  },
  {
    index: "04",
    category: "UTILITIES & TOOLING",
    skills: ["npm", "Bun", "Git", "GitHub", "GitLab", "TortoiseSVN"],
  },
  {
    index: "05",
    category: "AGENTIC WORKFLOW",
    skills: ["Antigravity", "LM Studio", "Codex"],
  },
];

const Toolkit = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const stackContainerRef = useRef(null);
  const itemsRef = useRef([]);

  const openStack = useCallback(() => {
    setIsOpen(true);
    const container = stackContainerRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!container) return;

    gsap.killTweensOf([container, ...items]);
    gsap.set(container, { display: "block", opacity: 1, pointerEvents: "auto" });

    gsap.fromTo(
      items,
      {
        y: 28,
        opacity: 0,
        scale: 0.94,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.06,
        duration: 0.45,
        ease: "back.out(1.3)",
      }
    );
  }, []);

  const closeStack = useCallback(() => {
    const container = stackContainerRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!container) return;

    gsap.killTweensOf([container, ...items]);
    gsap.to(items, {
      y: 18,
      opacity: 0,
      scale: 0.96,
      stagger: 0.03,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(container, { display: "none", opacity: 0, pointerEvents: "none" });
        setIsOpen(false);
      },
    });
  }, []);

  const toggleToolkit = () => {
    if (isOpen) {
      closeStack();
    } else {
      openStack();
    }
  };

  // Close on Escape key or outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeStack();
    };

    const handleClickOutside = (e) => {
      if (
        stackContainerRef.current &&
        !stackContainerRef.current.contains(e.target) &&
        !e.target.closest("#my-toolkit-trigger")
      ) {
        closeStack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen, closeStack]);

  return (
    <div className={`relative select-none ${className}`}>
      {/* ── Staggered Stacked Toolkit Container (expands upwards from bottom right) ── */}
      <div
        ref={stackContainerRef}
        style={{ display: "none" }}
        className="absolute bottom-full right-0 mb-3 w-[min(380px,90vw)] sm:w-[420px] bg-[#121418]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-5 z-50 pointer-events-none"
      >
        {/* Stack Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/15">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-orange">
              spec // arsenal
            </span>
            <span className="font-main font-bold text-white text-sm sm:text-base tracking-wide lowercase">
              my toolkit
            </span>
          </div>
          <button
            onClick={closeStack}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
            aria-label="Close toolkit"
          >
            ✕
          </button>
        </div>

        {/* Stacked Format Cards (animated staggered on click) */}
        <div className="flex flex-col gap-2">
          {SPEC_GROUPS.map((group, index) => (
            <div
              key={group.index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="toolkit-stack-item rounded-xl p-3 bg-white/[0.04] border border-white/10 hover:border-brand-yellow/40 hover:bg-white/[0.08] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1 font-mono text-[10px] uppercase tracking-widest text-brand-orange">
                <span>
                  {group.index} // {group.category}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[13px] text-white">
                {group.skills.map((skill, sIdx) => (
                  <React.Fragment key={skill}>
                    <span className="font-main font-medium text-white/90 hover:text-brand-yellow transition-colors duration-150 whitespace-nowrap">
                      {skill}
                    </span>
                    {sIdx < group.skills.length - 1 && (
                      <span className="opacity-30 text-[10px] select-none">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Clickable Link on Bottom Right (Large, Yellow, Lowercase) ── */}
      <button
        id="my-toolkit-trigger"
        onClick={toggleToolkit}
        className="group flex items-center gap-2.5 font-main font-black text-2xl sm:text-3xl xl:text-4xl lowercase text-brand-yellow hover:opacity-80 transition-opacity duration-200 cursor-pointer pointer-events-auto select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>my toolkit</span>
        <span
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-yellow/20 text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            isOpen ? "rotate-45 bg-brand-yellow text-black" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          }`}
        >
          ↗
        </span>
      </button>
    </div>
  );
};

export default Toolkit;
