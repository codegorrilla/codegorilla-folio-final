// components/Header.jsx
"use client";
import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Header = ({ variant = "hero", triggerRef }) => {
  const headerRef = useRef(null);
  const logoRef = useRef(null);

  useGSAP(
    () => {
      let split;
      let handleMouseEnter;
      let handleMouseLeave;

      const initHoverEffect = () => {
        split = new SplitText(logoRef.current, { type: "chars" });
        gsap.set(logoRef.current, { perspective: 400 });

        handleMouseEnter = () => {
          gsap.to(split.chars, {
            rotationX: 360,
            duration: 1.0, // slower
            stagger: 0.04,
            ease: "back.out(1.7)", // bouncy ease
            overwrite: "auto", // stop any running animations
          });
        };

        handleMouseLeave = () => {
          gsap.to(split.chars, {
            rotationX: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        logoRef.current.addEventListener("mouseenter", handleMouseEnter);
        logoRef.current.addEventListener("mouseleave", handleMouseLeave);
      };

      if (variant === "hero") {
        // Instantly appear exactly when the preloader unmounts (at 3.7s), then initialize ScrollTrigger
        gsap.set(headerRef.current, { 
          opacity: 1, 
          delay: 3.7,
          onComplete: () => {
            // Slide up/down when scrolling away/towards the hero section
            gsap.to(headerRef.current, {
              y: -100,
              opacity: 0,
              duration: 0.6,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: document.body,
                start: "150px top", // Triggers when scrolled 150px down from the top
                toggleActions: "play none none reverse",
              },
            });
          }
        });

        // Delay SplitText until after the preloader Flip finishes to prevent bounding box shifts
        gsap.delayedCall(3.75, initHoverEffect);
      } else if (variant === "about") {
        // Slide in/out from right based on scroll direction
        const parentSection = headerRef.current.parentElement;
        const nextSection = parentSection ? parentSection.nextElementSibling : null;

        gsap.fromTo(
          headerRef.current,
          { x: 300, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: parentSection,
              start: "top 60%", // Triggers when About section enters 60% of viewport
              endTrigger: nextSection || parentSection,
              end: nextSection ? "top 50%" : "bottom 20%", // Reverses when the next section covers half the viewport
              toggleActions: "play reverse play reverse", 
            },
          },
        );

        // Initialize hover effect immediately
        initHoverEffect();
      }

      return () => {
        if (handleMouseEnter) {
          logoRef.current.removeEventListener("mouseenter", handleMouseEnter);
          logoRef.current.removeEventListener("mouseleave", handleMouseLeave);
        }
        if (split) split.revert();
      };
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="w-full absolute top-0 right-0 z-20 flex justify-center lg:justify-end items-center p-10 font-main font-black text-white text-[2.5rem] tracking-tighter opacity-0"
    >
      <Link
        id={variant === "hero" ? "header-logo" : undefined}
        href="/"
        ref={logoRef}
        className="inline-block lowercase leading-none"
        style={{ fontKerning: "none" }}
      >
        code.gorrilla
      </Link>
    </header>
  );
};

export default Header;
