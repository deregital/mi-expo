import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mi Expo',
    short_name: 'mi_expo',
    description: 'Mi expo',
    start_url: '/?source=pwa',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/next.svg',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
