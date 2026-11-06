import "server-only";

export function getServerApiOrigin() {
  const apiUrl = process.env.API_URL?.replace(/\/+$/, "");
  if (!apiUrl) throw new Error("API_URL must be set for server API requests.");
  return apiUrl;
}
