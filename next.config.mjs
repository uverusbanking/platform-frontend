<<<<<<<< HEAD:next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`, // Proxy to Cloud API
      },
    ];
  },
};

export default nextConfig;
========
// This file is deprecated. Please use next.config.mjs
export default {};
>>>>>>>> 65101d0 (fix: resolve next.config.ts jest conflict and react 19 label type errors):next.config.ts
