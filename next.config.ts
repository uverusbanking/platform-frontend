import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    // This property is used to configure external image domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: You can specify a port if needed, but usually not for Cloudinary
        // port: '',
        // Optional: You can specify a pathname if you only want to allow images from a specific path prefix
        // pathname: '/image/upload/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // Proxy to Cloud API
      },
    ];
  },
};

export default nextConfig;
