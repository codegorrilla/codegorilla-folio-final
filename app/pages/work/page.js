"use client";
import React, { useRef } from "react";
import Header from "@/components/anim/Header";
import { useTheme } from "@/hooks/useTheme";

const WorkPage = ({ children, ...props }) => {
  const { theme } = useTheme();
  const workContainer = useRef(null);

  return (
    <section
      {...props}
      ref={workContainer}
      className={`relative min-h-screen transition-colors duration-500 ${
        props.className || ""
      } ${theme === "light" ? "bg-white" : "bg-brand-yellow"}`}
    >
      {/* Header with slide-up reveal */}
      <Header variant="work" triggerRef={workContainer} />

      <div className="w-full h-full flex flex-col items-center pt-32 px-10">
        {/* Same styling as About toolkit header, but center-aligned */}
        <h3
          className={`mt-10 font-main font-black text-[3.125rem] leading-[1.1] lowercase text-center max-w-4xl transition-colors duration-500 ${
            theme === "light" ? "text-brand-orange" : "text-white"
          }`}
        >
          concepts are written on paper. visualised through code.
        </h3>

        <div className="w-full mt-20">{children}</div>
      </div>
    </section>
  );
};

export default WorkPage;
