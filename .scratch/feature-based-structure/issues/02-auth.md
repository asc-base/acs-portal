# 02: ย้าย auth

**What to build:** ย้าย feature ที่ระบุพร้อม caller ทั้งหมด โดยคง UI, URL, API contract และ behavior เดิม ให้ตรวจรับแยกจากงาน feature อื่นได้

**Blocked by:** 01: เตรียม shared และย้าย master-data.

**Status:** ready-for-agent

- [ ] Login, logout, forget password และ reset password ทำงานตามเส้นทางเดิม
- [ ] Session initialization, auth store, error handling และ admin guard รักษาสิทธิ์และ redirect เดิม
- [ ] ทดสอบ schema ที่เกี่ยวข้องพร้อม typecheck, lint และ production build ผ่าน
