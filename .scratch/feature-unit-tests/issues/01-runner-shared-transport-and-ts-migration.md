# 01: Runner, shared transport, and TypeScript test migration

**What to build:** Add focused TypeScript unit tests for runner, shared transport, and typescript test migration that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] Vitest runs only `src/**/*.test.ts` and `src/**/*.test.tsx`; normal unit tests use Node, and UI tests opt into jsdom.
- [x] The `@/*` source alias and test-only `server-only`/`client-only` stubs resolve without changing production boundaries.
- [x] Shared HTTP tests cover JSON and FormData requests, credentials, HttpError status/data, timeout handling, and caller-provided request headers.
- [x] Server transport tests cover runtime API_URL validation, request-local Cookie forwarding, no Cookie when absent, and no-store.
- [x] Port the existing profile response assertions to a TypeScript Vitest test and the media/SSR harness to `tests/media-rewrite.test.ts`; preserve all existing scenarios.
- [x] `npm test`, watch mode, and the existing `test:media-rewrite` command run the intended files.

**Scope:** Vitest foundation plus tests under `tests/shared/`; update dependencies/scripts and docs only.

**Verification:** `npm test -- tests/shared`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
