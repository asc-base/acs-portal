import { z } from "zod";

const documentURLField = z
  .string()
  .trim()
  .min(1, "กรุณาระบุลิงก์ไฟล์หลักสูตร")
  .refine((url) => {
    try {
      const hostname = new URL(url).hostname;
      return (
        hostname === "drive.google.com" ||
        hostname === "docs.google.com" ||
        hostname === "1drv.ms" ||
        hostname === "onedrive.live.com" ||
        hostname.endsWith(".sharepoint.com")
      );
    } catch {
      return false;
    }
  }, "อนุญาตเฉพาะลิงก์จาก Google Drive, OneDrive หรือ SharePoint เท่านั้น");

export const CurriculumSchema = z.object({
  title: z.string().trim().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  documentURL: documentURLField,
  description: z.string().trim().min(1, "กรุณาระบุรายละเอียด"),
});

export const CurriculumInfoSchema = z.object({
  title: z.string().trim().min(1, "กรุณาระบุชื่อหลักสูตร"),
  year: z.string().min(1, "กรุณาระบุปีการศึกษา"),
  documentURL: documentURLField,
  description: z.string().trim().min(1, "กรุณาระบุรายละเอียด"),
});

export type CurriculumInfoSchemaType = z.infer<typeof CurriculumInfoSchema>;
export type CurriculumSchemaType = z.infer<typeof CurriculumSchema>;