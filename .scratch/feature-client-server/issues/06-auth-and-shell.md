# 06: ย้าย auth และ application shell

**What to build:** ย้าย browser authentication callers ไปใช้ auth client boundary และคงการ sign in/session/admin guard เดิม.

**Blocked by:** 01: เพิ่ม transport และ feature entrypoints.

**Status:** ready-for-agent

- [ ] Auth client service ใช้ `client-only` boundary และรักษา login/logout, 401 store clearing, initialization และ admin guard behavior
- [ ] Application shell เรียก feature entrypoints ที่เหมาะสม โดย route URLs และ admin sign-in exception คงเดิม
- [ ] Proxy ยังคงตรวจ admin role และส่ง Cookie ให้ profile endpoint เดิม

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`; verify login/logout, expired session, admin access and redirect behavior.
