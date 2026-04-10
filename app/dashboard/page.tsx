"use client";

import { useState } from "react";
import VideoUploadForm from "@/app/components/VideoUploadForm";
import VideoFeed from "@/app/components/VideoFeed";

export default function DashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"upload" | "feed">("feed");

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("feed");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Video Dashboard</h1>
          <p className="mt-2 text-gray-600">Upload and manage your videos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upload"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">⬆️</span>
                Upload Video
              </span>
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "feed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📽️</span>
                Video Feed
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="animate-fadeIn">
            <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <div className="animate-fadeIn">
            <VideoFeed refreshTrigger={refreshTrigger} />
          </div>
        )}
      </div>
    </div>
  );
}