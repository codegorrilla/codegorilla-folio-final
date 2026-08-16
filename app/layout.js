import localFont from "next/font/local";
import { Erica_One } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import VerticalCurtainTransition from "@/components/anim/VerticalCurtainTransition";
import { ThemeProvider } from "@/provider/ThemeProvider";

const ericaOne = Erica_One({
  weight: ["400"], // Must specify weights for non-variable fonts
  subsets: ["latin"],
  variable: "--font-erica",
  display: "swap",
});

const satoshiVariable = localFont({
  src: "../public/fonts/Satoshi-Variable.woff2",
  style: "normal",
  variable: "--font-satoshi",
  display: "swap",
});

import "./globals.css";

export const metadata = {
  title: "CodeGorrilla",
  description: "developer portfolio for CodeGorrilla",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshiVariable.variable} ${ericaOne.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#141518]"
      >
        {/*
          Anti-FOUC script: runs synchronously before any HTML is painted.
          Reads sessionStorage and sets --curtain-y so the curtain covers the
          screen before React hydrates. Pattern from next-themes.
        */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('curtain-transition')) {
                  document.documentElement.style.setProperty('--curtain-y', '0%');
                } else {
                  document.documentElement.style.setProperty('--curtain-y', '100%');
                }
              } catch(e) {
                document.documentElement.style.setProperty('--curtain-y', '100%');
              }
            `,
          }}
        />
        <ThemeProvider>
          <CustomCursor />
          <VerticalCurtainTransition />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
