"use client";
import React, { useRef } from "react";
import Header from "@/components/anim/Header";

const AboutPage = ({ children, ...props }) => {
  const aboutContainer = useRef(null);

  return (
    <section id="about-section" ref={aboutContainer} {...props}>
      <Header variant="about" triggerRef={aboutContainer} />
      {children}
    </section>
  );
};

export default AboutPage;
