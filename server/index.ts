import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Performance & Security: Add compression headers, cache control, and security headers
app.use((req, res, next) => {
  // Strict Security Headers
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "SAMEORIGIN");
  res.set("X-XSS-Protection", "1; mode=block");
  res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=()");
  res.set("X-Powered-By", "TempMail-Shield-Secure");
  
  // CORS - Only allow same origin requests
  const origin = req.headers.origin;
  if (origin && (origin.includes("localhost") || origin.includes("tempmail.org") || origin.includes("replit.dev") || origin.includes("cloudworkstations.dev"))) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  
  // Performance: Enable compression for faster transfer
  res.set("Vary", "Accept-Encoding");
  
  // CSP: Development mode allows inline scripts for React and Vite HMR
  const isDev = process.env.NODE_ENV === "development";
    if (!isDev) {
    // Production CSP - allow Vite's modulepreload `data:` and `blob:` URIs,
    // allow inline styles for critical CSS, and lock down other sources.
    const prodCSP = [
      "default-src 'self'",
      "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' data: blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.barid.site https://fonts.googleapis.com https://fonts.gstatic.com",
      "frame-ancestors 'self' https://5000-firebase-24mailnew-1764922668854.cluster-nulpgqge5rgw6rwqiydysl6ocy.cloudworkstations.dev",
    ].join('; ');

    res.set('Content-Security-Policy', prodCSP);
  }
  
  // Set cache headers for blog and static content - SEO friendly
  if (req.path.startsWith("/blog") || req.path === "/" || req.path.startsWith("/success") || req.path.startsWith("/terms") || req.path.startsWith("/privacy") || req.path.startsWith("/browser") || req.path.startsWith("/referral")) {
    res.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  }
  // API responses cached briefly for consistency
  else if (req.path.startsWith("/api")) {
    res.set("Cache-Control", "public, max-age=10, s-maxage=10");
  }
  // Static assets cached longer
  else if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|json)$/i)) {
    res.set("Cache-Control", "public, max-age=31536000, immutable");
  }
  
  // Handle OPTIONS for CORS preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 5000 if not specified. If the port is in use, attempt a few
  // higher ports instead of crashing with an unhandled exception.
  const desiredPort = parseInt(process.env.PORT || '5000', 10);
  let port = desiredPort;
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (err: any) => reject(err);
        server.once('error', onError);

        server.listen({ port, host: '0.0.0.0' }, () => {
          server.removeListener('error', onError);
          log(`Server listening on port ${port}`);
          resolve();
        });
      });
      // Successfully bound the port
      break;
    } catch (err: any) {
      // If port is in use, try next port. Otherwise rethrow.
      const code = err && err.code;
      if (code === 'EADDRINUSE' || code === 'EACCES') {
        log(`Port ${port} unavailable (${code}). Trying port ${port + 1}...`);
        port += 1;
        if (attempt === maxAttempts - 1) {
          throw new Error(`Could not bind to a port after ${maxAttempts} attempts: ${err?.message || err}`);
        }
        // small delay before retrying
        await new Promise((r) => setTimeout(r, 150));
        continue;
      }

      throw err;
    }
  }
})();
