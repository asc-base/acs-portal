# 01: Shared schemas and Master Data hooks

**What to build:** Browser forms load valid master data through one reusable query hook, with shared schema-derived user/reference data instead of duplicate model definitions.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Shared user/reference and master-data data types derive from Zod, preserving existing imports and real DTO optionality.
- [ ] Master-data repository parses API data; useMasterData is exposed by the client entrypoint and replaces all direct master-data service imports in active form callers.
- [ ] Existing dropdowns handle loading/error without changing choices, defaults or requiring repeated component fetch functions.
- [ ] Existing server entrypoint, transport envelope and business validation remain compatible; JSON date fixtures match actual DTOs.
- [ ] Focused schema/repository/hook tests, relevant existing tests and TypeScript pass.
