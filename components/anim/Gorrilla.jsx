"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import gorrillaFace from "../../assets/monkey/monkey-face.png";
import gorrillaLeftEye from "../../assets/monkey/monkey-left-eye.png";
import gorrillaRightEye from "../../assets/monkey/monkey-right-eye.png";
import GorrillaMouth from "./GorrillaMouth";

const gorrillaFig = {
  gorrillaFace,
  gorrillaLeftEye,
  gorrillaRightEye,
};

//gorilla face animation
export const Gorrilla = () => {
  const faceTrackerRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");

    // Set initial value
    setIsDesktop(mediaQuery.matches);

    // Handle window resize
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      //scaling up the face on first load
      const faceEl = faceTrackerRef.current.querySelector(".face");
      gsap.fromTo(
        faceEl,
        { scale: 0 },
        {
          scale: 1,
          duration: 1.3,
          delay: 0.2,
          ease: "elastic.out(1, 0.4)",
          transformOrigin: "center",
        },
      );
    },
    { scope: faceTrackerRef },
  );

  useGSAP(
    () => {
      if (!isDesktop) return;

      const wrapper = document.querySelector(".tracker");
      const gorrillaFace = document.querySelector(".face");
      const gorrillaEyes = document.querySelector(".eyes");

      const figMoveEvent = (e) => {
        const wrapperRect = wrapper.getBoundingClientRect();

        // Distance from center of the face
        const relX = e.clientX - (wrapperRect.left + wrapperRect.width / 2);
        const relY = e.clientY - (wrapperRect.top + wrapperRect.height / 2);

        // Calculate 3D Rotations (tilt face towards cursor)
        const maxRotate = 25; // max 25 degrees tilt
        // Map distance to rotation. Divide by screen dimensions to normalize.
        const rotateY = (relX / (window.innerWidth / 2)) * maxRotate;
        // Negative relY because moving mouse DOWN (positive Y) should tilt DOWN (negative rotateX)
        const rotateX = -(relY / (window.innerHeight / 2)) * maxRotate;

        // Calculate subtle position shifting
        const maxMove = 30;
        const moveX = (relX / (window.innerWidth / 2)) * maxMove;
        const moveY = (relY / (window.innerHeight / 2)) * maxMove;

        // Restrict eye movement drastically so they stay in their sockets!
        const maxEyeMove = 12; // 12px max movement relative to face
        const eyeMoveX = (relX / (window.innerWidth / 2)) * maxEyeMove;
        const eyeMoveY = (relY / (window.innerHeight / 2)) * maxEyeMove;

        // Animate the entire face (including eyes)
        gsap.to(gorrillaFace, {
          x: moveX,
          y: moveY,
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 800,
          transformOrigin: "center center",
          ease: "power3.out",
          duration: 0.5,
        });

        // Animate just the eyes for parallax tracking
        gsap.to(gorrillaEyes, {
          x: eyeMoveX,
          y: eyeMoveY,
          ease: "power3.out",
          duration: 0.5,
        });
      };

      const figLeaveEvent = () => {
        gsap.to(gorrillaFace, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          ease: "power3.out",
          duration: 1,
        });
        gsap.to(gorrillaEyes, {
          x: 0,
          y: 0,
          ease: "power3.out",
          duration: 1,
        });
      };

      window.addEventListener("mousemove", figMoveEvent);
      window.addEventListener("mouseleave", figLeaveEvent);

      return () => {
        window.removeEventListener("mousemove", figMoveEvent);
        window.removeEventListener("mouseleave", figLeaveEvent);
      };
    },
    { scope: faceTrackerRef, dependencies: [isDesktop] },
  );

  return (
    <div
      className="w-full h-full absolute inset-y-[-280px] lg:inset-y-[-120px] transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 flex flex-col justify-center items-center text-center tracker z-0 pointer-events-none origin-bottom landscape:origin-center"
      ref={faceTrackerRef}
    >
      {/* Responsive wrapper that matches the exact dimensions of the scaling face */}
      <div className="relative w-[clamp(250px,35vw,550px)] face">
        {/* Face dictates the height of the wrapper */}
        <Image
          src={gorrillaFig.gorrillaFace}
          className="w-full h-auto object-contain"
          alt="CodeGorrilla"
          priority
        />

        {/* Eyes positioned and sized using percentages so they scale perfectly with the face! 
            Adjust the top-[%] and left-[%]/right-[%] values to align them perfectly. */}
        <div className="eyes absolute inset-0">
          <Image
            src={gorrillaFig.gorrillaLeftEye}
            className="absolute w-[14.75%] h-auto top-[36%] left-[30%] left-eye"
            alt="left-eye"
          />
          <Image
            src={gorrillaFig.gorrillaRightEye}
            className="absolute w-[14.9%] h-auto top-[39%] right-[37%] right-eye"
            alt="right-eye"
          />
        </div>
        <GorrillaMouth />
      </div>
    </div>
  );
};
