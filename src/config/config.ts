export const API_URL = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_URL || "https://acs-dev.service.narutchai.com";
  if (!raw || raw === "undefined" || raw === "null") {
    return "http://localhost:8080";
  }
  return raw;
})();
