"use client";
import React, { useRef } from "react";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { VerticalMarquee } from "@/components/anim/VerticalMarquee";
import { TextScaleUp } from "@/components/anim/TextScaleUp";
import Header from "@/components/anim/Header";

const HeroPage = ({ ...props }) => {
  const heroContainer = useRef(null);

  return (
    <section {...props} ref={heroContainer} className={`${props.className || ""} w-full max-w-full overflow-hidden`}>
      <Header variant="hero" triggerRef={heroContainer} />
      <article className="w-full max-w-full flex flex-col justify-center items-center font-accent text-white text-center uppercase lg-text-trigger leading-[0.75]">
        {/* Vertical Marquee Section */}
        <VerticalMarquee speed={15} />

        <div className="m-0 p-0 text-[clamp(2.5rem,14vw,350px)]">
          <TextScaleUp>code</TextScaleUp>
        </div>
        <MaskReveal />
      </article>
    </section>
  );
};

export default HeroPage;
