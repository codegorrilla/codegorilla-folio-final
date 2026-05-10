import React from "react";
import SvgIcon from "./SvgIcon";
import { useTheme } from "@/hooks/useTheme";

/**
 * TOOLKIT — structured config per icon.
 * Each entry drives: src path, hover label, and cursor brand color.
 * Brand colors sourced from official brand guidelines.
 */
const TOOLKIT = [
  // ── Front-end ──────────────────────────────────────────────────────────
  {
    group: "front-end",
    icons: [
      {
        key: "react",
        src: "/toolkit_icons/mdi_react.svg",
        label: "React",
        color: "#61DAFB",
      },
      {
        key: "nextjs",
        src: "/toolkit_icons/akar-icons_nextjs-fill.svg",
        label: "Next.js",
        color: "#ffffff",
      },
      {
        key: "tailwind",
        src: "/toolkit_icons/teenyicons_tailwind-solid.svg",
        label: "Tailwind CSS",
        color: "#06B6D4",
      },
      {
        key: "typescript",
        src: "/toolkit_icons/akar-icons_typescript-fill.svg",
        label: "TypeScript",
        color: "#3178C6",
      },
    ],
  },
  // ── Back-end ───────────────────────────────────────────────────────────
  {
    group: "back-end",
    icons: [
      {
        key: "nodejs",
        src: "/toolkit_icons/akar-icons_node-fill.svg",
        label: "Node.js",
        color: "#539E43",
      },
      {
        key: "express",
        src: "/toolkit_icons/skill-icons_expressjs-dark.svg",
        label: "Express",
        color: "#ffffff",
      },
      {
        key: "mongo",
        src: "/toolkit_icons/flowbite_mongo-db-solid.svg",
        label: "MongoDB",
        color: "#47A248",
      },
    ],
  },
  // ── Tooling ────────────────────────────────────────────────────────────
  {
    group: "utilities",
    icons: [
      {
        key: "npm",
        src: "/toolkit_icons/iconoir_npm.svg",
        label: "npm",
        color: "#CB3837",
      },
      {
        key: "bun",
        src: "/toolkit_icons/simple-icons_bun.svg",
        label: "Bun",
        color: "#F9C400",
      },
      {
        key: "git",
        src: "/toolkit_icons/mdi_git.svg",
        label: "Git",
        color: "#F05032",
      },
      {
        key: "gitlab",
        src: "/toolkit_icons/ri_gitlab-fill.svg",
        label: "GitLab",
        color: "#FC6D26",
      },
      {
        key: "turtle",
        src: "/toolkit_icons/file-icons_tortoisesvn.svg",
        label: "TortoiseSVN",
        color: "#5C8DBC",
      },
    ],
  },
  // ── AI ─────────────────────────────────────────────────────────────────
  {
    group: "agentic workflow",
    icons: [
      {
        key: "codex",
        src: "/toolkit_icons/mingcute_openai-fill.svg",
        label: "Codex / ChatGPT",
        color: "#10a37f",
      },
      {
        key: "antigravity",
        src: "/toolkit_icons/material-symbols_antigravity.svg",
        label: "Antigravity",
        color: "#f0493a",
      },
      {
        key: "gemini",
        src: "/toolkit_icons/ri_gemini-fill.svg",
        label: "Gemini",
        color: "#8B5CF6",
      },
    ],
  },
];

const Toolkit = () => {
  const { theme } = useTheme();

  return (
    <div>
      <div className="h-full w-full relative">
        <h2 className="mt-10 font-main font-black text-brand-yellow text-[3.125rem] lowercase text-right">
          my toolkit
        </h2>

        <ul className="flex flex-col gap-6 w-full mt-10">
          {TOOLKIT.map(({ group, icons }, index) => (
            <li key={group} className="flex flex-row items-center gap-6">
              <h4
                className={`font-main font-medium text-[1.5rem] capitalize min-w-[110px] shrink-0 ${
                  index % 2 === 0 ? "text-brand-yellow" : "text-brand-orange"
                }`}
              >
                {group}
              </h4>

              {/* Typographic slash separator */}
              <span
                className={`font-main text-[1.5rem] transition-colors select-none ${
                  theme === "light" ? "text-black/10" : "text-white/25"
                }`}
              >
                /
              </span>

              <div className="flex items-center gap-6 shrink-0">
                {icons.map(({ key, src, label, color }) => (
                  <SvgIcon
                    key={key}
                    src={src}
                    size={36}
                    data-label={label}
                    data-cursor-color={color}
                    className={`cursor-none transition-all duration-200 hover:opacity-70 ${
                      theme === "light" ? "invert" : ""
                    }`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Toolkit;
