"use client";

import { useCallback } from "react";
import { authErrorHandler } from "@/lib/auth-error-handler";

/**
 * Custom hook for handling authentication errors in React components
 * @returns Object with error handling utilities
 */
export function useAuthErrorHandler() {
  const handleAuthError = useCallback((error: unknown) => {
    return authErrorHandler.handleAuthError(error);
  }, []);

  const withAuthErrorHandling = useCallback(<T>(apiCall: () => Promise<T>) => {
    return authErrorHandler.withAuthErrorHandling(apiCall);
  }, []);

  return {
    handleAuthError,
    withAuthErrorHandling,
  };
}

/**
 * Higher-order function to wrap API calls with automatic 401 error handling
 * @param apiCall - The API function to wrap
 * @returns Wrapped function that handles 401 errors automatically
 */
export function withAuth<T extends unknown[], R>(
  apiCall: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | null> {
  return async (...args: T): Promise<R | null> => {
    return authErrorHandler.withAuthErrorHandling(() => apiCall(...args));
  };
}
