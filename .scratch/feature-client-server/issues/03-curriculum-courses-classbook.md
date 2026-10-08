# 03: ย้าย curriculum, courses และ classbook

**What to build:** ย้ายหน้าและแบบฟอร์มด้านหลักสูตร รายวิชา และทำเนียบรุ่นไปใช้ feature services ตาม runtime.

**Blocked by:** 01: เพิ่ม transport และ feature entrypoints.

**Status:** ready-for-agent

- [ ] Public และ admin pages โหลดข้อมูลเริ่มต้นด้วย feature server services
- [ ] Client forms, lists, prerequisites และ related lookups ใช้ client services โดยตรง
- [ ] หน้าและ component ไม่ส่ง `apiBase` เพื่อประกอบ repository; URLs, filters และ response props เดิมทำงาน

**Verification:** `./node_modules/.bin/tsc --noEmit --incremental false`; `npm run lint`; `npm run build`.
