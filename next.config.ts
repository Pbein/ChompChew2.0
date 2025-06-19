import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/private/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bqewvjvnglwatlrnogvh.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/recipe-images/**',
      },
    ],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
