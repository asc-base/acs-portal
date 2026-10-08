# 05: Classbook schemas and hooks

**What to build:** Users manage classbooks and edit classbook details on the student screen through typed form/CRUD hooks.

**Blocked by:** 03: Curriculum schemas and controller hooks.

**Status:** ready-for-agent

- [ ] Classbook form/request/query/response models derive from schemas, reusing shared fields without tightening current validation.
- [ ] Client hooks replace all direct classbook service callers, including the classbook editor located in the students feature.
- [ ] Form/list hooks own curriculum selection, image/crop state, payload mapping, confirmation and URL/search behavior.
- [ ] Keep multipart contracts and SSR refresh behavior; failed mutations reject rather than produce success/null ambiguity.
- [ ] Boundary, multipart and controller/hook regressions plus existing tests and TypeScript pass.
