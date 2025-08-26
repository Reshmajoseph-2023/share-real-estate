// server/controllers/s3Controller.js
import { aws_upload, listFiles } from "../services/s3service.js";
import { sendEmailNotification } from '../services/notificationservice.js';

// Handler for listing files
export const getListFiles = async (req, res) => {
  try {
    const files = await listFiles();
    res.status(200).json({ files });
  } catch (error) {
    console.error("List files error:", error);
    res.status(500).json({ error: "Failed to list files", message: error.message });
  }
};

// Handler for uploading files to AWS S3
export const uploadFile = async (req, res) => {
  try {
    const { filename } = req.body;
    const f = req.file;

    if (!filename || !f) {
      return res.status(400).json({ error: "Filename and file are required" });
    }
    if (!f.buffer) {
      return res.status(400).json({ error: "File buffer missing (check multer.memoryStorage)" });
    }

    const USE_FAKE_UPLOAD = process.env.UPLOAD_FAKE === "1";
    const SHOW_DEBUG = process.env.NODE_ENV !== "production" || process.env.UPLOAD_DEBUG === "1";

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
      req,
    });

    await sendEmailNotification(filename, url);

    return res.status(200).json({ url });
  } catch (e) {
    const map = {
      InvalidFileType: { status: 400, msg: "Only images (JPEG, PNG, WebP, GIF) or PDFs are allowed" },
      AccessDenied: { status: 403, msg: "Permission denied to access storage" },
      NoSuchBucket: { status: 502, msg: "Storage bucket not found" },
      EntityTooLarge: { status: 413, msg: "File size exceeds limit" },
      AuthorizationHeaderMalformed: { status: 400, msg: "Region mismatch: check AWS_REGION vs bucket region" },
      PermanentRedirect: { status: 400, msg: "Region mismatch: use the bucket's exact region" },
      InvalidAccessKeyId: { status: 403, msg: "Bad AWS keys (Access Key ID not found)" },
      SignatureDoesNotMatch: { status: 403, msg: "Bad secret or wrong region" },
    };
    const status = map[e?.message]?.status || map[e?.code]?.status || e?.$metadata?.httpStatusCode || 500;

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
};