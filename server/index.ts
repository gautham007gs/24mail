import express from "express";
import { createServer as createViteServer } from "vite";
import { registerRoutes } from "./routes.js";
import path from "path";

const app = express();

// Performance headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

// Middleware
app.use(express.json());
app.use(express.text());

// Setup routes and start server
(async () => {
  // Register API routes
  await registerRoutes(app);

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        allowedHosts: [
          '.replit.dev',
          '.repl.co',
          'localhost',
          '127.0.0.1'
        ],
        fs: {
          strict: true,
          deny: ["**/.*"],
        },
      },
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve static files from dist/public
    const publicPath = path.join(process.cwd(), "dist/public");
    
    // Serve all static files including manifest.json
    app.use(express.static(publicPath, {
      maxAge: "1d",
      etag: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.json')) {
          res.set('Content-Type', 'application/json');
        }
        if (filePath.endsWith('.js')) {
          res.set('Content-Type', 'application/javascript');
        }
        if (filePath.endsWith('.css')) {
          res.set('Content-Type', 'text/css');
        }
      }
    }));
  }

  // Fallback to index.html for SPA (only for non-API routes)
  app.get("*", (req, res) => {
    // Skip if it's an API route
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    const indexPath = process.env.NODE_ENV === "production" 
      ? path.join(process.cwd(), "dist/public/index.html")
      : path.join(process.cwd(), "client/index.html");
    
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Internal server error');
      }
    });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[express] Server listening on http://0.0.0.0:${PORT}`);
  });
})();
