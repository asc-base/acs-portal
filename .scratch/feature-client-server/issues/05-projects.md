# 05: ย้าย projects

**What to build:** ย้ายรายการ รายละเอียด ตัวกรอง และแบบฟอร์ม project โดยดึง lookup ผ่าน feature services.

**Blocked by:** 01: เพิ่ม transport และ feature entrypoints.

**Status:** ready-for-agent

- [ ] Public/admin project pages โหลด data และ lookups จาก server services ต่อ request
- [ ] Create/edit/list UI ใช้ project client service และ feature client services สำหรับ mutations
- [ ] Member lookups, filters, URLs และ payloads ทำงานเดิมโดยไม่มี `apiBase` props

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`.
