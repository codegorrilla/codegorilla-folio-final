// components/Header.jsx
"use client";
import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header = () => {
  const headerRef = useRef(null);

  useGSAP(() => {
    // Instantly appear exactly when the preloader unmounts (at 3.7s)
    gsap.set(headerRef.current, { opacity: 1, delay: 3.7 });
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      className="w-full absolute z-20 flex justify-center lg:justify-end items-center ml-auto p-10 font-main font-black text-white text-[2.5rem] tracking-tighter opacity-0"
    >
      <Link id="header-logo" href="/" className="inline-block lowercase leading-none">
        code.gorrilla
      </Link>
    </header>
  );
};

export default Header;
