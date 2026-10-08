# 10: Master-data

**What to build:** Add focused TypeScript unit tests for master-data that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Repository tests verify the master-data endpoint and preserve the complete response payload.
- [x] Service tests unwrap repository data and propagate repository failures.

**Scope:** `npm test -- tests/features/master-data`

**Verification:** `npm test -- tests/features/master-data`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
