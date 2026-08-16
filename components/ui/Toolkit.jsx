"use client";
import React, { useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

const SPEC_GROUPS = [
  {
    index: "01",
    category: "FRONT-END",
    skills: [
      { name: "React", reveal: "React // UI" },
      { name: "Next.js", reveal: "Next.js // SSR" },
      { name: "TypeScript", reveal: "TS // Types" },
      { name: "Tailwind CSS", reveal: "Tailwind // CSS" },
    ],
  },
  {
    index: "02",
    category: "BACK-END",
    skills: [
      { name: "Node.js", reveal: "Node // Runtime" },
      { name: "Express.js", reveal: "Express // API" },
      { name: "MongoDB", reveal: "Mongo // NoSQL" },
    ],
  },
  {
    index: "03",
    category: "UTILITIES & TOOLING",
    skills: [
      { name: "npm", reveal: "npm // Registry" },
      { name: "Bun", reveal: "Bun // Fast" },
      { name: "Git", reveal: "Git // VCS" },
      { name: "GitHub", reveal: "GitHub // CI" },
      { name: "GitLab", reveal: "GitLab // DevOps" },
      { name: "TortoiseSVN", reveal: "Tortoise // SVN" },
    ],
  },
  {
    index: "04",
    category: "AGENTIC WORKFLOW",
    skills: [
      { name: "Antigravity", reveal: "AGY // Agent" },
      { name: "LM Studio", reveal: "LMS // Local LLM" },
      { name: "Codex", reveal: "Codex // AI Pair" },
    ],
  },
];

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#_01";

// High-performance deterministic scramble helper
const scrambleText = (el, targetText, duration = 180) => {
  if (!el) return;
  if (el._scrambleTimer) clearInterval(el._scrambleTimer);

  const length = targetText.length;
  const startTime = Date.now();

  el._scrambleTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const revealedCount = Math.floor(progress * length);

    let output = "";
    for (let i = 0; i < length; i++) {
      if (targetText[i] === " " || targetText[i] === "/") {
        output += targetText[i];
      } else if (i < revealedCount) {
        output += targetText[i];
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
  }, 18);
};

const SpecItem = ({ name, reveal }) => {
  const textRef = useRef(null);
  const isHoveredRef = useRef(false);

  const handlePointerEnter = () => {
    if (typeof window === "undefined" || window.innerWidth < 1200) return;
    if (isHoveredRef.current) return;
    isHoveredRef.current = true;
    scrambleText(textRef.current, reveal, 200);
  };

  const handlePointerLeave = () => {
    if (typeof window === "undefined" || window.innerWidth < 1200) return;
    if (!isHoveredRef.current) return;
    isHoveredRef.current = false;
    scrambleText(textRef.current, name, 200);
  };

  useEffect(() => {
    const el = textRef.current;
    return () => {
      if (el && el._scrambleTimer) {
        clearInterval(el._scrambleTimer);
      }
    };
  }, []);

  // Use max text to reserve container width and prevent layout shift / hover oscillation
  const sizerText = name.length >= reveal.length ? name : reveal;

  return (
    <span
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="group inline-grid grid-cols-1 grid-rows-1 items-center cursor-pointer py-0.5"
    >
      {/* Invisible sizer to lock element width and prevent reflow on sibling items */}
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 font-main font-medium opacity-0 pointer-events-none select-none whitespace-nowrap"
      >
        {sizerText}
      </span>

      {/* Visible animated text with pointer-events-none to prevent DOM mutation retriggering */}
      <span
        ref={textRef}
        className="col-start-1 row-start-1 font-main font-medium opacity-80 group-hover:opacity-100 group-hover:text-brand-orange dark:group-hover:text-brand-yellow transition-colors duration-200 whitespace-nowrap select-none pointer-events-none"
      >
        {name}
      </span>
    </span>
  );
};

const Toolkit = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full relative mt-8 sm:mt-10 select-none">
      {/* Header Block */}
      <div className="flex flex-col items-start min-[1200px]:items-end mb-4 sm:mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand-orange mb-1">
          spec // arsenal
        </span>
        <h2 className="font-main font-black text-brand-yellow text-[2rem] sm:text-[2.25rem] xl:text-[2.5rem] lowercase leading-none">
          my toolkit
        </h2>
      </div>

      {/* Swiss Editorial Spec Matrix */}
      <div className="w-full flex flex-col divide-y divide-black/10 dark:divide-white/10 border-y border-black/10 dark:divide-white/10">
        {SPEC_GROUPS.map((group) => (
          <div key={group.index} className="py-3.5 sm:py-4 flex flex-col gap-1.5">
            {/* Category Monospace Line */}
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest opacity-50">
              <span>
                {group.index} // {group.category}
              </span>
              <span className="text-[9px] tracking-normal opacity-70">
                ● ACTIVE
              </span>
            </div>

            {/* Inline Typographic Skill List */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.925rem] sm:text-[1rem] leading-relaxed">
              {group.skills.map((skill, index) => (
                <React.Fragment key={skill.name}>
                  <SpecItem name={skill.name} reveal={skill.reveal} />
                  {index < group.skills.length - 1 && (
                    <span className="opacity-30 text-xs select-none">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolkit;
