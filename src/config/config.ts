export const API_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  // Normalize common bad values and empty strings
  if (!raw || raw === "undefined" || raw === "null") {
    return "http://localhost:8080";
  }
  return raw;
})();

// Warn if API_URL is not set properly in production
if (
  (!process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL === "undefined" ||
    process.env.NEXT_PUBLIC_API_URL === "null") &&
  process.env.NODE_ENV === "production"
) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_URL is missing or invalid. Falling back to http://localhost:8080.",
  );
}
