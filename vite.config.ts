import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        format: "es",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("@radix-ui") || id.includes("lucide-react")) return "ui";
            if (id.includes("date-fns") || id.includes("recharts")) return "data";
            if (id.includes("react-hook-form") || id.includes("react-icons")) return "utils";
            if (id.includes("react-qr-code") || id.includes("wouter")) return "features";
            return "vendor";
          }
        },
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
      external: [],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
    // Split CSS per chunk for faster loading
    cssCodeSplit: true,
    // Only production build is minimized
    sourcemap: false,
    // Target modern browsers
    target: "esnext",
    // Inline small assets
    assetsInlineLimit: 2048,
    // Chunk size limits
    chunkSizeWarningLimit: 500,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
