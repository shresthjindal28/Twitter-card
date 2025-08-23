import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
  },
  images: {
    domains: ['pbs.twimg.com'],
  },
};

export default nextConfig;
