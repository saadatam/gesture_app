"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { apiService, apiUtils } from "@/lib/api";

export default function VideoPage() {
  const videoRef = useRef<HTMLImageElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const {
    isBackendConnected,
    streamStatus,
    isStreaming,
    isLoading,
    error,
    startStream,
    stopStream,
    captureImage,
    retryConnection,
    clearError,
  } = useApi();

  // Update video source when streaming status changes
  useEffect(() => {
    if (videoRef.current) {
      if (isStreaming) {
        setIsVideoLoading(true);
        setVideoError(null);
        videoRef.current.src = apiService.getStreamUrl();
      } else {
        videoRef.current.src = "";
        setIsVideoLoading(false);
        setVideoError(null);
      }
    }
  }, [isStreaming]);

  const handleStartStream = async () => {
    await startStream();
    // The video source will be updated by the useEffect above
  };

  const handleStopStream = async () => {
    await stopStream();
    // The video source will be updated by the useEffect above
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    setVideoError(null);
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoError("Failed to load video stream. Please check the backend and camera connection.");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Video Stream</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-400 mt-2">Real-time video streaming from Raspberry Pi camera</p>
        </div>

        {/* Backend Connection Status */}
        {isBackendConnected === false && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-300">Backend Not Connected</h3>
                  <p className="text-sm text-red-200 mt-1">
                    The Python backend server is not reachable. Please start the backend first.
                  </p>
                </div>
              </div>
              <button
                onClick={retryConnection}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Status Panel */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Backend:</span>
              <span className={`font-medium ${isBackendConnected ? "text-green-400" : "text-red-400"}`}>
                {isBackendConnected === null ? "Checking..." : isBackendConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Camera:</span>
              <span className={`font-medium ${apiUtils.getStatusColor(streamStatus?.camera_status || "unknown")}`}>
                {streamStatus?.camera_status || "Checking..."}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Stream:</span>
              <span className={`font-medium ${isStreaming ? "text-green-400" : "text-red-400"}`}>
                {isStreaming ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          {streamStatus?.timestamp && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">Last Update:</span>
                <span className="text-white">
                  {apiUtils.formatTimestamp(streamStatus.timestamp)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video Display */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            Video Stream
            {isStreaming && (
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded animate-pulse">LIVE</span>
            )}
          </h2>
          <div className="relative">
            {isStreaming ? (
              <div className="relative w-full max-w-4xl mx-auto">
                <img
                  ref={videoRef}
                  alt="Video Stream"
                  className="w-full rounded-lg border border-gray-600"
                  style={{ maxHeight: "480px" }}
                  onLoad={handleVideoLoad}
                  onError={handleVideoError}
                />
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400"></div>
                  </div>
                )}
                {videoError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg z-20">
                    <p className="text-red-300 mb-2">{videoError}</p>
                    <button
                      onClick={() => {
                        setVideoError(null);
                        setIsVideoLoading(true);
                        if (videoRef.current) videoRef.current.src = apiService.getStreamUrl();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {/* Video Info */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  640x480 @ 60fps, Quality: 70
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl mx-auto h-96 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">📹</div>
                  <p className="text-gray-300">
                    {!isBackendConnected ? "Backend not connected" : "No active stream"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {!isBackendConnected 
                      ? "Start the Python backend first" 
                      : "Click 'Start Stream' to begin"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStartStream}
              disabled={!isBackendConnected || isStreaming || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-2 px-6 rounded transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? "Starting..." : "Start Stream"}
            </button>
            
            <button
              onClick={handleStopStream}
              disabled={!isBackendConnected || !isStreaming || isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium py-2 px-6 rounded transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? "Stopping..." : "Stop Stream"}
            </button>
            
            <button
              onClick={captureImage}
              disabled={!isBackendConnected || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-6 rounded transition-colors disabled:cursor-not-allowed"
            >
              Capture Image
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-300">Error</h3>
                  <p className="text-sm text-red-200 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-300 hover:text-red-200 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-900/50 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-300">Setup Instructions</h3>
              <ul className="text-sm text-blue-200 mt-1 space-y-1">
                <li>• Start the Python backend: <code className="bg-blue-800 px-1 rounded">python3 main.py</code></li>
                <li>• Ensure your Raspberry Pi camera is connected and enabled</li>
                <li>• Click "Start Stream" to begin video streaming</li>
                <li>• Use "Capture Image" to save a single frame</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 