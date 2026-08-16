"use client";
import React, { useRef, use, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getProjectById, PROJECTS } from "@/constants/projects";
import { useTheme } from "@/hooks/useTheme";
import { navigateWithVerticalCurtain } from "@/components/anim/VerticalCurtainTransition";

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default function ProjectDetailsPage({ params }) {
  const router = useRouter();
  const { theme } = useTheme();
  const pageContainerRef = useRef(null);

  // Unwrap params using React.use for Next.js 15/16 client components
  const resolvedParams = use(params);
  const project = getProjectById(resolvedParams.id);

  // Hide the page immediately before first paint so the blob covers raw HTML
  useLayoutEffect(() => {
    if (pageContainerRef.current) {
      gsap.set(pageContainerRef.current, { opacity: 0 });
    }
  }, []);

  // Reveal the page only after the blob has fully retracted
  useEffect(() => {
    const onRevealed = () => {
      gsap.to(pageContainerRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      // Stagger child elements in after page becomes visible
      gsap.from(".anim-stagger", {
        y: 25,
        opacity: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.05,
      });
    };

    window.addEventListener("curtain-page-revealed", onRevealed, { once: true });
    return () => window.removeEventListener("curtain-page-revealed", onRevealed);
  }, []);

  if (!project) {
    return notFound();
  }

  const handleBackNavigation = (e) => {
    e.preventDefault();
    const returnUrl = `/?card=${project.category}#work`;
    navigateWithVerticalCurtain(router, returnUrl, e, {
      title: project.title,
      category: project.categoryLabel || project.category,
    });
  };

  return (
    <main
      ref={pageContainerRef}
      className={`min-h-screen w-full transition-colors duration-500 py-8 md:py-16 px-6 md:px-12 lg:px-20 ${
        theme === "light"
          ? "bg-[#faf9f6] text-brand-dark"
          : "bg-[#141518] text-white"
      }`}
    >
      {/* Top Navigation Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 md:mb-12 anim-stagger">
        <button
          onClick={handleBackNavigation}
          className={`group flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 font-main font-semibold text-sm ${
            theme === "light"
              ? "bg-white border-black/10 hover:border-brand-orange hover:text-brand-orange shadow-sm"
              : "bg-white/5 border-white/10 hover:border-brand-yellow hover:text-brand-yellow shadow-sm"
          }`}
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeftIcon />
          </span>
          <span>Back to Overview</span>
        </button>

        <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-orange">
          {project.categoryLabel}
        </span>
      </div>

      {/* Main Content Card Container */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-[#1c1d22] border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[720px]">
        {/* Left 60%: Visual Showcase / Hero preview */}
        <div className="w-full lg:w-3/5 bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/[0.02] p-8 md:p-14 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono uppercase tracking-widest mb-6 anim-stagger">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.category}
            </div>

            <h1 className="font-main font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-6 anim-stagger">
              {project.title}
            </h1>
          </div>

          {/* Project Screenshot / Visual Showcase Frame */}
          <div className="my-8 w-full aspect-[16/10] rounded-2xl bg-black/[0.04] dark:bg-black/40 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner anim-stagger">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white font-black text-2xl"
                style={{ backgroundColor: project.color }}
              >
                {project.title.charAt(0)}
              </div>
              <span className="font-main font-semibold text-lg opacity-80 mb-2">
                {project.title} Showcase
              </span>
              <p className="text-sm opacity-50 max-w-md font-mono">
                Interactive production interface &amp; design architecture
              </p>
            </div>
          </div>

          {/* Live Action Bar */}
          <div className="relative z-10 flex items-center justify-between pt-4 anim-stagger">
            <span className="text-xs font-mono uppercase tracking-widest opacity-40">
              ID // {project.id}
            </span>
            <a
              href={project.liveUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange text-white font-main font-bold text-sm hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-lg shadow-brand-orange/20"
            >
              <span>View Live Project</span>
              <ExternalLinkIcon />
            </a>
          </div>
        </div>

        {/* Right 40%: Project Specs & Details */}
        <div className="w-full lg:w-2/5 p-8 md:p-12 lg:p-14 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-8">
            {/* Overview / Summary */}
            <div className="anim-stagger">
              <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-3">
                Overview
              </h4>
              <p className="text-base md:text-lg leading-relaxed text-black/70 dark:text-white/70 font-main">
                {project.summary}
              </p>
            </div>

            {/* Key Features */}
            {project.features && (
              <div className="anim-stagger">
                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3">
                  Key Highlights
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {project.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm leading-snug text-black/80 dark:text-white/80"
                    >
                      <span className="text-brand-orange font-bold text-base leading-none">
                        ✦
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Matrix */}
            <div className="anim-stagger">
              <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 text-xs font-main font-semibold tracking-wide"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation between projects */}
          <div className="pt-10 mt-10 border-t border-black/10 dark:border-white/10 flex items-center justify-between anim-stagger">
            <button
              onClick={handleBackNavigation}
              className="text-xs font-mono uppercase tracking-widest text-brand-orange hover:underline"
            >
              ← Back to Grid
            </button>
            <span className="text-xs font-mono opacity-30">
              CodeGorrilla Portfolio
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
