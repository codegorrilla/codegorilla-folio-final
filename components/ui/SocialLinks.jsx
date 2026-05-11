import SvgIcon from "./SvgIcon";
import { useTheme } from "@/hooks/useTheme";

/**
 * SOCIALS config
 * ─────────────────────────────────────────────────────────────────────────────
 * SVGs served from /public/social_icons/ (Simple Icons, monochrome white).
 * Download from: https://simpleicons.org
 */
const SOCIALS = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/codegorrilla",
    src: "/social_icons/github.svg",
    color: "#ffffff",
  },
  {
    key: "codepen",
    label: "Codepen",
    href: "https://codepen.io/apeandme",
    src: "/social_icons/codepen.svg",
    color: "#ffffff",
  },
  {
    key: "behance",
    label: "Behance",
    href: "https://www.behance.net/unit99",
    src: "/social_icons/behance.svg",
    color: "#1769FF",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/yourusername",
    src: "/social_icons/instagram.svg",
    color: "#E4405F",
  },
  {
    key: "discord",
    label: "Discord",
    href: "https://discord.com/users/yourusername",
    src: "/social_icons/discord.svg",
    color: "#5865F2",
  },
  {
    key: "gmail",
    label: "Gmail",
    href: "mailto:code.gorrilla@gmail.com",
    src: "/social_icons/gmail.svg",
    color: "#EA4335",
  },
];

const SocialLinks = () => {
  const { theme } = useTheme();

  return (
    <ul className="flex items-center gap-5" aria-label="Social links">
      {SOCIALS.map(({ key, label, href, src, color }) => (
        <li key={key}>
          <a
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={label}
            // Custom cursor: show label pill in the platform's brand color
            data-label={label}
            data-cursor-color={color}
            className="
              group block
              opacity-40 hover:opacity-100
              transition-opacity duration-300 ease-out
              cursor-none
            "
          >
            <SvgIcon
              src={src}
              size={28}
              className={`
                block
                group-hover:scale-110
                transition-all duration-300 ease-out
                ${theme === "light" ? "brightness-0" : "brightness-0 invert"}
              `}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;
