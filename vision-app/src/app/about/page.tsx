"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">About</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-400 mt-2">Learn more about this Raspberry Pi 5 dashboard</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Raspberry Pi 5 Dashboard</h2>
              <p className="text-gray-300 leading-relaxed">
                This is a comprehensive system monitoring and control dashboard built specifically for the Raspberry Pi 5. 
                It provides real-time monitoring of system resources including CPU usage, temperature, and memory utilization.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Real-time CPU monitoring with per-core usage display
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Temperature monitoring with color-coded alerts
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Memory usage tracking with visual progress bars
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  Auto-refresh every 5 seconds for live updates
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  Responsive design for mobile and desktop
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Frontend</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Next.js 15 with App Router</li>
                    <li>• React 19 with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Real-time data fetching</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Backend</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Node.js API routes</li>
                    <li>• SystemInformation library</li>
                    <li>• Raspberry Pi 5 hardware</li>
                    <li>• Linux system monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">System Requirements</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <ul className="text-gray-300 space-y-1">
                  <li>• Raspberry Pi 5 (any model)</li>
                  <li>• Node.js 18+ installed</li>
                  <li>• Linux-based OS (Raspberry Pi OS recommended)</li>
                  <li>• Internet connection for initial setup</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Built with ❤️ for Raspberry Pi enthusiasts and developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 