import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

// Get repository name from environment or default to "research-article"
const repoName = process.env.GITHUB_REPOSITORY_NAME || "research-article";
const basePath = process.env.GITHUB_PAGES ? `/${repoName}/` : "/";

export default defineConfig({
  plugins: [
    ...plugins,
    // Plugin to ensure 404.html is copied to output
    {
      name: "copy-404",
      closeBundle() {
        const public404 = path.resolve(import.meta.dirname, "client", "public", "404.html");
        const out404 = path.resolve(import.meta.dirname, "docs", "404.html");
        if (fs.existsSync(public404)) {
          fs.copyFileSync(public404, out404);
        }
      },
    },
  ],
  base: basePath,
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "docs"),
    emptyOutDir: true,
    copyPublicDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
