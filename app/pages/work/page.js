"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/anim/Header";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PROJECTS } from "@/constants/projects";
import { navigateWithVerticalCurtain } from "@/components/anim/VerticalCurtainTransition";

gsap.registerPlugin(ScrollTrigger);

// --- SVG Icons ---
const FigmaLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 38 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19H19V28.5Z"
      fill="#1ABCFE"
    />
    <path
      d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
      fill="#0ACF83"
    />
    <path
      d="M19 0H9.5C4.25329 0 0 4.2533 0 9.5C0 14.7467 4.25329 19 9.5 19H19V0Z"
      fill="#F24E1E"
    />
    <path
      d="M38 9.5C38 14.7467 33.7467 19 28.5 19H19V0H28.5C33.7467 0 38 4.2533 38 9.5Z"
      fill="#FF7262"
    />
    <path
      d="M38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5C19 23.2533 23.2533 19 28.5 19H38V28.5Z"
      fill="#A259FF"
    />
  </svg>
);

const NextLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="64" cy="64" r="64" fill="currentColor" fillOpacity="0.1" />
    <path
      d="M64 0C28.65 0 0 28.65 0 64C0 99.35 28.65 128 64 128C99.35 128 128 99.35 128 64C128 28.65 99.35 0 64 0ZM107.5 110L42.5 32H32V96H40V48L97.5 116C87.5 123.5 76 128 64 128C28.65 128 0 99.35 0 64C0 28.65 28.65 0 64 0C99.35 0 128 28.65 128 64C128 82 120.5 98.5 107.5 110ZM88 96H96V56L88 46V96Z"
      fill="currentColor"
    />
  </svg>
);

const ReactLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="-11.5 -10.23174 23 20.46348"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const PlaygroundLogo = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fillOpacity="0.15" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const ArrowRightIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const getCategoryLogo = (category) => {
  switch (category) {
    case "figma":
      return <FigmaLogo />;
    case "nextjs":
      return <NextLogo />;
    case "react":
      return <ReactLogo />;
    case "playground":
    default:
      return <PlaygroundLogo />;
  }
};

// Distinct, vibrant color palettes and card configurations
const CARD_CONFIGS = [
  {
    id: "ecommerce-ui",
    variant: "landscape",
    containerBg: "bg-[#ECE6F8] text-[#1D192B] border-[#D0BCFF]/60",
    badgeBg: "bg-[#7C3AED]/15 text-[#6D28D9]",
    btnClass: "bg-[#4F378B] text-white hover:bg-[#38236B]",
    accentColor: "#7C3AED",
    stat1: { value: "94%", label: "checkout conversion" },
    stat2: { value: "60fps", label: "fluid micro-prototypes" },
  },
  {
    id: "saas-dashboard",
    variant: "square",
    containerBg: "bg-[#18181B] text-[#FAFAFA] border-white/10 shadow-black/40",
    badgeBg: "bg-[#06B6D4]/20 text-[#38BDF8]",
    btnClass: "bg-white text-black hover:bg-neutral-200",
    accentColor: "#06B6D4",
    stat1: { value: "0ms", label: "telemetry latency" },
  },
  {
    id: "blog-platform",
    variant: "landscape",
    containerBg: "bg-[#FBF8EF] text-[#292524] border-[#E7E5E4]",
    badgeBg: "bg-[#D97706]/15 text-[#B45309]",
    btnClass: "bg-[#292524] text-white hover:bg-black",
    accentColor: "#D97706",
    stat1: { value: "100", label: "Core Web Vitals" },
    stat2: { value: "10x", label: "instant ISR cache" },
  },
  {
    id: "saas-boilerplate",
    variant: "square",
    containerBg: "bg-[#FFE4E6] text-[#881337] border-[#FECDD3]",
    badgeBg: "bg-[#F43F5E]/20 text-[#BE123C]",
    btnClass: "bg-[#9F1239] text-white hover:bg-[#881337]",
    accentColor: "#F43F5E",
    stat1: { value: "48h", label: "time to production" },
  },
  {
    id: "weather-app",
    variant: "landscape",
    containerBg: "bg-[#DCFCE7] text-[#064E3B] border-[#A7F3D0]",
    badgeBg: "bg-[#10B981]/20 text-[#047857]",
    btnClass: "bg-[#065F46] text-white hover:bg-[#064E3B]",
    accentColor: "#10B981",
    stat1: { value: "7-day", label: "hyper-local forecast" },
    stat2: { value: "0.2s", label: "dynamic canvas sync" },
  },
  {
    id: "chat-ui",
    variant: "square",
    containerBg: "bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]",
    badgeBg: "bg-[#3B82F6]/20 text-[#1D4ED8]",
    btnClass: "bg-[#1E40AF] text-white hover:bg-[#1E3A8A]",
    accentColor: "#3B82F6",
    stat1: { value: "120Hz", label: "spring layout physics" },
  },
  {
    id: "gsap-experiments",
    variant: "landscape",
    containerBg: "bg-[#FFEDD5] text-[#7C2D12] border-[#FED7AA]",
    badgeBg: "bg-[#F97316]/20 text-[#C2410C]",
    btnClass: "bg-[#9A3412] text-white hover:bg-[#7C2D12]",
    accentColor: "#F97316",
    stat1: { value: "4D", label: "perspective inertia" },
    stat2: { value: "120fps", label: "kinetic scroll timeline" },
  },
];

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

