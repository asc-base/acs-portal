# 401 Authentication Error Handling

This project now includes comprehensive handling for HTTP 401 Unauthorized errors. When authentication fails, the system automatically:

1. **Detects 401 errors** from API responses
2. **Clears the authentication state** in the store
3. **Provides consistent error handling** across the application

## Components Added/Modified

### 1. Enhanced HTTP Helper (`src/lib/http.ts`)

- Added custom `HttpError` class with status and data properties
- Enhanced error handling to preserve HTTP status codes
- Added `isUnauthorized()` method for easy 401 detection

### 2. Authentication Error Handler (`src/lib/auth-error-handler.ts`)

- Singleton class for centralized auth error handling
- Automatically clears user state on 401 errors
- Provides wrapper functions for API calls
- Can be extended to redirect to login page

### 3. React Hook (`src/hooks/useAuthErrorHandler.ts`)

- Custom hook for handling auth errors in React components
- Provides `withAuthErrorHandling` wrapper for API calls
- Higher-order function `withAuth` for wrapping API functions

### 4. Updated Authentication Repository (`src/infra/repositories/auth.repository.ts`)

- Uses the new error handler for the `/v2/auth/me` endpoint
- Properly handles 401 responses and clears state

### 5. Enhanced Initial Load (`src/initial-load.tsx`)

- Added try-catch for better error handling
- Ensures user state is cleared on any initialization error

## Usage Examples

### In a React Component

```tsx
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";

function MyComponent() {
  const { withAuthErrorHandling } = useAuthErrorHandler();

  const fetchUserData = async () => {
    const result = await withAuthErrorHandling(async () => {
      return await apiService.getUserProfile();
    });

    if (result === null) {
      // 401 error occurred, user was logged out automatically
      console.log("User was logged out due to authentication error");
    }
  };
}
```

### Wrapping API Functions

```tsx
import { withAuth } from "@/hooks/useAuthErrorHandler";

// Wrap an API function
const protectedApiCall = withAuth(apiService.getProtectedData);

// Use it - returns null if 401 error occurs
const data = await protectedApiCall();
```

### Manual Error Handling

```tsx
import { authErrorHandler } from "@/lib/auth-error-handler";

try {
  const response = await fetch("/api/protected");
  // ... handle response
} catch (error) {
  if (authErrorHandler.handleAuthError(error)) {
    // 401 error was handled, user logged out
    return;
  }
  // Handle other errors
}
```

## Configuration

### Environment Variables

Make sure your API URL is correctly configured:

```env
API_URL=http://localhost:8000
```

Note: Your current `.env` file has `localhost:8000`, while `.env.example` shows `localhost:8080`. Make sure this matches your backend server.

### Adding Login Redirect (Optional)

To automatically redirect to login page on 401 errors, uncomment and modify this section in `auth-error-handler.ts`:

```typescript
// if (typeof window !== "undefined") {
//   window.location.href = "/auth/login";
// }
```

## How It Works

1. **API Request**: When any API request returns 401 Unauthorized
2. **Error Detection**: The `HttpError` class captures the status code
3. **Handler Invocation**: The `AuthErrorHandler` detects the 401 status
4. **State Cleanup**: Zustand store is automatically cleared
5. **Optional Redirect**: Can redirect to login page if configured

## Benefits

- **Consistent Behavior**: All 401 errors are handled the same way
- **Automatic Cleanup**: No need to manually clear auth state
- **Type Safety**: TypeScript support with proper error typing
- **Flexible Usage**: Can be used in components, services, or repositories
- **No Breaking Changes**: Existing code continues to work

## Testing

To test the 401 error handling:

1. Make sure your backend is running and returns 401 for `/v2/auth/me`
2. Open the application - you should see the error logged
3. Check that the user state is cleared in the auth store
4. Verify that subsequent requests don't include stale auth data

The system will now properly handle authentication errors and provide a better user experience.
