import z from "zod";
import { CommonUserFields } from "./user";

export const CommonProfessorFields = z.object({
  phone: z.string().trim().regex(/^0[0-9]{8,9}$/, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก และขึ้นต้นด้วย 0"),
  profRoom: z.string().trim().min(1, "กรุณากรอกชื่อห้อง"),
});

export const CreateProfessorSchema = z.object({
  academicPositionID: z.number().nullable().refine((v) => v !== null, {message: "กรุณากรอกตำแหน่ง",}),
  educations: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  expertFields: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  ...CommonUserFields.shape,
  ...CommonProfessorFields.shape,
});


export const UpdateProfessorSchema = z.object({
  academicPositionID: z.number().min(1, "กรุณากรอกตำแหน่ง"),
  educations: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  expertFields: z.array(z.object({value: z.string().trim().min(1, "กรุณากรอกข้อมูล"),}),),
  ...CommonUserFields.shape,
  ...CommonProfessorFields.shape,
});

export type CommonProfessorInputs = z.infer<typeof CommonProfessorFields>;
export type CreateProfessorInputs = z.infer<typeof CreateProfessorSchema>;
export type UpdateProfessorInputs = z.infer<typeof UpdateProfessorSchema>;