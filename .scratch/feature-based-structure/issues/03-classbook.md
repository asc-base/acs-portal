# 03: ย้าย classbook

**What to build:** ย้าย feature ที่ระบุพร้อม caller ทั้งหมด โดยคง UI, URL, API contract และ behavior เดิม ให้ตรวจรับแยกจากงาน feature อื่นได้

**Blocked by:** 01: เตรียม shared และย้าย master-data.

**Status:** ready-for-agent

- [ ] หน้า public แสดงรุ่นและลิงก์ไปนักศึกษารุ่นได้ตามเดิม
- [ ] หน้า admin และแบบฟอร์มสร้าง/แก้ไขรุ่นยังใช้ข้อมูล curriculum และรูปภาพได้
- [ ] ทุก caller ใช้โมดูล classbook ตำแหน่งใหม่ พร้อม typecheck, lint และ production build ผ่าน
