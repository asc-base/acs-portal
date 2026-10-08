# 06: Professor schemas and form/CRUD hooks

**What to build:** Users create, edit, search and delete professors with validated profiles, field arrays and images managed by hooks.

**Blocked by:** 01: Shared schemas and Master Data hooks.

**Status:** ready-for-agent

- [ ] Reuse existing professor/user response schemas; derive form/request/query data types and validate boundaries without changing business rules.
- [ ] Feature client hooks and form/list controllers replace direct service calls and substantive component workflow functions.
- [ ] Preserve education/expertise field arrays, string-array request mapping, optional names, image/focal-point serialization and confirmation/navigation.
- [ ] Mutation errors reach hook/UI error state; public SSR profile/list callers remain compatible.
- [ ] Focused field-array/multipart/hook/error tests, existing tests and TypeScript pass.
