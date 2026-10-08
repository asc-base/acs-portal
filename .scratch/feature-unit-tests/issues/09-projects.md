# 09: Projects

**What to build:** Add focused TypeScript unit tests for projects that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schema tests cover required metadata, valid URLs, and nonempty people/category/type/course arrays at current limits.
- [x] Repository tests cover repeated filter query keys, ordering/encoding, CRUD methods, and response parsing.
- [x] Service tests inspect create/update JSON FormData fields, repeated image assets, optional thumbnail, and result propagation.

**Scope:** `npm test -- tests/features/projects`

**Verification:** `npm test -- tests/features/projects`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
