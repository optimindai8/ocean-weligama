import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const upload = multer({ storage: multer.memoryStorage() });
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const app: Express = express();

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", upload.single("file"), async (req, res) => {
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
});

app.use("/api", router);

export default app;
