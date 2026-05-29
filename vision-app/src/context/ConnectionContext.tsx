"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiService } from "@/lib/api";
import {
  CONNECTION_MODE_STORAGE_KEY,
  detectDefaultConnectionMode,
  getApiUrlForMode,
  type ConnectionMode,
} from "@/lib/config";

interface ConnectionContextValue {
  mode: ConnectionMode;
  apiUrl: string;
  isReady: boolean;
  setMode: (mode: ConnectionMode) => void;
  connectionVersion: number;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  // Keep initial render identical on server and client to avoid hydration mismatches.
  const [mode, setModeState] = useState<ConnectionMode>("local");
  const [isReady, setIsReady] = useState(false);
  const [connectionVersion, setConnectionVersion] = useState(0);

  useEffect(() => {
    const initialMode = detectDefaultConnectionMode();
    setModeState(initialMode);
    apiService.setBaseUrl(getApiUrlForMode(initialMode));
    setIsReady(true);
    setConnectionVersion((version) => version + 1);
  }, []);

  const setMode = useCallback((nextMode: ConnectionMode) => {
    setModeState(nextMode);
    localStorage.setItem(CONNECTION_MODE_STORAGE_KEY, nextMode);
    apiService.setBaseUrl(getApiUrlForMode(nextMode));
    setConnectionVersion((version) => version + 1);
  }, []);

  const apiUrl = useMemo(() => getApiUrlForMode(mode), [mode]);

  return (
    <ConnectionContext.Provider value={{ mode, apiUrl, isReady, setMode, connectionVersion }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}
