/**
 * Test utilities for 401 authentication error handling
 * These can be used in the browser console or imported in components for testing
 */

import { HttpHelper, HttpError } from "@/lib/http";
import { authErrorHandler } from "@/lib/auth-error-handler";
import { useAuthStore } from "@/store/auth";

// Test the HTTP error handling
export async function test401ErrorHandling() {
  console.log("🧪 Testing 401 Error Handling...");

  // Create a test HTTP instance
  const http = new HttpHelper("http://localhost:8000");

  try {
    // This should trigger a 401 error
    await http.get("/api/v2/auth/me");
    console.log("❌ Expected 401 error but request succeeded");
  } catch (error) {
    if (error instanceof HttpError) {
      console.log("✅ HttpError caught:", {
        status: error.status,
        isUnauthorized: error.isUnauthorized(),
        message: error.message,
        data: error.data,
      });

      // Test the auth error handler
      const wasHandled = authErrorHandler.handleAuthError(error);
      console.log("✅ Auth error handled:", wasHandled);

      // Check if user was cleared
      const currentUser = useAuthStore.getState().user;
      console.log("✅ User after error handling:", currentUser);
    } else {
      console.log("❌ Unexpected error type:", error);
    }
  }
}

// Test the auth error handler wrapper
export async function testAuthWrapperFunction() {
  console.log("🧪 Testing Auth Wrapper Function...");

  const result = await authErrorHandler.withAuthErrorHandling(async () => {
    const http = new HttpHelper("http://localhost:8000");
    return await http.get("/api/v2/auth/me");
  });

  console.log("✅ Wrapper result (should be null on 401):", result);
}

// Set a test user to see the clearing behavior
export function setTestUser() {
  useAuthStore.getState().setUser({
    id: 123,
    email: "test@example.com",
    firstNameTh: "ทดสอบ",
    lastNameTh: "ผู้ใช้",
    firstNameEn: "Test",
    lastNameEn: "User",
    nickName: "Test",
    imageUrl: "/default-avatar.png",
  });
  console.log("✅ Test user set:", useAuthStore.getState().user);
}

// Check current auth state
export function checkAuthState() {
  const user = useAuthStore.getState().user;
  console.log("📊 Current auth state:", {
    isAuthenticated: !!user,
    user: user,
  });
}

// Instructions for manual testing
export function printTestInstructions() {
  console.log(`
🧪 Manual Testing Instructions for 401 Error Handling:

1. Open browser console and run:
   setTestUser()    // Set a test user in the store
   
2. Check the auth state:
   checkAuthState()    // Should show user is authenticated
   
3. Test 401 error handling:
   test401ErrorHandling()    // This will make a request that returns 401
   
4. Check auth state again:
   checkAuthState()    // User should be cleared (null)
   
5. Test the wrapper function:
   testAuthWrapperFunction()    // Should return null and clear user
   
You can also check the Network tab in DevTools to see the 401 response.
The console should show authentication session expired warnings.
  `);
}

// Make functions available globally for easy testing
if (typeof window !== "undefined") {
  (window as unknown as { authErrorTests: unknown }).authErrorTests = {
    test401ErrorHandling,
    testAuthWrapperFunction,
    setTestUser,
    checkAuthState,
    printTestInstructions,
  };

  console.log(
    "🧪 Auth error testing utilities loaded. Run authErrorTests.printTestInstructions() for help.",
  );
}
