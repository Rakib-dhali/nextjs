"use client";

import { upload, UploadResponse } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  filetype?: "image" | "video";
}

const FileUpload = ({ onUploadSuccess, onProgress, filetype, }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File) => {
    if (filetype === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a valid video file.");
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds the 50MB limit.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file)) return;
    setUploading(true);
    setError(null);
    try {
      const authResponse = await fetch("/api/auth/imagekit-auth");
      if (!authResponse.ok) throw new Error("Failed to get upload auth");
      const auth = await authResponse.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (e: ProgressEvent) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
            if (onProgress) onProgress(percent);
          }
        },
      });

      onUploadSuccess?.(res);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={filetype === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading... {progress}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default FileUpload;
