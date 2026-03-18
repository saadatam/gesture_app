"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SystemStats {
  cpu: string;
  cores: string[];
  temp: string | null;
  mem: {
    total: string;
    used: string;
  };
}

export default function MonitorPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) {
          throw new Error("Failed to fetch system stats");
        }
        const data = await res.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 500); // update every 2s
    return () => clearInterval(interval);
  }, []);

  const getMemoryPercentage = () => {
    if (!stats) return 0;
    const used = parseFloat(stats.mem.used);
    const total = parseFloat(stats.mem.total);
    return Math.round((used / total) * 100);
  };

  const getTemperatureColor = (temp: string | null) => {
    if (!temp) return "text-gray-400";
    const tempNum = parseFloat(temp);
    if (tempNum < 50) return "text-green-400";
    if (tempNum < 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getUsageColor = (usage: string) => {
    const usageNum = parseFloat(usage);
    if (usageNum < 50) return "text-green-400";
    if (usageNum < 80) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
          <Link href="/" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Raspberry Pi 5 System Monitor</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
              ← Back to Home
            </Link>
          </div>
          <p className="text-gray-400 mt-2">Real-time system performance monitoring</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CPU Usage Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">CPU Usage</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Overall:</span>
                  <span className={`text-lg font-bold ${getUsageColor(stats.cpu)}`}>
                    {stats.cpu}%
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-gray-400">Per Core:</span>
                  {stats.cores.map((core, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Core {idx + 1}:</span>
                      <span className={`font-medium ${getUsageColor(core)}`}>
                        {core}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Temperature Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Temperature</h2>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getTemperatureColor(stats.temp)}`}>
                  {stats.temp ? `${stats.temp}°C` : "N/A"}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {stats.temp && parseFloat(stats.temp) > 70 ? "⚠️ High temperature" : "Normal"}
                </p>
              </div>
            </div>

            {/* Memory Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Memory Usage</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Used:</span>
                  <span className="font-bold text-white">{stats.mem.used} MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total:</span>
                  <span className="font-bold text-white">{stats.mem.total} MB</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressBarColor(getMemoryPercentage())}`}
                    style={{ width: `${getMemoryPercentage()}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${getUsageColor(getMemoryPercentage().toString())}`}>
                    {getMemoryPercentage()}% used
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
} 