const WorkPage = ({ children, ...props }) => {
  const router = useRouter();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const captionPart1Ref = useRef(null);
  const captionPart2Ref = useRef(null);

  const handleProjectSelect = (project, event) => {
    navigateWithVerticalCurtain(
      router,
      `/projects/${project.id}`,
      event,
      {
        title: project.title,
        category: project.categoryLabel || project.category,
      }
    );
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const cards = gsap.utils.toArray(".testi_3d_card");
      if (!cards.length) return;

      let stInstance = null;

      // Mathematical 3D ribbon parameters (Wisprflow Pattern calibrated for zero edge-clipping)
      const GAP_PCT = 14;
      const GAP_GROW_PCT = 0;
      const GAP_FROM_PX = 1920;
      const GAP_PCT_MOBILE = 20;
      const GAP_MIN_PX = 32;
      const GAP_MAX_PX = 140;
      const SCROLL_RATIO = 0.95;

      const ORBIT_CARD_PCT = 35;
      const ORBIT_MIN_PX = 160;
      const PERSP_CARD_PCT = 260;
      const ROT_IN = -22;
      const ROT_OUT = 22;
      const ROT_EASE = "power1.inOut";
      const ROT_SPAN_PCT = 210;

      const DECK_SCALE_GROW = 0.4;
      const DECK_FROM_PX = 1920;
      const DECK_SCALE_MAX = 1.2;

      const MIN_W = 768;
      const SCRUB = 1.2;
      const SCRUB_MOBILE = 1.0;

      function destroy() {
        if (stInstance) {
          stInstance.kill();
          stInstance = null;
        }
      }

      function build() {
        destroy();

        const vw = window.innerWidth;
        const mobile = vw < MIN_W;
        const scrubVal = mobile ? SCRUB_MOBILE : SCRUB;
        const gapPct = mobile ? GAP_PCT_MOBILE : GAP_PCT;

        // Position cards centered inside the stage
        cards.forEach((card) => {
          card.style.position = "absolute";
          card.style.left = "50%";
          card.style.top = "50%";
          card.style.transformStyle = "preserve-3d";
          card.style.backfaceVisibility = "hidden";
          card.style.willChange = "transform";
          card.style.margin = "0";
        });

        const deckScale = mobile
          ? 1
          : Math.min(
              DECK_SCALE_MAX,
              Math.max(1, 1 + (vw / DECK_FROM_PX - 1) * DECK_SCALE_GROW)
            );

        // Measure card widths
        const widths = cards.map((c) => {
          const fallbackW = c.classList.contains("card_square") ? 384 : 672;
          return (c.offsetWidth || fallbackW) * deckScale;
        });
        const maxW = Math.max(...widths);
        const sorted = [...widths].sort((a, b) => a - b);
        const medW = sorted[Math.floor(sorted.length / 2)] || (mobile ? 320 : 520);

        const wideBonus = (Math.max(0, vw - GAP_FROM_PX) * GAP_GROW_PCT) / 100;
        const gapFor = (w) =>
          Math.min(GAP_MAX_PX, Math.max(GAP_MIN_PX, (w * gapPct) / 100 + wideBonus));
        const gapPx = gapFor(medW);

        const offsets = [0];
        for (let i = 1; i < cards.length; i++) {
          const pairW = (widths[i - 1] + widths[i]) / 2;
          offsets[i] = offsets[i - 1] + pairW + gapPx;
        }
        const spanPx = offsets[offsets.length - 1];
        const travelHalf = (vw + maxW) / 2 + (maxW * 12) / 100;

        const orbitPx = Math.max(ORBIT_MIN_PX, (medW * ORBIT_CARD_PCT) / 100);
        const perspPx = (medW * PERSP_CARD_PCT) / 100;

        track.style.perspective = `${perspPx}px`;

        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          scale: deckScale,
          transformOrigin: `50% 50% -${orbitPx}px`,
          force3D: true,
        });

        const rotEase = gsap.parseEase(ROT_EASE);
        const RAD = Math.PI / 180;
        const rotHalf = (medW * ROT_SPAN_PCT) / 100;

        function rotAt(sx) {
          let p = (sx + rotHalf) / (rotHalf * 2);
          p = p < 0 ? 0 : p > 1 ? 1 : p;
          return ROT_IN + (ROT_OUT - ROT_IN) * rotEase(p);
        }

        function shrinkAt(sx) {
          const depth = orbitPx * (1 - Math.cos(rotAt(sx) * RAD));
          return perspPx / (perspPx + depth);
        }

        function stretchAt(sx) {
          return shrinkAt(sx);
        }

        const STEP = 4;
        const LIMIT = travelHalf * 1.25;

        function integrate(dir) {
          const tbl = [0];
          let s = 0;
          let guard = 0;
          while (Math.abs(s) < LIMIT && guard++ < 20000) {
            s += dir * STEP * stretchAt(s);
            tbl.push(s);
          }
          return tbl;
        }

        const sPos = integrate(1);
        const sNeg = integrate(-1);

        function screenAt(u) {
          const tbl = u >= 0 ? sPos : sNeg;
          const k = Math.abs(u) / STEP;
          const i0 = Math.floor(k);
          if (i0 >= tbl.length - 1) {
            const last = tbl.length - 1;
            const slope = (tbl[last] - tbl[last - 1]) / STEP;
            return tbl[last] + (Math.abs(u) - last * STEP) * slope;
          }
          return tbl[i0] + (tbl[i0 + 1] - tbl[i0]) * (k - i0);
        }

        function render(head) {
          for (let j = 0; j < cards.length; j++) {
            const u = head - offsets[j];
            const sx = screenAt(u);
            const rot = rotAt(sx);
            const f = shrinkAt(sx);
            cards[j]._x = sx;
            cards[j]._f = f;
            cards[j]._r = rot;
            gsap.set(cards[j], {
              x: sx / f,
              rotateX: rot,
            });
          }
          restack();
        }

        function restack() {
          const order = [...cards].sort((a, b) => Math.abs(a._x) - Math.abs(b._x));
          order.forEach((card, rank) => {
            card.style.zIndex = order.length - rank;
          });
        }

        const headStart = 0;
        const headEnd = spanPx + travelHalf * 0.35;
        render(headStart);

        // Total vertical scroll required to scrub all project cards
        const totalScrollDistance = Math.round((headEnd - headStart) * SCROLL_RATIO);

        // Pin the entire Work section so it stays sticky at top:0
        // for the entire duration of the project cards roll!
        stInstance = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${totalScrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: scrubVal,
          onUpdate: (self) => {
            const currentHead = headStart + (headEnd - headStart) * self.progress;
            render(currentHead);
          },
          invalidateOnRefresh: true,
        });
      }

      build();

      let lastW = window.innerWidth;
      let rebuildTimer = null;
      const handleResize = () => {
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        clearTimeout(rebuildTimer);
        rebuildTimer = setTimeout(() => {
          build();
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener("resize", handleResize);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          build();
          ScrollTrigger.refresh();
        });
      }

      // ── Scramble on scroll into work section ──────────────────────────────
      const triggerScramble = () => {
        scrambleText(
          captionPart1Ref.current,
          "concepts are written on paper.",
          700
        );
        setTimeout(() => {
          scrambleText(
            captionPart2Ref.current,
            "visualised through code.",
            700
          );
        }, 140);
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        onEnter: triggerScramble,
        onEnterBack: triggerScramble,
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(rebuildTimer);
        destroy();
        if (captionPart1Ref.current?._scrambleTimer) {
          clearInterval(captionPart1Ref.current._scrambleTimer);
        }
        if (captionPart2Ref.current?._scrambleTimer) {
          clearInterval(captionPart2Ref.current._scrambleTimer);
        }
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      {...props}
      id="work"
      ref={sectionRef}
      className={`w-full h-screen min-h-screen relative overflow-hidden transition-colors duration-500 select-none flex flex-col justify-between ${
        props.className || ""
      } bg-brand-yellow`}
    >
      <Header variant="work" triggerRef={sectionRef} />

      {/* Section Title & Caption Header - unified inside the same section at the top */}
      <div className="w-full pt-8 sm:pt-10 md:pt-12 pb-2 px-6 flex flex-col items-center text-center z-20 shrink-0 pointer-events-none">
        <span className="block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-1.5 sm:mb-2 pointer-events-auto">
          work
        </span>
        <h3 className="mt-0 font-main font-black text-[clamp(1.5rem,3.8vw,2.75rem)] leading-[1.1] lowercase text-center max-w-3xl text-white pointer-events-auto select-none">
          <span
            ref={captionPart1Ref}
            onMouseEnter={() =>
              scrambleText(
                captionPart1Ref.current,
                "concepts are written on paper.",
                600
              )
            }
            className="inline-block cursor-pointer transition-colors duration-200 hover:text-brand-orange"
          >
            concepts are written on paper.
          </span>{" "}
          <span
            ref={captionPart2Ref}
            onMouseEnter={() =>
              scrambleText(
                captionPart2Ref.current,
                "visualised through code.",
                600
              )
            }
            className="inline-block cursor-pointer transition-colors duration-200 hover:text-brand-orange"
          >
            visualised through code.
          </span>
        </h3>
      </div>

      {/* 3D Rotating Cards Viewport Track - inside the same section with full stage freedom */}
      <div
        ref={trackRef}
        className="relative flex-1 w-full h-full flex items-center justify-center pointer-events-auto overflow-visible"
      >
        {CARD_CONFIGS.map((cfg) => {
          const project = PROJECTS.find((p) => p.id === cfg.id);
          if (!project) return null;

          const isLandscape = cfg.variant === "landscape";

          return (
            <div
              key={project.id}
              onClick={(e) => handleProjectSelect(project, e)}
              className={`testi_3d_card ${
                isLandscape
                  ? "card_landscape w-[88vw] sm:w-[34rem] md:w-[42rem]"
                  : "card_square w-[85vw] sm:w-[21rem] md:w-[24rem]"
              } h-[21.5rem] sm:h-[22.5rem] rounded-[2rem] border p-5 sm:p-6 flex flex-col justify-between shadow-2xl transition-shadow duration-300 hover:shadow-black/25 cursor-pointer ${
                cfg.containerBg
              }`}
            >
              {/* Top Badge & Header */}
              <div className="flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center p-2 bg-black/5 dark:bg-white/10 shadow-sm shrink-0">
                    {getCategoryLogo(project.category)}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-60 font-bold">
                      {project.categoryLabel}
                    </div>
                    <h4 className="font-main font-black text-base sm:text-lg leading-tight tracking-tight">
                      {project.title}
                    </h4>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider shrink-0 ${cfg.badgeBg}`}
                >
                  {project.category}
                </span>
              </div>

              {/* Middle Content */}
              {isLandscape ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-auto items-center z-10">
                  {/* Left Quote */}
                  <div className="flex flex-col justify-center">
                    <p className="font-main font-bold text-sm sm:text-base leading-snug tracking-tight opacity-90 mb-2 sm:mb-2.5 line-clamp-3">
                      “{project.summary}”
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((st, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] sm:text-[11px] font-mono font-medium opacity-75"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Visual Frame & Stats */}
                  <div className="flex flex-col gap-2">
                    <div className="w-full aspect-[16/8] sm:aspect-[16/8.5] rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-2.5 flex flex-col justify-between relative overflow-hidden shadow-inner">
                      <div className="flex items-center justify-between text-[10px] font-mono opacity-50">
                        <span>INTERFACE // 0{cfg.id.length}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="my-auto text-center font-main font-black text-base sm:text-lg tracking-tight opacity-80 line-clamp-1">
                        {project.title}
                      </div>
                      <div className="text-[9px] font-mono uppercase tracking-widest opacity-40 text-right">
                        Active Interface
                      </div>
                    </div>

                    {/* Stat Tiles */}
                    <div className="grid grid-cols-2 gap-2">
                      {cfg.stat1 && (
                        <div className="p-1.5 sm:p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                          <div className="font-main font-black text-base leading-none">
                            {cfg.stat1.value}
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-mono opacity-60 leading-tight mt-0.5">
                            {cfg.stat1.label}
                          </div>
                        </div>
                      )}
                      {cfg.stat2 && (
                        <div className="p-1.5 sm:p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                          <div className="font-main font-black text-base leading-none">
                            {cfg.stat2.value}
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-mono opacity-60 leading-tight mt-0.5">
                            {cfg.stat2.label}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Square Card Body */
                <div className="my-auto flex flex-col justify-between gap-3 z-10">
                  <p className="font-main font-bold text-sm sm:text-base leading-snug tracking-tight opacity-90 line-clamp-3">
                    “{project.summary}”
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((st, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] sm:text-[11px] font-mono font-medium opacity-75"
                        >
                          {st}
                        </span>
                      ))}
                    </div>

                    {cfg.stat1 && (
                      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between">
                        <span className="font-main font-black text-lg leading-none">
                          {cfg.stat1.value}
                        </span>
                        <span className="text-[10px] font-mono opacity-60 text-right max-w-[130px]">
                          {cfg.stat1.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom CTA Row */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 z-10">
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest opacity-50">
                  CASE STUDY // {project.id}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectSelect(project, e);
                  }}
                  className={`group/btn inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-main font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md ${cfg.btnClass}`}
                >
                  <span>Read Details</span>
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {children}
    </section>
  );
};

export default WorkPage;
