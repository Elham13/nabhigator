/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/navigator-admin",
  rewrites() {
    return [
      { source: "/navigator-admin/_next/:path*", destination: "/_next/:path*" },
    ];
  },
};

export default nextConfig;
