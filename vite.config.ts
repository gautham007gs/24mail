
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
      dedupe: ["react", "react-dom"],
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
    },

    root: path.resolve(__dirname, "client"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      minify: "esbuild",
      sourcemap: false,
      target: "esnext",
      cssCodeSplit: true,
      cssMinify: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 400,
      modulePreload: {
        polyfill: true,
      },

      rollupOptions: {
        output: {
          format: "es",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // Core React bundle
              if (id.includes("react/") || id.includes("react-dom/")) {
                return "react-core";
              }
              // Radix UI components
              if (id.includes("@radix-ui/react-toast")) return "radix-toast";
              if (id.includes("@radix-ui/react-tooltip")) return "radix-tooltip";
              if (id.includes("@radix-ui/react-dialog")) return "radix-dialog";
              if (id.includes("@radix-ui/react-select")) return "radix-select";
              if (id.includes("@radix-ui")) return "radix-ui";
              // TanStack Query
              if (id.includes("@tanstack/react-query")) return "react-query";
              // Router
              if (id.includes("wouter")) return "router";
              // QR Code (lazy loaded)
              if (id.includes("react-qr-code")) return "qr-code";
              // Icons (should be tree-shaken now)
              if (id.includes("lucide-react")) return "icons";
              // Other utilities
              if (id.includes("date-fns")) return "date-utils";
              if (id.includes("canvas-confetti")) return "confetti";
              // Remaining vendor code
              return "vendor";
            }
            // Split UI components
            if (id.includes("/components/ui/")) {
              const match = id.match(/\/components\/ui\/([^/]+)\.tsx?/);
              if (match) {
                return `ui-${match[1]}`;
              }
            }
          },
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
          preserveModules: false,
          hoistTransitiveImports: false,
        },
        treeshake: {
          moduleSideEffects: true,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
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
