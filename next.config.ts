import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'www.datocms-assets.com' }],
  },
  // Handle external packages that have dynamic requires
  serverExternalPackages: ['@datocms/cma-client-node'],
};

export default nextConfig;
