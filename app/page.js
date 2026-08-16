"use client";
import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";

import StickyCards from "@/components/StickyCards";
import Preloader from "@/components/anim/Preloader";
import FloatingDock from "@/components/ui/FloatingDock";

const Home = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isWorkTarget =
        window.location.hash === "#work" ||
        window.location.search.includes("card=");

      if (!isWorkTarget) {
        window.history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
      }
    }
  }, []);

  useEffect(() => {
    if (lenis && typeof window !== "undefined") {
      const isWorkTarget =
        window.location.hash === "#work" ||
        window.location.search.includes("card=");

      if (isWorkTarget) {
        // Scroll directly to the Work section
        const scrollToWork = () => {
          const target = document.querySelector("#work");
          if (target) {
            lenis.scrollTo(target, { immediate: true, offset: 0 });
          }
        };

        scrollToWork();
        const t1 = setTimeout(scrollToWork, 60);
        const t2 = setTimeout(scrollToWork, 200);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      } else {
        // Force scroll to top immediately on fresh landing
        lenis.scrollTo(0, { immediate: true });

        const timer = setTimeout(() => {
          lenis.scrollTo(0, { immediate: true });
          window.scrollTo(0, 0);
        }, 50);

        return () => clearTimeout(timer);
      }
    }
  }, [lenis]);

  return (
    <>
      <Preloader />
      <ReactLenis root options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        syncTouch: true // Important for mobile scroll synchronization
      }} />
      <StickyCards />
      <FloatingDock />
      <footer className="w-full min-h-134.5">footer</footer>
    </>
  );
};

export default Home;
