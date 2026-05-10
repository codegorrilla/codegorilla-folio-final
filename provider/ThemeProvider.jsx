"use client";
import React, { useState, useEffect } from "react";
import { ThemeContext } from "@/context";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // dark is default

  useEffect(() => {
    // Sync with Tailwind class-based dark mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
