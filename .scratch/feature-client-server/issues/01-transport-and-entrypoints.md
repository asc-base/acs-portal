# 01: เพิ่ม transport และ feature entrypoints

**What to build:** ทำให้ browser และ server เรียก API ผ่าน feature-owned services ได้ พร้อมรักษาหน้าเดิมระหว่างทยอยย้าย callers.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Browser clients ของ news, master-data, curriculum, courses, classbook, students, professors และ projects ใช้ service ของ feature ผ่าน `/api`
- [ ] Server factories สร้าง repository/service ใหม่ต่อการเรียก และแนบเฉพาะ Cookie ของ request ปัจจุบันกับ backend request
- [ ] Server requests ใช้ runtime `API_URL` และ `cache: "no-store"`; เมื่อไม่มี Cookie จะไม่ส่ง Cookie header และ browser bundle ไม่มี server-only code
- [ ] ชนิดข้อมูล, service/repository/port contracts และการสร้าง repository แบบส่ง base URL เดิมยังทำงาน

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`.
