import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { aws_upload } from "./s3.js";
import { userRoute } from "./route/userRoute.js";
import { propertyRoute } from "./route/propertyRoute.js";
import { authRoutes } from "./route/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Validate environment variables
if (
  !process.env.AWS_REGION ||
  !process.env.S3_BUCKET_NAME ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  console.error("Missing required environment variables");
  process.exit(1);
}
const SHOW_DEBUG = process.env.NODE_ENV !== "production" || process.env.UPLOAD_DEBUG === "1";
const USE_FAKE_UPLOAD = process.env.UPLOAD_FAKE === "1"
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:8000", "https://yourdomain.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

  const upload = multer({
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

app.get("/ping", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/property", propertyRoute);

app.post("/upload_aws", upload.single("file"), async (req, res) => {
  try {
    const { filename } = req.body;
    const f = req.file;

    if (!filename || !f) {
      return res.status(400).json({ error: "Filename and file are required" });
    }
    if (!f.buffer) {
      return res.status(400).json({ error: "File buffer missing (check multer.memoryStorage)" });
    }
app.get("/list-files", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      MaxKeys: 100,
    });
    const data = await s3.send(command);
    const files = data.Contents?.map((item) => ({
      name: item.Key,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    })) || [];
    res.status(200).json({ files });
  } catch (error) {
    console.error("List files error:", error);
    res.status(500).json({ error: "Failed to list files", message: error.message });
  }
});

    if (USE_FAKE_UPLOAD) {
      return res.status(200).json({
        url: `debug://${encodeURIComponent(filename)}?bytes=${f.size}`,
        ...(SHOW_DEBUG && {
          details: {
            mimetype: f.mimetype,
            size: f.size,
            note: "This is a fake URL (UPLOAD_FAKE=1). S3 not called.",
          },
        }),
      });
    }
  
      const url = await aws_upload({
      filename,
      file: f.buffer,
      mimetype: f.mimetype,
    });

    return res.status(200).json({ url });
  } catch (e) {
      const map = {
      InvalidFileType: { status: 400, msg: "Only images (JPEG, PNG, WebP, GIF) or PDFs are allowed" },
      AccessDenied:    { status: 403, msg: "Permission denied to access storage" },
      NoSuchBucket:    { status: 502, msg: "Storage bucket not found" },
      EntityTooLarge:  { status: 413, msg: "File size exceeds limit" },
      AuthorizationHeaderMalformed: { status: 400, msg: "Region mismatch: check AWS_REGION vs bucket region" },
      PermanentRedirect: { status: 400, msg: "Region mismatch: use the bucket's exact region" },
      InvalidAccessKeyId: { status: 403, msg: "Bad AWS keys (Access Key ID not found)" },
      SignatureDoesNotMatch: { status: 403, msg: "Bad secret or wrong region" },
    };

      const status = map[e?.message]?.status
      ?? map[e?.code]?.status
      ?? e?.$metadata?.httpStatusCode
      ?? 500;

      console.error("UPLOAD ERROR:", {
      message: e?.message,
      code: e?.code,
      name: e?.name,
      httpStatus: status,
      aws: e?.$metadata,
      stack: e?.stack,
    });

    return res.status(status).json({
      error: map[e?.message]?.msg || map[e?.code]?.msg || e?.message || "Upload failed",
      ...(SHOW_DEBUG && {
        details: {
          code: e?.code || null,
          message: e?.message || null,
          name: e?.name || null,
          httpStatus: e?.$metadata?.httpStatusCode || status,
        },
      }),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
