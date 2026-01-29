import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/resume",
        destination: "https://resume-nextjs-4e97.vercel.app",
      },
      {
        source: "/resume/:path*",
        destination: "https://resume-nextjs-4e97.vercel.app/:path*",
      },
      // Shortcut for Toss resume
      {
        source: "/toss",
        destination: "https://resume-nextjs-4e97.vercel.app/toss",
      },
    ];
  },
};

export default nextConfig;
