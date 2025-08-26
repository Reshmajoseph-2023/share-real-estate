import express from "express";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
//import { aws_upload } from "../services/s3service.js"; // Import aws_upload

const router = express.Router();

// Route: POST /api/upload/image
router.post("/image", uploadMiddleware.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload file to S3
    const fileUrl = await aws_upload({
      filename: req.file.originalname,
      file: req.file.buffer,
      mimetype: req.file.mimetype,
      req,
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ message: "Error uploading file to S3" });
  }
});

export { router as uploadRoutes };