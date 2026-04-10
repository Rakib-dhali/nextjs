"use client";

import { useEffect, useState } from "react";
import { IVideo } from "@/models/video.model";
import { apiClient } from "@/lib/api-client";
import Image from "next/image";

interface VideoFeedProps {
  refreshTrigger?: number;
}

const VideoFeed = ({ refreshTrigger }: VideoFeedProps) => {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getVideos();
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load videos";
      setError(errorMsg);
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="ml-3 text-gray-600">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchVideos}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-600 text-lg">No videos yet</p>
        <p className="text-gray-500 text-sm">Upload your first video to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Video Feed</h2>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300 transition"
              onClick={() => setSelectedVideo(null)}
            >
              ✕
            </button>
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 bg-white rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedVideo.title}
              </h3>
              <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id.toString()}
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-900 overflow-hidden">
              <Image width={400} height={300}
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x300?text=No+Thumbnail";
                }}
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all"
                onClick={() => setSelectedVideo(video)}
                title="Play video"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                  ▶
                </div>
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span>🎬</span> Video
                </span>
                {video.createdAt && (
                  <span>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
