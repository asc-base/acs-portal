# 07: Student and profile schemas/hooks

**What to build:** Users manage students and edit their authenticated profile through validated CRUD/form hooks rather than component API functions.

**Blocked by:** 02: Auth schemas, form hooks and current session.

**Status:** ready-for-agent

- [ ] Student request/query/form types derive from Zod and reuse the existing student response schema; service/repository boundaries validate data.
- [ ] Student client hooks expose CRUD, user-specific profile lookup and batch-import mutation for ticket 08, preserving legitimate null batch success.
- [ ] Create/edit/profile/list controllers own payload/default/reset mapping, skills, crop/file state, confirmations and substantive URL behavior; classbook editor remains owned by ticket 05.
- [ ] Profile loading waits for current session and preserves auth redirects without showing stale cached user data; mutation failure never displays success.
- [ ] Preserve validation rules, multipart fields and existing CSV store/schema behavior; meaningful profile/form/hook tests and TypeScript pass.
