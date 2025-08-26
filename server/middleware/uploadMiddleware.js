
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";

// CORS Configuration
export const corsMiddleware = cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:8000", "https://yourdomain.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: false,
});

// JSON Parser with Limit
export const jsonParser = express.json({ limit: "50mb" });

// Cookie Parser
export const cookieParserMiddleware = cookieParser();

// Multer Configuration for File Uploads
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("InvalidFileType"));
  },
});


