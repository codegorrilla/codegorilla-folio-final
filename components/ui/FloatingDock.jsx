"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import SvgIcon from "./SvgIcon";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

const FloatingDock = () => {
  const dockRef = useRef(null);
  const lenis = useLenis();

  // State for toggles and progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Set initial hidden/squashed state
    gsap.set(dock, { y: 150, scaleY: 1.5, scaleX: 0.8 });

    // Dock entrance/exit animation based on About section
    ScrollTrigger.create({
      trigger: "#about-section",
      start: "top 50%", // Trigger when the top of about section hits middle of screen
      onEnter: () => {
        gsap.to(dock, {
          y: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto",
        });
      },
      onLeaveBack: () => {
        gsap.to(dock, {
          y: 150,
          scaleY: 1.5,
          scaleX: 0.8,
          duration: 0.5,
          ease: "power2.in",
          overwrite: "auto",
        });
      },
    });

    // Global scroll progress tracker
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });
  });

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 pointer-events-none">
      <div
        ref={dockRef}
        className="
          flex items-center gap-3 px-3 py-2
          bg-black/60 backdrop-blur-md
          border border-white/10
          rounded-full shadow-2xl
          pointer-events-auto
          will-change-transform
        "
      >
        {/* 1. Scroll Progress / Back to Top */}
        <button
          onClick={() => lenis?.scrollTo(0)}
          className="relative w-9 h-9 flex items-center justify-center cursor-none hover-trigger group rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Back to top"
        >
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-white/10"
              strokeWidth="2"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-brand-yellow transition-all duration-75"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={100 - scrollProgress * 100}
            />
          </svg>
          <svg
            className="w-4 h-4 text-white group-hover:-translate-y-0.5 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        {/* 2. Audio Toggle */}
        <button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className="w-9 h-9 flex items-center justify-center cursor-none hover-trigger text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label={isAudioOn ? "Mute audio" : "Unmute audio"}
        >
          {isAudioOn ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="1" x2="1" y2="23"></line>
            </svg>
          )}
        </button>

        {/* 3. GitHub Link */}
        <a
          href="https://github.com/codegorrilla"
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center cursor-none hover-trigger text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="GitHub"
        >
          <SvgIcon
            src="/social_icons/github.svg"
            size={18}
            className="brightness-0 invert opacity-80"
          />
        </a>

        {/* 4. Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center cursor-none hover-trigger text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/20 mx-1" />

        {/* 5. Resume Link */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2 px-3 py-1.5
            font-main font-bold text-md text-white/70
            hover:text-white hover:bg-white/10 rounded-full
            transition-colors cursor-none hover-trigger group
          "
        >
          <span>Resume</span>
          <svg
            className="w-3.5 h-3.5 fill-current transition-transform group-hover:translate-y-[2px]"
            viewBox="0 0 24 24"
          >
            <path d="M12 16L7 11l1.4-1.4 2.6 2.6V4h2v8.2l2.6-2.6L17 11l-5 5zm-6 4v-2h12v2H6z" />
          </svg>
        </a>

        {/* 6. Hire Me / Contact Shortcut */}
        <a
          href="mailto:code.gorrilla@gmail.com"
          className="
            flex items-center justify-center px-5 py-2
            bg-brand-yellow text-black font-main font-bold text-md
            rounded-full
            hover:scale-105 active:scale-95
            transition-transform cursor-none hover-trigger
            shadow-[0_0_15px_rgba(240,73,58,0.4)]
          "
        >
          Hire Me
        </a>
      </div>
    </div>
  );
};

export default FloatingDock;
