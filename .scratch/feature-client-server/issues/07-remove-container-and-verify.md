# 07: ลบ container และตรวจรวม

**What to build:** เมื่อ migration ทุกกลุ่มเสร็จ ให้ลบ composition root กลางและยืนยันว่า portal ทำงานครบทุกเส้นทาง.

**Blocked by:** 02–06: ย้าย feature groups และ auth.

**Status:** ready-for-agent

- [ ] ไม่มี caller import จาก container และ `apiBase` props หรือ service/repository construction เหลือใน UI
- [ ] ลบ container และ API config เดิมที่ไม่มี caller พร้อมอัปเดต README และเอกสาร auth
- [ ] Concurrent SSR requests ที่มี Cookie ต่างกันส่ง Cookie ถูกต้องแยกกัน; request ที่ไม่มี Cookie ไม่ส่ง Cookie header
- [ ] API rewrite ใน development และ proxy/admin/media paths ยังคง behavior เดิม
- [ ] TypeScript, ESLint, production build, profile/CSV/media tests และ cookie-isolation regression ผ่าน

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`; `node --test tests/profile-response-schema.test.mjs`; `node scripts/check-student-csv-schema.mjs`; `node --test tests/media-rewrite.test.mjs`.
