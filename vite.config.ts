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
    // Aggressive bundle optimization
    rollupOptions: {
      output: [
        {
          dir: path.resolve(import.meta.dirname, "dist/public/assets"),
          format: "es",
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes("node_modules")) {
              if (id.includes("lucide-react")) return "lucide";
              if (id.includes("@radix-ui")) return "radix";
              if (id.includes("date-fns")) return "date-fns";
              if (id.includes("recharts")) return "recharts";
              if (id.includes("react-hook-form")) return "form";
              // Default vendor chunk
              return "vendor";
            }
          },
          entryFileNames: "chunks/[name]-[hash].js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      ],
      external: [],
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps only in dev
    sourcemap: process.env.NODE_ENV === "development",
    // Target modern browsers
    target: "esnext",
    // Inline small imports
    assetsInlineLimit: 4096,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
