import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ✅ Cloudinary для твоїх айтемів
        pathname: '/**', // всі шляхи
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google аватари
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub аватари
      },
      {
        protocol: 'https',
        hostname:
          'bid-buddy.25f66a78c7bdcd576a1f339d90102887.r2.cloudflarestorage.com', // інші зображення
      },
    ],
  },
};

export default nextConfig;

