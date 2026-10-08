# 10: News, bulletins and Home schema/hook migration

**What to build:** Users manage news and bulletin visibility with schema-validated hooks while public news and Home render the same content.

**Blocked by:** 01: Shared schemas and Master Data hooks.

**Status:** ready-for-agent

- [ ] News/request/query/response/bulletin types derive from schemas matching actual DTOs, including nullable dates/images/category data and legacy fields that active consumers need.
- [ ] News form/list controllers own submit/default/reset mapping, multipart image/crop/order state, confirmations and filters; client hooks replace active direct service calls.
- [ ] Bulletin hook handles loading, search, pagination, membership toggles, pending/error state and cache invalidation without reviving obsolete routes.
- [ ] Public news and Home callers/fixtures adapt to JSON date and optionality types without changing carousel/UI business behavior.
- [ ] Boundary/multipart/bulletin/form/error regressions plus existing tests and TypeScript pass; no silent null mutation success.
