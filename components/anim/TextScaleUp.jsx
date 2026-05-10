"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const TextScaleUp = ({ children }) => {
  const scaleUpRef = useRef(null);
  useGSAP(() => {
    gsap.fromTo(
      scaleUpRef.current,
      { scale: 0 },
      { scale: 1, duration: 1.5, delay: 3.0, ease: "elastic.out(1, 0.4)", transformOrigin: "center" }
    );
  }, []);
  return <span ref={scaleUpRef} className="inline-block origin-center">{children}</span>;
};
