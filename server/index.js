import "dotenv/config";
import express from "express";
import { userRoute } from "./route/userRoute.js";
import { propertyRoute } from "./route/propertyRoute.js";
import { authRoutes } from "./route/authRoutes.js";
import { getListFiles,uploadFile} from './controllers/s3Controller.js';
import { corsMiddleware, jsonParser, cookieParserMiddleware,uploadMiddleware } from "./middleware/UploadMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8000;
// Validate environment variables
if (
  !process.env.AWS_REGION ||
  !process.env.S3_BUCKET_NAME ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
   ) 
{
  console.error("Missing required environment variables");
  process.exit(1);
}
// Apply middleware
app.use(corsMiddleware);
app.use(jsonParser);
app.use(cookieParserMiddleware);

app.get("/ping", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/property", propertyRoute);

app.get("/list-files", getListFiles);

// Adjusted upload route to use uploadFile controller
app.post("/upload_aws", uploadMiddleware.single('file'), uploadFile);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});