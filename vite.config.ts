import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  const plugins = [react()];

  // Only load replit plugins IN DEV
  if (process.env.NODE_ENV !== "production") {
    const runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default;
    plugins.push(runtimeErrorOverlay());

    if (process.env.REPL_ID) {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      const { devBanner } = await import("@replit/vite-plugin-dev-banner");
      plugins.push(cartographer(), devBanner());
    }
  }

  return {
    plugins,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    root: path.resolve(__dirname, "client"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      minify: "esbuild",
      sourcemap: false,
      target: "esnext",
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
      chunkSizeWarningLimit: 500,

      rollupOptions: {
        output: {
          format: "es",
          manualChunks(id) {
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
      },
    },

    server: {
      fs: {
        strict: false,
      },
    },
  };
});