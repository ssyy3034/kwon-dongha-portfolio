import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "권동하 - Backend Engineer",
  description:
    "데이터로 병목을 찾고, 원리를 이해하여 문제를 해결하는 백엔드 엔지니어 권동하의 포트폴리오입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        {/* Grain texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[50] opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProfileProvider>{children}</ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
