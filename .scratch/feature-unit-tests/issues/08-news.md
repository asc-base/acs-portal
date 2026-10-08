# 08: News

**What to build:** Add focused TypeScript unit tests for news that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas cover create/update required fields, optional images, event dates, and existing image limits.
- [x] Service tests inspect create/update multipart mapping, image ordering/deletion metadata, focal points including zero, and current null/error behavior.
- [x] Repository tests cover encoded news filters and bulletin enable/disable request shape; image selection/fallback follows current highlight/announcement rules.
- [x] `NewsBulletinManager` tests initial loading, search submit/pagination, pending toggle, success, and failure/retry using deferred service mocks.
- [x] Record existing editor/query bugs separately; do not assert them as desired behavior or modify production code in this ticket.

**Scope:** `npm test -- tests/features/news`

**Verification:** `npm test -- tests/features/news`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
