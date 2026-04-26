import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
      // Udemy CDN thumbnails
      { protocol: "https", hostname: "img-c.udemycdn.com" },
      { protocol: "https", hostname: "img.udemycdn.com" },
      // Coursera thumbnails
      { protocol: "https", hostname: "**.coursera.org" },
      // YouTube thumbnails
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
