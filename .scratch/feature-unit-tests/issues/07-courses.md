# 07: Courses

**What to build:** Add focused TypeScript unit tests for courses that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas cover required course fields, English/Thai names, credits, typeCourseID, and optional prerequisites.
- [x] Repository tests cover filters including `prerequisite: false`, zero-valued pagination params, URL query construction, response parsing, and batch upload field.
- [x] Service tests cover create/update/get/delete result unwrapping and batch FormData.

**Scope:** `npm test -- tests/features/courses`

**Verification:** `npm test -- tests/features/courses`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
