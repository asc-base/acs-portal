# 02: ย้าย news, master-data และ home

**What to build:** ย้าย SSR ข่าว/lookup และ client operations ของ news, master-data และ home ไปใช้ feature entrypoints.

**Blocked by:** 01: เพิ่ม transport และ feature entrypoints.

**Status:** ready-for-agent

- [ ] หน้าข่าวและ home โหลด initial data ผ่าน server entrypoints พร้อมรักษา query, fallback และ response props เดิม
- [ ] Client news forms, CRUD, bulletins, highlight และ announcement เรียก client service ผ่าน `/api` โดยไม่รับ `apiBase`
- [ ] Master-data callers ของ public/admin ใช้ feature client หรือ server ตาม runtime ที่เรียก

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`.
