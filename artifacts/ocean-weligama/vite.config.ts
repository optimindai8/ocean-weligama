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
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
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
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
