# 04: Professors

**What to build:** Add focused TypeScript unit tests for professors that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas cover required prefix/education/expert fields, Thai/English names, phone formats, and optional HTTP(S) research URLs.
- [x] Repository/service tests inspect create/update multipart fields and optional images, unwrap successful data, and preserve current catch-to-null behavior.
- [x] Profile response tests cover the professor fields and reject the old nested response shape.

**Scope:** `npm test -- tests/features/professors`

**Verification:** `npm test -- tests/features/professors`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
