import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [ "res.cloudinary.com" ],
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ This will ignore TypeScript errors during the build
  },
};

export default nextConfig;
