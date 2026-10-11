# Authentication and API requests

Browser code imports auth from `src/features/auth/client.ts`. A 401 response is handled by the existing auth error handler, which clears the client auth store. Login, logout, profile initialization, and the admin route guard remain client-side.

Browser feature services call `/api` with credentials. In development, the Next.js rewrite sends `/api/:path*` to `API_URL/api/:path*`; in production, the deployment routes `/api` to the core service.

Server-rendered feature services read `API_URL` at runtime and create an HTTP helper for the current request. They forward only that request's Cookie header and set `cache: "no-store"`. Server factories must stay in `server.ts`; do not import them from browser components.

`src/proxy.ts` continues to verify the cookie-backed profile and Admin role before rendering admin pages. It does not depend on the browser auth store.

Configure the backend origin as `API_URL` in the portal runtime environment. Keep it server-side; browser requests use the same-origin `/api` path.
