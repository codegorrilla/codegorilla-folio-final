"use client";
import React, { useRef } from "react";
import { useTheme } from "@/hooks/useTheme";

const FooterPage = ({ children, ...props }) => {
  const { theme } = useTheme();
  const footerContainer = useRef(null);

  return (
    <footer
      {...props}
      ref={footerContainer}
      className={`fixed bottom-0 left-0 w-full h-screen -z-10 transition-colors duration-500 ${
        props.className || ""
      } ${theme === "light" ? "bg-white" : "bg-brand-blue"}`}
    >
      <div className="w-full h-full flex flex-col items-center pt-32 px-10">
        <span className="block text-sm font-semibold tracking-[0.25em] uppercase text-brand-orange mb-2">
          footer
        </span>

        <div className="w-full mt-20">{children}</div>
      </div>
    </footer>
  );
};

export default FooterPage;
