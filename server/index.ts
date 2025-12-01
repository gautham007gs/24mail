import express from "express";
import { createServer as createViteServer } from "vite";
import { registerRoutes } from "./routes.js";

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
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
  }

  // Fallback to index.html for SPA
  app.get("*", (req, res) => {
    res.sendFile(process.cwd() + "/client/index.html");
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[express] Server listening on port ${PORT}`);
  });
})();
