import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The landing page is fully static, so `next build` writes plain HTML/CSS/JS to `out/`.
  // It deploys as-is to Vercel, Netlify, Cloudflare Pages or any static host.
  // Cache Components (PPR) is not compatible with export mode, and this page has no dynamic data.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
