import { Router } from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

router.use((req, res, next) => { console.log("UPLOAD ROUTE HIT:", req.method, req.url); next(); });
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Supabase configuration missing" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `reviews/${fileName}`;

    const { data, error } = await supabase.storage
      .from("guest-reviews")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      req.log.error({ error, filePath, fileName }, "Supabase upload error");
      return res.status(500).json({ error: `Storage error: ${error.message}` });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("guest-reviews")
      .getPublicUrl(filePath);

    return res.json({ url: publicUrl });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
