# 01: เตรียม shared และย้าย master-data

**What to build:** ย้าย feature ที่ระบุพร้อม caller ทั้งหมด โดยคง UI, URL, API contract และ behavior เดิม ให้ตรวจรับแยกจากงาน feature อื่นได้

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] ตัวเรียก lookup ทั้งหน้า public และ admin ใช้ master-data จาก feature ใหม่ได้ครบ
- [ ] HTTP helper, common schema/response, shared types, reusable components และ theme ทำงานจากตำแหน่งใหม่
- [ ] API constants ยังให้ค่า browser/server และ exports เดิม พร้อม typecheck, lint และ production build ผ่าน
