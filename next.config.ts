import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   // @ts-ignore // Next.js experimental settings
  //   allowedDevOrigins: [
  //     'http://localhost:3000',
  //     'http://192.168.1.69:3000', // твій локальний IP
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'bid-buddy.25f66a78c7bdcd576a1f339d90102887.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
