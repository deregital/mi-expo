import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'media.ambito.com',
      },
    ],
  },
};

export default nextConfig;
