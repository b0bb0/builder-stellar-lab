import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Dynamically import to avoid issues during config loading
      import("./server/index.js")
        .then(({ createExpressServer }) => {
          const app = createExpressServer();
          // Add Express app as middleware to Vite dev server
          server.middlewares.use(app);
        })
        .catch((error) => {
          console.error("Failed to load Express server:", error);
          // Fallback - serve a simple health check
          server.middlewares.use("/api", (req, res, next) => {
            if (req.url === "/health") {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  status: "ok",
                  error: "Express server not loaded",
                }),
              );
            } else {
              next();
            }
          });
        });
    },
  };
}
