# 12: Example

**What to build:** Add focused TypeScript unit tests for example that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Model tests cover the requested URL, successful posts, non-OK error results, and network rejection.
- [x] Viewmodel and Server Action tests cover result forwarding and thrown-error behavior without network access.

**Scope:** `npm test -- tests/features/example`

**Verification:** `npm test -- tests/features/example`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
