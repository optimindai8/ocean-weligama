import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  securityHeadersMiddleware,
  publicApiRateLimiter,
  inputSanitizerMiddleware,
  outputSanitizerMiddleware,
  globalAdminGuard,
  fileSecurityGuard,
} from "./security";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const app: Express = express();

// Disable powered-by header for security obfuscation
app.disable("x-powered-by");

// Apply security headers
app.use(securityHeadersMiddleware);

// Logging middleware
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Strict CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
  })
);

// Global payload body limits to block payload bombing attacks
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Anti-scraping rate limiter for all endpoints
app.use(publicApiRateLimiter);

// Input & Output sanitizers (prevent XSS, injection, prototype pollution, sensitive data leakage)
app.use(inputSanitizerMiddleware);
app.use(outputSanitizerMiddleware);

// Fail-safe global admin guard (protects all /v1/admin/* endpoints)
app.use(globalAdminGuard);

// Secure File Upload Handler
app.use(
  ["/api/upload", "/api/v1/upload"],
  upload.single("file"),
  fileSecurityGuard,
  async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Supabase configuration missing" });
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `reviews/${fileName}`;
      const { data, error } = await supabase.storage.from("guest-reviews").upload(filePath, file.buffer, { contentType: file.mimetype });
      if (error) return res.status(500).json({ error: `Storage error: ${error.message}` });
      const { data: { publicUrl } } = supabase.storage.from("guest-reviews").getPublicUrl(filePath);
      return res.json({ url: publicUrl });
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use("/api", router);

export default app;

