"use client";
import Link from "next/link";
import { useState } from "react";

export default function ControllerPage() {
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleShutdown = async () => {
    if (confirm("Are you sure you want to shutdown the Raspberry Pi?")) {
      setIsShuttingDown(true);
      try {
        // This would typically call an API endpoint to shutdown
        console.log("Shutdown initiated");
        // For safety, we'll just show a message instead of actually shutting down
        alert("Shutdown functionality would be implemented here for safety.");
      } catch (error) {
        console.error("Shutdown failed:", error);
      } finally {
        setIsShuttingDown(false);
      }
    }
  };

  const handleRestart = async () => {
    if (confirm("Are you sure you want to restart the Raspberry Pi?")) {
      setIsRestarting(true);
      try {
        // This would typically call an API endpoint to restart
        console.log("Restart initiated");
        // For safety, we'll just show a message instead of actually restarting
        alert("Restart functionality would be implemented here for safety.");
      } catch (error) {
        console.error("Restart failed:", error);
      } finally {
        setIsRestarting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">System Control</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-400 mt-2">Control system operations and settings</p>
        </div>

        {/* Control Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Uptime:</span>
                <span className="text-white">2h 34m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Last Boot:</span>
                <span className="text-white">Today 09:15</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleRestart}
                disabled={isRestarting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {isRestarting ? "Restarting..." : "Restart System"}
              </button>
              <button
                onClick={handleShutdown}
                disabled={isShuttingDown}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {isShuttingDown ? "Shutting Down..." : "Shutdown System"}
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">System Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Model:</span>
                <span className="text-white">Raspberry Pi 5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">OS:</span>
                <span className="text-white">Raspberry Pi OS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Kernel:</span>
                <span className="text-white">6.1.21</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Advanced Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">SSH Service:</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Web Server:</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Database:</span>
                  <span className="text-gray-400">Stopped</span>
                </div>
              </div>
            </div>

            {/* Network */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Network</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">WiFi:</span>
                  <span className="text-green-400">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">IP Address:</span>
                  <span className="text-white">192.168.1.100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Signal:</span>
                  <span className="text-green-400">Strong</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-300">Safety Notice</h3>
              <p className="text-sm text-yellow-200 mt-1">
                System control functions are currently in demonstration mode. In a production environment, 
                these would be connected to actual system commands with proper authentication and safety measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 