
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        process.cwd(),
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve precompressed assets when available (Brotli or gzip) to reduce bytes over the wire.
  app.use((req, res, next) => {
    // Only attempt for static asset requests
    if (!req.path.match(/\.(js|css|json|wasm|svg|png|jpg|jpeg|gif|webp|avif|woff2?|map)$/i)) return next();

    const accept = (req.headers['accept-encoding'] || '') as string;
    const filePath = path.join(distPath, req.path.replace(/^\//, ''));

    try {
      // prefer Brotli
      if (accept.includes('br') && fs.existsSync(filePath + '.br')) {
        res.set('Content-Encoding', 'br');
        res.set('Vary', 'Accept-Encoding');
        const ext = path.extname(filePath) || '';
        if (ext) res.type(ext);
        return res.sendFile(filePath + '.br');
      }

      // fallback to gzip
      if (accept.includes('gzip') && fs.existsSync(filePath + '.gz')) {
        res.set('Content-Encoding', 'gzip');
        res.set('Vary', 'Accept-Encoding');
        const ext = path.extname(filePath) || '';
        if (ext) res.type(ext);
        return res.sendFile(filePath + '.gz');
      }
    } catch (err) {
      // ignore and let express static handle the file
      // eslint-disable-next-line no-console
      console.warn('precompressed middleware error', err?.message || err);
    }

    return next();
  });

  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }));

  // SPA fallback
  app.use('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}
