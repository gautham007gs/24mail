import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Enable gzip compression for all responses (major performance boost)
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

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
  if (origin && (origin.includes("localhost") || origin.includes("tempmail.org") || origin.includes("replit.dev"))) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  
  // CSP: Development mode allows inline scripts for React and Vite HMR
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev) {
    // Production CSP - allows Vite's module preloads and inline handlers
    const prodCSP = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.barid.site https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none';";
    res.set("Content-Security-Policy", prodCSP);
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
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`Server listening on port ${port}`);
  });
})();
