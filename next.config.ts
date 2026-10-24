import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  typescript: {
    // Fail production builds on TypeScript errors (Next.js default; explicit for clarity).
    ignoreBuildErrors: false,
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
