import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'bid-buddy.25f66a78c7bdcd576a1f339d90102887.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ Google аватари (OAuth)
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // ✅ GitHub аватари
      },
    ],
  },
};

export default nextConfig;
