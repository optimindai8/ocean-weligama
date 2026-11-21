import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname, "../../"), "");
  
  const rawPort = process.env.PORT || env.PORT || "5173";
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  const basePath = process.env.BASE_PATH || env.BASE_PATH || "/";

  return {
    base: basePath,
    envDir: path.resolve(import.meta.dirname, "../../"),
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "asset-fallback-rewrite",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              // Redirect any accidental nested http(s) URLs: "/images/https://..." -> "https://..."
              const nestedHttp = req.url.match(/https?:\/\/[^\s"']+/i);
              if (nestedHttp) {
                res.writeHead(302, { Location: nestedHttp[0] });
                res.end();
                return;
              }

              // Normalize double-prefixed paths
              if (req.url.startsWith("/images/images/")) {
                req.url = req.url.replace(/^\/images\/images\//, "/images/");
              } else if (req.url.startsWith("/videos/videos/")) {
                req.url = req.url.replace(/^\/videos\/videos\//, "/videos/");
              } else {
                const url = req.url.split("?")[0] || "";
                if (url.match(/^\/[^/]+\.(mp4|webm|mov|m4v)$/i)) {
                  req.url = req.url.replace(/^\/([^/]+)/, "/videos/$1");
                } else if (url.match(/^\/[^/]+\.(jpg|jpeg|png|webp|gif|svg)$/i) && !url.includes("favicon")) {
                  req.url = req.url.replace(/^\/([^/]+)/, "/images/$1");
                }
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
        "@hotel-notifications": path.resolve(import.meta.dirname, "../../hotel-notifications/src"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        onLog(level, log, handler) {
          if (
            log.code === "SOURCEMAP_ERROR" &&
            log.message.includes("Can't resolve original location")
          ) {
            return;
          }
          handler(level, log);
        },
      },
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          xfwd: true,
        },
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          xfwd: true,
        },
      },
    },
  };
});
