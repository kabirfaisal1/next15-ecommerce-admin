import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [ "res.cloudinary.com" ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ This will ignore TypeScript errors during the build
  },
  experimental: {
    turbo: false, // ✅ This forces Next.js to use Webpack instead of Turbopack
  },
  webpack: ( config ) =>
  {
    return config;
  },
};

export default nextConfig;
