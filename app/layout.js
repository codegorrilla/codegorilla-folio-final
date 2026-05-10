import localFont from "next/font/local";
import { Erica_One } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
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
      className={`${satoshiVariable.variable} ${ericaOne.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-orange">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
