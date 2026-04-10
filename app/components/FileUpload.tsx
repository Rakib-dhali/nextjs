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
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />
      {uploading && (
        <p className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Uploading... {progress}%
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
};

export default FileUpload;
