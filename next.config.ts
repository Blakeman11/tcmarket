// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['ejpuaoksfskxxttfawav.supabase.co'], // your Supabase bucket host
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignore lint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ignore TS errors during build
  },
};

export default nextConfig;