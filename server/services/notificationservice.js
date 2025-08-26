
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import "dotenv/config";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to send email notification
export const sendEmailNotification = async (filename, url) => {
  if (!process.env.SNS_TOPIC_ARN) {
    console.error("SNS_TOPIC_ARN is missing in environment variables");
    return;
  }

  const uploadTime = new Date().toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" });
  const snsParams = {
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: `Hello,\n\nThe file "${filename}" has been successfully uploaded to S3 at ${uploadTime} NZST.\nYou can view it here: ${url}\n\nBest regards,\nYour Application Team`,
    Subject: "S3 Upload Successful",
  };

  try {
    const command = new PublishCommand(snsParams);
    await snsClient.send(command);
    console.log("Email notification sent for file:", filename);
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
};