# 02: Auth schemas, form hooks and current session

**What to build:** Users sign in, sign out and reset passwords through typed form/hooks; admin UI is displayed only after the current server session is verified.

**Blocked by:** 01: Shared schemas and Master Data hooks.

**Status:** ready-for-agent

- [ ] Auth form/request/profile/query data derives from shared and feature Zod schemas; repository responses are parsed without changing auth endpoint fields or messages.
- [ ] Login/logout/current-user/forget/reset operations use public client hooks and auth form/controller hooks; migrate navbar, sidebar, initial loader, guard and the auth portion of student profile loading.
- [ ] Current server profile, rather than cached or persisted roles, gates admin UI; unmount, unauthenticated and malformed profile failures deny access safely.
- [ ] Successful account changes/logout cancel and clear private query cache and maintain existing store/redirect behavior; failed requests can be retried and do not remain pending.
- [ ] No UI callers directly import the auth service; session/profile/cache/form regression tests and TypeScript pass.
