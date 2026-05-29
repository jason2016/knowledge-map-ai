import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev-mode on-screen indicator (the black "N" badge in the
  // bottom-left during `npm run dev`). Build/runtime errors are still surfaced.
  devIndicators: false,
  // react-force-graph-3d (WebGL) breaks under StrictMode's dev double-mount
  // ("Cannot read properties of undefined (reading 'tick')"). Disable it.
  reactStrictMode: false,
};

export default nextConfig;
