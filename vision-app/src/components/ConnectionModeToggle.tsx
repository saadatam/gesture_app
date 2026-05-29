"use client";

import { useConnection } from "@/context/ConnectionContext";
import { CONNECTION_CONFIG, type ConnectionMode } from "@/lib/config";

export function ConnectionModeToggle() {
  const { mode, apiUrl, setMode } = useConnection();

  const handleModeChange = (nextMode: ConnectionMode) => {
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  };

  return (
    <div className="bg-gray-800/95 border border-gray-700 rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Backend Connection</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {CONNECTION_CONFIG[mode].description}
          </p>
          <p className="text-xs text-blue-300 mt-1 font-mono">{apiUrl}</p>
        </div>

        <div className="flex rounded-lg border border-gray-600 overflow-hidden shrink-0">
          {(Object.keys(CONNECTION_CONFIG) as ConnectionMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleModeChange(option)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mode === option
                  ? option === "local"
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {CONNECTION_CONFIG[option].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
