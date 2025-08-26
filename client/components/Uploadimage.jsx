// src/components/UploadFile.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadFile() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // For file preview
  const fileInputRef = useRef(null); // Ref for file input

  // Use Vite env var; fall back to localhost for convenience
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const errorMessages = {
    AccessDenied: "Permission denied. Contact support.",
    NoSuchBucket: "Storage service unavailable.",
    InvalidFileType: "Please select a valid image or PDF file.",
    FileTooLarge: "File size exceeds 5MB limit.",
  };

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(errorMessages.InvalidFileType);
        return;
      }
      if (file.size > maxSize) {
        toast.error(errorMessages.FileTooLarge);
        return;
      }
      setSelectedName(file.name);
      setFileType(file.type);
      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl("");
      }
    }
  };

  const uploadFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("No file selected. Please choose a file to upload.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setUrl("");
    setErrorDetails("");

    const safeName = selectedName.replace(/\s+/g, "_");
    const filename = `${Date.now()}_${safeName}`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", filename);

      console.log("Uploading:", { filename, fileName: selectedName, size: file.size, type: file.type, api: API });

      const res = await axios.post(`${API}/upload_aws`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.round((evt.loaded * 100) / evt.total);
            setProgress(pct);
          }
        },
      });

      console.log("Upload successful, response:", res.data);
      const uploadedUrl = res.data?.url || "";
      setUrl(uploadedUrl);
      toast.success(`File "${selectedName}" uploaded successfully! View it here: ${uploadedUrl}`, {
        autoClose: 5000,
        onClose: () => setPreviewUrl(""), // Clear preview on toast close
      });
    } catch (err) {
      console.error("Upload failed:", err);
      const responseData = err.response?.data || {};
      const code = responseData.error || err.code || "UnknownError";
      const errorMessage =
        errorMessages[code] ||
        responseData.message ||
        err.message ||
        "Failed to upload file. Please try again.";
      setErrorDetails(`Error: ${errorMessage} (Code: ${code}, Status: ${err.response?.status || "N/A"})`);
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.info("Link copied to clipboard!", { autoClose: 3000 });
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload to AWS S3</h2>

      <div className="mb-4">
        <label htmlFor="file-input" className="block mb-2 text-sm font-medium text-gray-700">
          Choose an image (JPEG/PNG/WebP/GIF) or PDF (≤ 5MB)
        </label>
        <input
          id="file-input"
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="mb-2 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
        />
        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Preview:</p>
            <img src={previewUrl} alt="Preview" className="max-w-xs mt-1 rounded border" />
          </div>
        )}
        <button
          onClick={uploadFile}
          disabled={loading || !selectedName}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>

      {loading && (
        <div className="mb-4">
          <p className="text-blue-600 text-sm mb-1">Uploading {selectedName} ({formatBytes(fileInputRef.current?.files?.[0]?.size || 0)})</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">{progress}%</p>
        </div>
      )}

      {url && (
        <div className="mt-4 text-green-600">
          <p className="font-semibold">Upload Successful!</p>
          <p className="text-sm">File "{selectedName}" uploaded. <a href={url} target="_blank" rel="noopener noreferrer" className="underline">View here</a>.</p>
          <button
            onClick={copyToClipboard}
            className="mt-2 py-1 px-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
          >
            Copy Link
          </button>
        </div>
      )}

      {errorDetails && (
        <div className="mt-4 text-red-600 text-sm">
          <p><strong>Error Details:</strong> {errorDetails}</p>
        </div>
      )}

      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={5000}
        closeButton={true}
      />
    </div>
  );
}