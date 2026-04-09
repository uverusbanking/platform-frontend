/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure we can use the root node_modules if needed, though Next.js handles this well in standalone mode
  experimental: {
    outputFileTracingRoot: '../',
  },
};

export default nextConfig;
