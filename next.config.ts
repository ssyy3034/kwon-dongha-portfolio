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
    ];
  },
};

export default nextConfig;
