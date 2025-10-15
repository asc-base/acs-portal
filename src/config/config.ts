export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Warn if API_URL is not set in production
if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL environment variable is not set. Using default localhost URL.",
  );
}
