"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Raspberry Pi 5 Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Monitor and control your Raspberry Pi 5 system
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* System Monitor Card */}
          <Link href="/monitor" className="group">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-blue-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-800/70 transition-colors">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">System Monitor</h2>
                <p className="text-gray-400 text-sm">
                  Real-time CPU, temperature, and memory monitoring
                </p>
              </div>
            </div>
          </Link>

          {/* Video Stream Card */}
          <Link href="/video" className="group">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-red-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-800/70 transition-colors">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Video Stream</h2>
                <p className="text-gray-400 text-sm">
                  Real-time video streaming from camera
                </p>
              </div>
            </div>
          </Link>

          {/* Controller Card */}
          <Link href="/controller" className="group">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-green-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-800/70 transition-colors">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">System Control</h2>
                <p className="text-gray-400 text-sm">
                  Control system settings and operations
                </p>
              </div>
            </div>
          </Link>

          {/* About Card */}
          <Link href="/about" className="group">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-purple-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-800/70 transition-colors">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">About</h2>
                <p className="text-gray-400 text-sm">
                  Learn more about this project and system
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>Built with Next.js for Raspberry Pi 5 by Ammaar</p>
        </div>
      </div>
    </div>
  );
} 