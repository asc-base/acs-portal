# 08: Student CSV import controller hooks

**What to build:** Users import, preview, edit and submit student CSV data through hooks while duplicate detection and retry behavior remain intact.

**Blocked by:** 07: Student and profile schemas/hooks.

**Status:** ready-for-agent

- [ ] Reuse existing CSV schemas, preview store and the student batch mutation; schema-derived input types replace duplicated row declarations.
- [ ] Move substantive CSV parse/edit/preview/submit/duplicate/error orchestration from active components into feature controller hooks.
- [ ] Preserve row errors, duplicate-code rejection, classbook selection, editable preview, progress modal and failure retry behavior.
- [ ] A successful batch endpoint returning null is treated as success; failures retain data for correction/retry and do not duplicate requests.
- [ ] CSV/controller/hook tests and relevant existing tests plus TypeScript pass.
