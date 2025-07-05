import { useState, useEffect, useCallback } from "react";
import { apiService, type StreamStatus, type CameraSettings } from "@/lib/api";

export interface UseApiState {
  isBackendConnected: boolean | null;
  streamStatus: StreamStatus | null;
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseApiActions {
  startStream: (settings?: CameraSettings) => Promise<void>;
  stopStream: () => Promise<void>;
  captureImage: () => Promise<void>;
  retryConnection: () => Promise<void>;
  clearError: () => void;
}

export function useApi(): UseApiState & UseApiActions {
  const [state, setState] = useState<UseApiState>({
    isBackendConnected: null,
    streamStatus: null,
    isStreaming: false,
    isLoading: false,
    error: null,
  });

  // Check backend connectivity
  const checkBackendConnection = useCallback(async () => {
    const result = await apiService.testConnection();
    setState(prev => ({
      ...prev,
      isBackendConnected: result.success,
      error: result.success ? null : "Backend server is not reachable. Please start the Python backend.",
    }));
    return result.success;
  }, []);

  // Check stream status
  const checkStatus = useCallback(async () => {
    if (!state.isBackendConnected) return;

    try {
      const result = await apiService.getStatus();
      if (result.success && result.data) {
        const streamData = result.data;
        setState(prev => ({
          ...prev,
          streamStatus: streamData,
          isStreaming: streamData.streaming,
        }));
      } else {
        setState(prev => ({
          ...prev,
          streamStatus: null,
        }));
        if (result.error) {
          console.error("Status check error:", result.error);
        }
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        streamStatus: null,
      }));
      console.error("Error checking status:", err);
    }
  }, [state.isBackendConnected]);

  // Start stream
  const startStream = useCallback(async (settings?: CameraSettings) => {
    if (!state.isBackendConnected) {
      setState(prev => ({ ...prev, error: "Backend not connected" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const defaultSettings: CameraSettings = {
      width: 640,
      height: 480,
      fps: 60,
      quality: 70,
    };

    try {
      const result = await apiService.startStream(settings || defaultSettings);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isStreaming: true,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || "Failed to start stream",
          isLoading: false,
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: "Failed to connect to video server",
        isLoading: false,
      }));
      console.error("Error starting stream:", err);
    }
  }, [state.isBackendConnected]);

  // Stop stream
  const stopStream = useCallback(async () => {
    if (!state.isBackendConnected) {
      setState(prev => ({ ...prev, error: "Backend not connected" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await apiService.stopStream();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isStreaming: false,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || "Failed to stop stream",
          isLoading: false,
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: "Failed to connect to video server",
        isLoading: false,
      }));
      console.error("Error stopping stream:", err);
    }
  }, [state.isBackendConnected]);

  // Capture image
  const captureImage = useCallback(async () => {
    if (!state.isBackendConnected) {
      setState(prev => ({ ...prev, error: "Backend not connected" }));
      return;
    }

    try {
      const result = await apiService.captureImage();
      
      if (result.success && result.data) {
        // Success - image captured and downloaded
        setState(prev => ({ ...prev, error: null }));
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || "Failed to capture image",
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: "Failed to capture image",
      }));
      console.error("Error capturing image:", err);
    }
  }, [state.isBackendConnected]);

  // Retry connection
  const retryConnection = useCallback(async () => {
    setState(prev => ({ ...prev, error: null, isBackendConnected: null }));
    
    const success = await checkBackendConnection();
    
    if (!success) {
      setState(prev => ({
        ...prev,
        error: "Backend server is still not reachable. Please check if the Python backend is running.",
      }));
    }
  }, [checkBackendConnection]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initial connection check
  useEffect(() => {
    checkBackendConnection();
  }, [checkBackendConnection]);

  // Periodic status check
  useEffect(() => {
    if (!state.isBackendConnected) return;

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [state.isBackendConnected, checkStatus]);

  return {
    ...state,
    startStream,
    stopStream,
    captureImage,
    retryConnection,
    clearError,
  };
} 