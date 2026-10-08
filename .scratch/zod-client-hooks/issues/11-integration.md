# 11: Remaining model migration and integration verification

**What to build:** Finish the active portal migration and verify all public/admin workflows compile and pass the agreed checks together.

**Blocked by:** 02–10: All feature migration tickets.

**Status:** ready-for-agent

- [ ] Example model validates its API data with a Zod-derived type and keeps existing server-only behavior, with focused boundary coverage.
- [ ] Search all active production callers: no UI component directly imports feature service instances or owns substantive migrated API/form/controller logic; adapt leftover compiled callers.
- [ ] Remove duplicate declarations and code made unused by this migration only after confirming callers; update fixtures and README for schema/client-hook conventions.
- [ ] Complete integration fixes while preserving API, SSR/cookie isolation, multipart, auth/session and business validation behavior.
- [ ] Full Vitest suite, TypeScript, lint, production build and media/SSR integration checks pass; report environmental limitations accurately for the root's final Sol High review.
