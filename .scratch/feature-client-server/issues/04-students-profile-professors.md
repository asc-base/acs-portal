# 04: ย้าย students, profile และ professors

**What to build:** ย้ายหน้ารายชื่อ ข้อมูลบุคคล การแก้ profile และ CSV import ไปใช้ service ของ students/professors.

**Blocked by:** 01: เพิ่ม transport และ feature entrypoints.

**Status:** ready-for-agent

- [ ] Public/student profile และ admin pages ใช้ server entrypoints สำหรับ initial data และ client entrypoints สำหรับ mutations
- [ ] CRUD, pagination, search, image operations, shared prefix data, CSV validation/preview/import ทำงานตามเดิม
- [ ] ลบ `apiBase` props และการประกอบ repository จาก component; auth/session behavior ที่เกี่ยวข้องยังทำงาน

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`; `node --test tests/profile-response-schema.test.mjs`; `node scripts/check-student-csv-schema.mjs`.
