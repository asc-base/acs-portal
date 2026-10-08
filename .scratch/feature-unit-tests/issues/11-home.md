# 11: Home

**What to build:** Add focused TypeScript unit tests for home that verify behavior at its service, repository/schema, or important UI boundary without changing production behavior.

**Blocked by:** 01: Runner and shared transport.

**Status:** done

- [x] Home-page tests cover responsive navigation at 767/768/1279/1280 widths, category independence, empty states, and link targets.
- [x] Carousel tests cover empty/one/multiple items, indicator interaction, autoplay, wraparound, option flags, and timer cleanup.
- [x] Highlight carousel tests cover ordering, rotation/reset, timer cleanup, and image-source fallbacks.
- [x] Route tests invoke the async page and verify news calls, props/fallback mapping, and independent request failures without rendering a server component through RTL.
- [x] Record the unused ReviewCarousel and observed edge cases as known issues; do not change application behavior.

**Scope:** `npm test -- tests/features/home`

**Verification:** `npm test -- tests/features/home`; `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`.
