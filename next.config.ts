import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'media.ambito.com',
      },
      {
        hostname: 'resizer.glanacion.com',
      },
    ],
  },
};

export default nextConfig;
