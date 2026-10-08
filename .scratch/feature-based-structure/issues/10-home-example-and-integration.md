# 10: ย้าย home/example และตรวจรวม

**What to build:** ย้าย feature ที่ระบุพร้อม caller ทั้งหมด โดยคง UI, URL, API contract และ behavior เดิม ให้ตรวจรับแยกจากงาน feature อื่นได้

**Blocked by:** 02–09: feature tickets ทั้งหมด.

**Status:** ready-for-agent

- [ ] หน้า home และ example รวม UI/actions ของ feature ตำแหน่งใหม่
- [ ] Application shell, routes, metadata และ redirects รักษาพฤติกรรมเดิมครบ
- [ ] เทียบ route inventory กับ baseline; profile/CSV/media tests, typecheck, lint และ production build ผ่าน
- [ ] อัปเดต README ให้อธิบายโครงสร้าง feature และขอบเขต app/shared/infra
