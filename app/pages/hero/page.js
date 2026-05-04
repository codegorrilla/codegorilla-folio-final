import React from "react";
import { MaskReveal } from "@/components/anim/MaskReveal";
import { VerticalMarquee } from "@/components/anim/VerticalMarquee";
import { TextScaleUp } from "@/components/TextScaleUp";

const HeroPage = ({ ...props }) => {
  return (
    <section {...props}>
      <article className="flex flex-col justify-center items-center font-accent text-white text-center uppercase lg-text-trigger leading-[0.75]">
        {/* Vertical Marquee Section */}
        <VerticalMarquee speed={15} />

        <div className="m-0 p-0 text-[clamp(3rem,21vw,350px)]">
          <TextScaleUp>code</TextScaleUp>
        </div>
        <MaskReveal />
      </article>
    </section>
  );
};

export default HeroPage;
