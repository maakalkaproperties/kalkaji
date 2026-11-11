import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/property-in-:citySlug",
        destination: "/locations/:citySlug",
      },
      {
        source: "/property-in-:citySlug/",
        destination: "/locations/:citySlug",
      },
    ];
  },
};

export default nextConfig;
