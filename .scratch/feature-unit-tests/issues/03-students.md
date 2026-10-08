# 03: Students

**What to build:** Add focused TypeScript unit tests for students that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas cover valid and invalid student/profile fields, social URLs, focal points, student code, email, and CSV row data.
- [x] Service tests inspect create/update/batch FormData, optional images and values, repeated skills, CSV quote/comma/newline escaping, and classBookID.
- [x] Response parsing rejects malformed shapes; update errors retain the existing null result, while repository failures in other methods propagate.
- [x] Preview-store tests cover persistence, clearing, and deleting the selected duplicate by studentCode plus row index.
- [x] Port the existing CSV assertions into TypeScript and remove the standalone `.mjs` checker after preserving its cases.

**Scope:** `npm test -- tests/features/students`

**Verification:** `npm test -- tests/features/students`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
