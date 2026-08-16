"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import gorrillaFace from "@/assets/monkey/monkey-face.png";
import gorrillaLeftEye from "@/assets/monkey/monkey-left-eye.png";
import gorrillaRightEye from "@/assets/monkey/monkey-right-eye.png";
import GorrillaMouth from "@/components/anim/GorrillaMouth";

const gorrillaFig = {
  gorrillaFace,
  gorrillaLeftEye,
  gorrillaRightEye,
};

// Gorilla face animation
export const Gorrilla = () => {
  const faceTrackerRef = useRef(null);
  const faceRef = useRef(null);
  const eyesRef = useRef(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileTilt, setIsMobileTilt] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1200px)");
    const mobileMq = window.matchMedia("(max-width: 991px)");

    const updateMatches = () => {
      setIsDesktop(desktopMq.matches);
      setIsMobileTilt(mobileMq.matches);
    };

    // Set initial values
    const timeoutId = setTimeout(updateMatches, 0);

    desktopMq.addEventListener("change", updateMatches);
    mobileMq.addEventListener("change", updateMatches);

    return () => {
      desktopMq.removeEventListener("change", updateMatches);
      mobileMq.removeEventListener("change", updateMatches);
      clearTimeout(timeoutId);
    };
  }, []);

  useGSAP(
    () => {
      // Scaling up the face on first load
      const faceEl = faceRef.current;
      if (!faceEl) return;

      gsap.fromTo(
        faceEl,
        { scale: 0 },
        {
          scale: 1,
          duration: 1.3,
          delay: 3.0,
          ease: "elastic.out(1, 0.4)",
          transformOrigin: "center",
        },
      );
    },
    { scope: faceTrackerRef },
  );

  // Desktop Mouse Movement Tracking (>= 1200px)
  useGSAP(
    () => {
      if (!isDesktop) return;

      const wrapper = faceTrackerRef.current;
      const gorrillaFace = faceRef.current;
      const gorrillaEyes = eyesRef.current;

      if (!wrapper || !gorrillaFace || !gorrillaEyes) return;

      const figMoveEvent = (e) => {
        const wrapperRect = wrapper.getBoundingClientRect();

        // Distance from center of the face
        const relX = e.clientX - (wrapperRect.left + wrapperRect.width / 2);
        const relY = e.clientY - (wrapperRect.top + wrapperRect.height / 2);

        // Calculate 3D Rotations (tilt face towards cursor)
        const maxRotate = 25; // max 25 degrees tilt
        const rotateY = (relX / (window.innerWidth / 2)) * maxRotate;
        const rotateX = -(relY / (window.innerHeight / 2)) * maxRotate;

        // Calculate subtle position shifting
        const maxMove = 30;
        const moveX = (relX / (window.innerWidth / 2)) * maxMove;
        const moveY = (relY / (window.innerHeight / 2)) * maxMove;

        // Restrict eye movement drastically
        const maxEyeMove = 12;
        const eyeMoveX = (relX / (window.innerWidth / 2)) * maxEyeMove;
        const eyeMoveY = (relY / (window.innerHeight / 2)) * maxEyeMove;

        gsap.to(gorrillaFace, {
          x: moveX,
          y: moveY,
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 800,
          transformOrigin: "center center",
          ease: "power3.out",
          duration: 0.5,
          overwrite: "auto",
        });

        gsap.to(gorrillaEyes, {
          x: eyeMoveX,
          y: eyeMoveY,
          ease: "power3.out",
          duration: 0.5,
          overwrite: "auto",
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
          overwrite: "auto",
        });
        gsap.to(gorrillaEyes, {
          x: 0,
          y: 0,
          ease: "power3.out",
          duration: 1,
          overwrite: "auto",
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

  // Phone Screen Tilt Effect (< 992px)
  useGSAP(
    () => {
      if (!isMobileTilt) return;

      const gorrillaFace = faceRef.current;
      const gorrillaEyes = eyesRef.current;

      if (!gorrillaFace || !gorrillaEyes) return;

      const handleOrientation = (e) => {
        if (e.gamma === null || e.gamma === undefined) return;

        // gamma is left-to-right tilt (-90 to +90 degrees)
        // Clamp to [-45, 45] for responsive range
        const gamma = Math.max(-45, Math.min(45, e.gamma));

        const maxRotateZ = 22; // max 22 deg rotation
        const rotateZ = (gamma / 45) * maxRotateZ;
        const rotateY = (gamma / 45) * 18;

        const maxMoveX = 25; // 25px horizontal shift
        const moveX = (gamma / 45) * maxMoveX;

        const maxEyeMoveX = 8;
        const eyeMoveX = (gamma / 45) * maxEyeMoveX;

        gsap.to(gorrillaFace, {
          x: moveX,
          rotateZ: rotateZ,
          rotateY: rotateY,
          transformPerspective: 600,
          transformOrigin: "center center",
          ease: "power2.out",
          duration: 0.35,
          overwrite: "auto",
        });

        gsap.to(gorrillaEyes, {
          x: eyeMoveX,
          ease: "power2.out",
          duration: 0.35,
          overwrite: "auto",
        });
      };

      // Request iOS permission if needed on touch
      const requestPermissionAndListen = () => {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          DeviceOrientationEvent.requestPermission()
            .then((permissionState) => {
              if (permissionState === "granted") {
                window.addEventListener("deviceorientation", handleOrientation);
              }
            })
            .catch(() => {});
        }
      };

      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("touchstart", requestPermissionAndListen, { once: true });

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
        window.removeEventListener("touchstart", requestPermissionAndListen);
        gsap.to(gorrillaFace, {
          x: 0,
          rotateZ: 0,
          rotateY: 0,
          duration: 0.5,
        });
        gsap.to(gorrillaEyes, {
          x: 0,
          duration: 0.5,
        });
      };
    },
    { scope: faceTrackerRef, dependencies: [isMobileTilt] },
  );

  return (
    <div
      className="w-full h-full absolute inset-0 flex flex-col justify-center items-center text-center tracker z-0 pointer-events-none"
      ref={faceTrackerRef}
    >
      {/* Responsive wrapper that scales down proportionally with viewport width */}
      <div ref={faceRef} className="relative w-[clamp(180px,36vw,520px)] max-w-[85vw] face">
        <Image
          src={gorrillaFig.gorrillaFace}
          className="w-full h-auto object-contain"
          alt="CodeGorrilla"
          priority
        />

        {/* Eyes positioned and sized using percentages */}
        <div ref={eyesRef} className="eyes absolute inset-0">
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

export default Gorrilla;
