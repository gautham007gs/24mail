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
      dedupe: ["react", "react-dom"],
    },

    optimizeDeps: {
      include: ["react", "react-dom"],
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
          // Let Rollup decide chunking automatically. Manual fine-grained
          // chunking produced many empty / tiny chunks in production.
          format: "es",
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
          preserveModules: false,
          hoistTransitiveImports: false,
        },
        treeshake: {
          moduleSideEffects: false,
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
