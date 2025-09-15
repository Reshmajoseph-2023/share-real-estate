// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import { userRoute } from "./route/userRoute.js";
// import { propertyRoute } from "./route/propertyRoute.js";
// import { authRoutes } from "./route/authRoutes.js";
// import { getListFiles, uploadFile } from "./controllers/s3Controller.js";
// import { uploadMiddleware } from "./middleware/UploadMiddleware.js";

// const app = express();
// const PORT = process.env.PORT || 8001;

// // ---- CORS (must be before routes/auth)
// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // only if you use cookies
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

// // ---- Parsers
// app.use(express.json());
// app.use(cookieParser());

// // ---- Health
// app.get("/ping", (_req, res) => res.json({ ok: true }));

// // ---- Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoute);
// app.use("/api/property", propertyRoute);

// // sample S3 endpoints you already had
// app.get("/list-files", getListFiles);
// app.post("/upload_aws", uploadMiddleware.single("file"), uploadFile);

// // ---- Error handler (keeps 500s readable)
// app.use((err, _req, res, _next) => {
//   console.error("Unhandled error:", err);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRoute } from "./route/userRoute.js";
import { propertyRoute } from "./route/propertyRoute.js";
import { authRoutes } from "./route/authRoutes.js";
import { getListFiles, uploadFile } from "./controllers/s3Controller.js";
import { uploadMiddleware } from "./middleware/UploadMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8001;

// CORS must be before routes
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  console.log('  headers.authorization:', req.headers.authorization);
  console.log('  params:', req.params);
  console.log('  body:', req.body);
  next();
});
app.use(cookieParser());

app.get("/ping", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/property", propertyRoute);

app.get("/list-files", getListFiles);
app.post("/upload_aws", uploadMiddleware.single("file"), uploadFile);

// Central error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
