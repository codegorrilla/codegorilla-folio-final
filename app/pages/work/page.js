"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/anim/Header";
import { useTheme } from "@/hooks/useTheme";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CATEGORIES } from "@/constants/projects";
import { navigateWithVerticalCurtain } from "@/components/anim/VerticalCurtainTransition";

gsap.registerPlugin(ScrollTrigger);

// --- Icons ---
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
    <path
      d="M64 0C28.65 0 0 28.65 0 64C0 99.35 28.65 128 64 128C99.35 128 128 99.35 128 64C128 28.65 99.35 0 64 0ZM107.5 110L42.5 32H32V96H40V48L97.5 116C87.5 123.5 76 128 64 128C28.65 128 0 99.35 0 64C0 28.65 28.65 0 64 0C99.35 0 128 28.65 128 64C128 82 120.5 98.5 107.5 110ZM88 96H96V56L88 46V96Z"
      fill="white"
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

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Project Card Component ---

// --- Project Card Component ---

const ProjectCard = ({
  categoryKey,
  activeCard,
  title,
  logo,
  bgColor,
  textColor = "text-white",
  rotation,
  projects = [],
  onProjectClick,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const isPlayground = title === "playground";

  useEffect(() => {
    if (activeCard && activeCard === categoryKey) {
      setIsFlipped(true);
    }
  }, [activeCard, categoryKey]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  useGSAP(() => {
    gsap.to(cardRef.current, {
      rotationY: isFlipped ? 180 : 0,
      duration: 0.8,
      ease: "power3.inOut",
      transformOrigin: "center",
    });
  }, [isFlipped]);

  return (
    <div
      className={`perspective-1000 w-full max-w-[280px] aspect-[3/4] ${rotation} card-item`}
    >
      <div
        ref={cardRef}
        className="preserve-3d relative w-full h-full cursor-pointer"
        onClick={handleFlip}
      >
        {/* Front Face */}
        <div
          className={`backface-hidden absolute inset-0 rounded-3xl flex flex-col justify-between p-8 shadow-2xl transition-all duration-300 ${bgColor} ${textColor} ${isPlayground ? "pl-0" : "pl-8"}`}
        >
          {!isPlayground ? (
            <>
              <h4 className="text-[2rem] font-black leading-tight capitalize max-w-[150px]">
                {title}
              </h4>
              <div className="w-12 h-12">{logo}</div>
            </>
          ) : (
            <div className="h-full w-full flex flex-col justify-end items-end relative pl-0 overflow-hidden">
              <div className="absolute top-1/2 -left-5 w-48 h-48 bg-brand-yellow rounded-full -translate-y-1/2" />
              <h4 className="text-[2rem] font-black leading-tight capitalize z-10">
                {title}
              </h4>
            </div>
          )}
        </div>

        {/* Back Face */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`backface-hidden rotate-y-180 absolute inset-0 rounded-3xl p-8 flex flex-col bg-white text-black shadow-2xl`}
        >
          <button
            onClick={handleFlip}
            className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-20"
          >
            <CloseIcon />
          </button>
          <h4 className="text-xl font-black mb-6 uppercase tracking-tight border-b pb-2">
            Recent {title.split(" ")[0]}
          </h4>
          <ul className="flex flex-col gap-4">
            {projects.map((proj, i) => (
              <li
                key={i}
                onClick={(e) => {
                  e.stopPropagation(); // Don't flip back
                  onProjectClick(proj, e);
                }}
                className="group flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-lg leading-tight group-hover:text-brand-orange transition-colors">
                  {proj.title}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-orange font-bold text-xl translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  →
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Main Work Page Component ---

const WorkPage = ({ children, ...props }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const workContainer = useRef(null);
  const cardsWrapper = useRef(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cardParam = params.get("card");
      if (cardParam) {
        setActiveCard(cardParam);
      }
    }
  }, []);

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
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1200px)", () => {
        const cards = gsap.utils.toArray(".card-item");
        if (!cards.length) return;

        // If returning with activeCard or #work, set cards in place immediately
        if (typeof window !== "undefined" && (window.location.search.includes("card=") || window.location.hash === "#work")) {
          gsap.set(cards, { y: 0, scale: 1 });
        } else {
          // 1. Entrance / Exit Animation (Slide from top)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: workContainer.current,
              start: "top 50%",
              toggleActions: "play none none reverse",
            },
          });

          tl.fromTo(
            cards,
            {
              y: -1000,
              scale: 0.9,
            },
            {
              y: 0,
              scale: 1,
              stagger: 0.15,
              duration: 1.2,
              ease: "power3.out",
            }
          );
        }

        // 2. Magnetic Inertia Effect
        const handleMouseMove = (e) => {
          const { clientX } = e;
          if (!cardsWrapper.current) return;
          const wrapperRect = cardsWrapper.current.getBoundingClientRect();
          const relX = clientX - wrapperRect.left;

          cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX =
              cardRect.left + cardRect.width / 2 - wrapperRect.left;
            const dist = relX - cardCenterX;
            const maxDist = 350;

            if (Math.abs(dist) < maxDist) {
              const power = Math.pow(1 - Math.abs(dist) / maxDist, 2) * 45;
              const direction = dist > 0 ? -1 : 1;

              gsap.to(card, {
                x: direction * power,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              gsap.to(card, {
                x: 0,
                duration: 1.0,
                ease: "elastic.out(1, 0.7)",
                overwrite: "auto",
              });
            }
          });
        };

        const handleMouseLeave = () => {
          gsap.to(cards, {
            x: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
          });
        };

        const wrapper = cardsWrapper.current;
        if (wrapper) {
          wrapper.addEventListener("mousemove", handleMouseMove);
          wrapper.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
          if (wrapper) {
            wrapper.removeEventListener("mousemove", handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);
          }
        };
      });

      return () => mm.revert();
    },
    { scope: workContainer }
  );

  return (
    <section
      {...props}
      id="work"
      ref={workContainer}
      className={`relative min-h-screen transition-colors duration-500 pb-24 overflow-hidden ${
        props.className || ""
      } ${theme === "light" ? "bg-white" : "bg-brand-yellow"}`}
    >
      <Header variant="work" triggerRef={workContainer} />

      <div className="w-full h-full flex flex-col items-center pt-32 px-6 md:px-10">
        <div className="relative z-20 flex flex-col items-center">
          <span className="block text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-2">
            work
          </span>
          <h3
            className={`mt-0 font-main font-black text-[clamp(2rem,6vw,3.125rem)] leading-[1.1] lowercase text-center max-w-4xl transition-colors duration-500 ${
              theme === "light" ? "text-brand-orange" : "text-white"
            }`}
          >
            concepts are written on paper. visualised through code.
          </h3>
        </div>

        {/* 4 Cards: Visible ONLY on >= 1200px */}
        <div
          ref={cardsWrapper}
          className="w-full max-w-7xl mt-40 hidden min-[1200px]:flex flex-wrap justify-center gap-6 lg:gap-10 relative z-10"
        >
          <ProjectCard
            categoryKey="figma"
            activeCard={activeCard}
            title="figma projects"
            logo={<FigmaLogo />}
            bgColor="bg-white"
            textColor="text-black"
            rotation="rotate-[-4deg]"
            projects={CATEGORIES.figma}
            onProjectClick={handleProjectSelect}
          />
          <ProjectCard
            categoryKey="nextjs"
            activeCard={activeCard}
            title="nextjs projects"
            logo={<NextLogo />}
            bgColor="bg-black"
            rotation="rotate-[2deg]"
            projects={CATEGORIES.nextjs}
            onProjectClick={handleProjectSelect}
          />
          <ProjectCard
            categoryKey="react"
            activeCard={activeCard}
            title="react projects"
            logo={<ReactLogo />}
            bgColor="bg-brand-blue"
            rotation="rotate-[-1deg]"
            projects={CATEGORIES.react}
            onProjectClick={handleProjectSelect}
          />
          <ProjectCard
            categoryKey="playground"
            activeCard={activeCard}
            title="playground"
            bgColor="bg-brand-orange"
            rotation="rotate-[3deg]"
            projects={CATEGORIES.playground}
            onProjectClick={handleProjectSelect}
          />
        </div>

        <div className="w-full mt-20">{children}</div>
      </div>
    </section>
  );
};

export default WorkPage;
