# 06: Curriculum

**What to build:** Add focused TypeScript unit tests for curriculum that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas accept and reject document URLs, required create fields, and partial update fields at existing boundaries.
- [x] Repository tests cover year/pagination queries, response parsing, null lookup, and request paths.
- [x] Service tests inspect create/update FormData, optional thumbnail file, omitted null/undefined update fields, and response unwrapping.

**Scope:** `npm test -- tests/features/curriculum`

**Verification:** `npm test -- tests/features/curriculum`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
