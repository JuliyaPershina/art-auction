import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore // Next.js experimental settings
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://192.168.1.69:3000', // твій локальний IP
    ],
  },
};

export default nextConfig;
