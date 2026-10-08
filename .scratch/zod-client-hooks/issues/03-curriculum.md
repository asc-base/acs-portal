# 03: Curriculum schemas and controller hooks

**What to build:** Users search, create, edit and delete curricula through schema-validated hooks, including the curriculum editor displayed on the courses screen.

**Blocked by:** 01: Shared schemas and Master Data hooks.

**Status:** ready-for-agent

- [ ] Curriculum form/request/query/response types derive from Zod; service inputs and repository outputs are parsed, preserving existing validation and null absence.
- [ ] Client data hooks replace all curriculum service UI callers, including read selectors in classbook forms.
- [ ] Form/list/controller hooks own mapping, year conversion, thumbnail/crop, confirmation, submit and URL/search behavior; components retain rendering and simple adapters.
- [ ] Serialization and SSR refresh/navigation behavior are unchanged; mutation failures reject without showing success.
- [ ] Schema, multipart, hook/controller and relevant existing tests plus TypeScript pass.
