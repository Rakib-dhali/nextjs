"use client";

import { useState } from "react";
import { UploadResponse } from "@imagekit/next";
import FileUpload from "./FileUpload";
import { apiClient, VideoFormData } from "@/lib/api-client";

interface VideoUploadFormProps {
  onUploadSuccess?: () => void;
}

const VideoUploadForm = ({ onUploadSuccess }: VideoUploadFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadSuccess = (response: UploadResponse) => {
    setUploadedFile(response);
    setSuccessMessage("Video uploaded to ImageKit successfully!");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Description is required");
      return;
    }

    if (!uploadedFile) {
      setErrorMessage("Please upload a video file first");
      return;
    }

    setIsSubmitting(true);

    try {
      const videoData: VideoFormData = {
        title: formData.title,
        description: formData.description,
        videoUrl: uploadedFile.url!,
        thumbnailUrl: `${uploadedFile.url}?ik-t=frame&t=0` || "https://via.placeholder.com/400x300?text=Video+Thumbnail",
      };
      await apiClient.createVideo(videoData);

      setSuccessMessage("Video saved successfully!");
      setFormData({ title: "", description: "" });
      setUploadedFile(null);
      setUploadProgress(0);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to save video";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Upload Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-semibold text-gray-700">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows={4}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Upload Video <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white hover:border-gray-400 transition">
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onProgress={setUploadProgress}
              filetype="video"
            />
            
            {/* Progress Bar */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium mt-2 block">{uploadProgress}%</span>
              </div>
            )}

            {/* Upload Success Indicator */}
            {uploadedFile && (
              <div className="mt-3 text-green-600 text-sm font-medium">
                ✓ Video uploaded: {uploadedFile.name}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !uploadedFile}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default VideoUploadForm;
