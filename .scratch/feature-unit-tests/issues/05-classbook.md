# 05: Classbook

**What to build:** Add focused TypeScript unit tests for classbook that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Schemas accept valid class/year values and reject nondigits, wrong year length, and invalid curriculum IDs.
- [x] Repository tests cover query defaults/filters, encoded search, response parsing, and missing book results.
- [x] Service tests inspect create/update FormData including optional thumbnail handling and verify create/update/delete error results remain null.

**Scope:** `npm test -- tests/features/classbook`

**Verification:** `npm test -- tests/features/classbook`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
