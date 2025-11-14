"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";

/**
 * Hook to monitor authentication status and 401 error handling
 */
export function useAuthStatus() {
  const { user } = useAuthStore();
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    lastError?: string;
    lastErrorTime?: Date;
  }>({
    isAuthenticated: !!user,
  });

  useEffect(() => {
    const isAuthenticated = !!user;
    setAuthStatus((prev) => ({
      ...prev,
      isAuthenticated,
    }));
  }, [user]);

  // Method to report auth errors (can be called from error handlers)
  const reportAuthError = (error: string) => {
    setAuthStatus((prev) => ({
      ...prev,
      lastError: error,
      lastErrorTime: new Date(),
      isAuthenticated: false,
    }));
  };

  return {
    ...authStatus,
    reportAuthError,
  };
}

/**
 * Component to display authentication status (useful for debugging)
 */
export function AuthStatusIndicator() {
  const { isAuthenticated, lastError, lastErrorTime } = useAuthStatus();

  if (process.env.NODE_ENV !== "development") {
    return null; // Only show in development
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        padding: "8px 12px",
        backgroundColor: isAuthenticated ? "#4CAF50" : "#f44336",
        color: "white",
        fontSize: "12px",
        borderRadius: "4px",
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      <div>
        Auth: {isAuthenticated ? "✓ Authenticated" : "✗ Not Authenticated"}
      </div>
      {lastError && lastErrorTime && (
        <div style={{ fontSize: "10px", marginTop: "4px", opacity: 0.8 }}>
          Last error: {lastError} ({lastErrorTime.toLocaleTimeString()})
        </div>
      )}
    </div>
  );
}
