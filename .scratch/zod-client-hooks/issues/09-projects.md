# 09: Project schemas and form/CRUD hooks

**What to build:** Users manage projects, memberships, tags, courses and images through one consistent schema/form hook workflow.

**Blocked by:** 04: Course schemas and form/CRUD hooks.

**Status:** ready-for-agent

- [ ] Consolidate duplicate create/update form rules and derive request/query/response types using shared user/tag/course schemas matching actual DTOs.
- [ ] Form controllers own field arrays, member role mapping, create/update diff fields, image crop/reorder and upload limits without changing validation.
- [ ] Client data hooks and list/form controllers replace direct project service calls and substantive component API/workflow functions.
- [ ] Preserve multipart serialization, member/course/tag IDs, image ordering and existing navigation/SSR behavior.
- [ ] Mapping, real DTO fixtures, image/array/error hook tests and existing tests plus TypeScript pass.
