import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function aws_upload({ filename, file, mimetype }) {
  if (!filename || !file) {
    throw new Error("Filename and file are required");
  }

  const extension = filename.split(".").pop().toLowerCase();
  const contentType = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
  }[extension] || mimetype || "application/octet-stream";

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: file,
    ContentType: contentType,   
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
}