"use client";

import { useAuthStore } from "@/store/auth";
import { HttpError } from "./http";

export class AuthErrorHandler {
  private static instance: AuthErrorHandler;

  private constructor() {}

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  /**
   * Handle authentication errors, specifically 401 Unauthorized
   * @param error - The error to handle
   * @returns true if error was handled, false otherwise
   */
  handleAuthError(error: unknown): boolean {
    if (error instanceof HttpError && error.isUnauthorized()) {
      console.log("401 Unauthorized detected, clearing user session");
      console.log("Error details:", { status: error.status, data: error.data });

      // Clear the authentication state
      useAuthStore.getState().clearUser();

      // Log the event for debugging
      if (typeof window !== "undefined" && window.console) {
        console.warn(
          "🔐 Authentication session expired. User logged out automatically.",
        );
      }

      // Optionally redirect to login page
      // You can uncomment and modify this based on your routing setup
      // if (typeof window !== "undefined") {
      //   window.location.href = "/auth/login";
      // }

      return true;
    }

    return false;
  }

  /**
   * Wrapper for API calls that automatically handles 401 errors
   * @param apiCall - The API function to execute
   * @returns Promise with the API result or null if 401 error occurred
   */
  async withAuthErrorHandling<T>(apiCall: () => Promise<T>): Promise<T | null> {
    try {
      return await apiCall();
    } catch (error) {
      if (this.handleAuthError(error)) {
        return null;
      }
      throw error; // Re-throw if not a 401 error
    }
  }
}

// Export singleton instance
export const authErrorHandler = AuthErrorHandler.getInstance();
