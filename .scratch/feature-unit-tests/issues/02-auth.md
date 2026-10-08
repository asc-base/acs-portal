# 02: Auth

**What to build:** Add focused TypeScript unit tests for auth that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Auth and reset-password schemas accept valid requests and reject malformed email/password combinations with the existing field errors.
- [x] Repository/service tests cover login/profile/reset/logout paths, payloads, result unwrapping, null profiles, and current 401 versus non-401 handling.
- [x] `useLogin` waits for login before loading the profile; failed login, null profile, and profile rejection follow current behavior.
- [x] The real store and role helper distinguish admin, non-admin, and null users; guard tests cover pending visibility, redirects, clearing/replacing store state, and unmount.
- [x] Use deferred promises and router/service mocks; keep the manual auth utility under `tests/features/auth/manual` outside Vitest discovery.

**Scope:** `npm test -- tests/features/auth`

**Verification:** `npm test -- tests/features/auth`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
