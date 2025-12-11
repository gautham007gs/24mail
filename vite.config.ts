import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [react()];

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
      dedupe: ["react", "react-dom", "wouter", "@radix-ui/react-tooltip", "@tanstack/react-query"],
    },

    optimizeDeps: {
      include: ["react", "react-dom", "wouter", "@radix-ui/react-tooltip", "@tanstack/react-query"],
      force: true,
    },

    root: path.resolve(__dirname, "client"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      minify: "terser",
      sourcemap: false,
      target: "es2020",
      cssCodeSplit: true,
      cssMinify: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 500,
      modulePreload: {
        // Only enable the modulepreload polyfill during development to
        // avoid Vite inlining a small data: module into `index.html` for
        // production builds (which can be blocked by strict CSP).
        polyfill: mode !== "production",
      },
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
          passes: 1,
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          format: "es",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // Do not emit a separate `react-core` chunk — keep React
              // inside the main vendor bundle to avoid cross-chunk
              // initialization / export timing issues in production.
              if (id.includes("@radix-ui/react-toast")) return "radix-toast";
              if (id.includes("@radix-ui/react-tooltip")) return "radix-tooltip";
              if (id.includes("@radix-ui/react-dialog")) return "radix-dialog";
              if (id.includes("@radix-ui/react-select")) return "radix-select";
              if (id.includes("@radix-ui")) return "radix-ui";
              if (id.includes("@tanstack/react-query")) return "react-query";
              if (id.includes("wouter")) return "router";
              // Keep react-qr-code with other vendor code to avoid
              // creating a separate chunk that can introduce circular
              // dependency issues during module initialization.
              // if (id.includes("react-qr-code")) return "qr-code";
              if (id.includes("lucide-react")) return "icons";
              if (id.includes("canvas-confetti")) return "confetti";
              return "vendor";
            }
            if (id.includes("/lib/blog-data")) {
              return "blog-content";
            }
            if (id.includes("/lib/blog-content-translations")) {
              return "blog-translations";
            }
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
      hmr: {
        overlay: false,
      },
    },
  };
});
