# 04: Course schemas and form/CRUD hooks

**What to build:** Users manage courses and prerequisites with typed hooks while public/server-rendered course lists continue to work.

**Blocked by:** 03: Curriculum schemas and controller hooks.

**Status:** ready-for-agent

- [ ] Course form/request/query/response types derive from Zod and reuse curriculum/master-data schemas; prerequisite summaries match the real DTO.
- [ ] Preserve RHF prerequisite object arrays and explicitly map to existing request ID/diff fields inside form hooks.
- [ ] Create/edit/delete/list controller logic moves to hooks and all course service UI callers migrate to the client hooks.
- [ ] Existing validation, filtering, serialization and SSR behavior remain unchanged; JSON dates and fixtures are accurate.
- [ ] Request/response, prerequisite mapping, hook failure and existing feature tests plus TypeScript pass.
