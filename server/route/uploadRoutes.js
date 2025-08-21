import express from "express";
import  upload  from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Route: POST /api/upload/image
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    imagePath: `/uploads/${req.file.filename}`,
  });
});

export { router as uploadRoutes };
