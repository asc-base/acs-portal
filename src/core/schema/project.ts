import { z } from "zod";
export const updateProjectSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกหัวข้อ"),
  details: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("กรุณากรอกลิงก์ YouTube ให้ถูกต้อง (ต้องเป็น URL)"),
  githubURL: z.string().trim().url("กรุณากรอกลิงก์ Github ให้ถูกต้อง (ต้องเป็น URL)"),
  documentURL: z.string().trim().url("กรุณากรอกลิงก์ Document ให้ถูกต้อง (ต้องเป็น URL)"),
  presentationURL: z.string().trim().url("กรุณากรอกลิงก์ Presentation ให้ถูกต้อง (ต้องเป็น URL)"),
  projectCourses: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกวิชา") })).min(1, "กรุณาเลือกวิชาอย่างน้อย 1 วิชา"),
  projectTypes: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกประเภท") })).min(1, "กรุณาเลือกประเภทอย่างน้อย 1 ประเภท"),
  projectCategories: z.array(z.object({ value: z.number().min(1, "กรุณาเลือกหมวดหมู่") })).min(1, "กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวดหมู่"),
  techStacks: z.array(z.object({ value: z.string().trim().min(1, "ระบุ Tech Stack") })).min(1, "ระบุอย่างน้อย 1 Tech Stack"),
  students: z.array(
    z.object({
      userID: z.number().min(1, "กรุณาเลือกนักศึกษา"),
    })
  ).min(1, "กรุณาเพิ่มผู้จัดทำอย่างน้อย 1 คน"),
  advisors: z.array(
    z.object({
      userID: z.number().min(1, "กรุณาเลือกอาจารย์"),
    })
  ).min(1, "กรุณาเพิ่มอาจารย์ที่ปรึกษาอย่างน้อย 1 คน"),
  thumbnailFocalPointX: z.number().optional(),
  thumbnailFocalPointY: z.number().optional(),
});

export type ProjectFormValues = z.infer<typeof updateProjectSchema>;