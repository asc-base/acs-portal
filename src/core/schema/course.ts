import z from "zod";

export const CreateCourseSchema = z.object({
  typeCourseID: z.number().min(1, "กรุณาเลือกกลุ่มวิชา"),
  courseCode: z.string().trim().min(1, "กรุณากรอกรหัสวิชา"),
  credits: z.string().trim().min(1, "กรุณากรอกหน่วยกิต"),
  courseNameEn: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาอังกฤษ")
    .regex(/^[A-Za-z0-9\s()/-]+$/, "กรุณากรอกชื่อวิชาเป็นภาษาอังกฤษ"),
  courseNameTh: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาไทย")
    .regex(/^[\p{Script=Thai}0-9\s()/-]+$/u, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  detail: z.string().trim().min(1, "กรุณากรอกลักษณะการเรียน"),
  preCoursesID: z.array(
    z.object({
      id: z.number().optional(),
    }),
  ),
});

export const UpdateCourseSchema = z.object({
  typeCourseID: z.number().min(1, "กรุณาเลือกกลุ่มวิชา"),
  courseCode: z.string().trim().min(1, "กรุณากรอกรหัสวิชา"),
  credits: z.string().trim().min(1, "กรุณากรอกหน่วยกิต"),
  courseNameEn: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาอังกฤษ")
    .regex(/^[A-Za-z0-9\s()/-]+$/, "กรุณากรอกชื่อวิชาเป็นภาษาอังกฤษ"),
  courseNameTh: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อวิชาภาษาไทย")
    .regex(/^[\p{Script=Thai}0-9\s()/-]+$/u, "กรุณากรอกเป็นภาษาไทยเท่านั้น"),
  detail: z.string().trim().min(1, "กรุณากรอกลักษณะการเรียน"),
  preCoursesID: z
    .array(
      z.object({
        id: z.number().optional(),
      }),
    )
    .optional(),
});

export type CreateCourseSchemaType = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseSchemaType = z.infer<typeof UpdateCourseSchema>;
