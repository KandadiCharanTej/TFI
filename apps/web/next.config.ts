import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@tfi/config", "@tfi/content", "@tfi/game-core"],
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
