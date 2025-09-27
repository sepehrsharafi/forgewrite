import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  async rewrites() {
    return [
      {
        source: "/sanity/:path*",
        destination: "https://j3q2pg7j.api.sanity.io/:path*",
      },
    ];
  },
};

export default nextConfig;
