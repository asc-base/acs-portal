import { z } from "zod";
import { CommonUserSchema } from "@/shared/schema/user";
import { StudentResponseSchema } from "@/shared/schema/profile-response";
import { CreateStudentCsvSchema } from "@/features/students/schema/student-csv";

const optionalSocialLink = (hostname: RegExp, message: string) =>
    z.string().trim().pipe(
        z.union([
            z.literal(""),
            z.url({ protocol: /^https?$/, hostname, error: message }),
        ], { error: message }),
    ).optional();

export const CommonStudentSchema = z.object({
    studentCode: z.string().trim().max(11, "กรุณากรอกรหัสนักศึกษาให้ครบ 11 หลัก").regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
    facebook: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    github: z.string().trim().optional(),
    skills: z.array(z.string()).optional(),
    imageFocalPointX: z.number().optional(),
    imageFocalPointY: z.number().optional(),
});

export const CreateStudentFormSchema = z.object({
    prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
    ...CommonUserSchema.shape,
    ...CommonStudentSchema.shape,
    facebook: optionalSocialLink(
        /^(?:[a-z0-9-]+\.)*facebook\.com$/i,
        "กรุณากรอกลิงก์ Facebook ให้ถูกต้อง เช่น https://www.facebook.com/username",
    ),
    instagram: optionalSocialLink(
        /^(?:[a-z0-9-]+\.)*instagram\.com$/i,
        "กรุณากรอกลิงก์ Instagram ให้ถูกต้อง เช่น https://www.instagram.com/username",
    ),
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export const UpdateStudentFormSchema = z.object({
    prefixID: z.number().nullable().refine((v) => v !== null, { message: "กรุณาเลือกคำนำหน้าชื่อ" }),
    ...CommonUserSchema.shape,
    ...CommonStudentSchema.shape,
    // otherProjects: z
    //   .array(
    //     z.object({
    //       value: z.string().trim(),
    //     }),
    //   )
    //   .optional(),
});

export const CreateStudentSchema = CreateStudentFormSchema;
export const UpdateStudentSchema = UpdateStudentFormSchema;

export const CreateStudentRequestSchema = CreateStudentFormSchema.extend({
    classBookID: z.number(),
    imageFile: z.file().nullable().optional(),
    firstNameEn: CreateStudentFormSchema.shape.firstNameEn.nullable(),
    lastNameEn: CreateStudentFormSchema.shape.lastNameEn.nullable(),
    imageFocalPointX: z.number().nullable().optional(),
    imageFocalPointY: z.number().nullable().optional(),
});

export const UpdateStudentFieldsSchema = UpdateStudentFormSchema.partial();

export const UpdateStudentRequestSchema = UpdateStudentFieldsSchema.extend({
    classBookID: z.number(),
    imageFile: z.file().nullable().optional(),
    prefixID: z.number().nullable().optional(),
    firstNameEn: UpdateStudentFormSchema.shape.firstNameEn.nullable(),
    lastNameEn: UpdateStudentFormSchema.shape.lastNameEn.nullable(),
    facebook: UpdateStudentFormSchema.shape.facebook.nullable(),
    linkedin: UpdateStudentFormSchema.shape.linkedin.nullable(),
    instagram: UpdateStudentFormSchema.shape.instagram.nullable(),
    github: UpdateStudentFormSchema.shape.github.nullable(),
    imageFocalPointX: z.number().nullable().optional(),
    imageFocalPointY: z.number().nullable().optional(),
});

export const StudentProfileFormSchema = UpdateStudentFormSchema.pick({
    facebook: true,
    linkedin: true,
    instagram: true,
    github: true,
    skills: true,
});

const queryNumber = z
    .union([z.number(), z.string()])
    .transform(Number)
    .pipe(z.number());

export const QueryStudentSchema = z.object({
    page: queryNumber.optional(),
    pageSize: queryNumber.optional(),
    classBookID: queryNumber.optional(),
    search: z.string().optional(),
    orderBy: z.string().optional(),
    sortBy: z.enum(["asc", "desc"]).optional(),
});
export const StudentSearchSchema = QueryStudentSchema.pick({ search: true });

export const StudentPageSchema = z.object({
    rows: StudentResponseSchema.array(),
    totalRecords: z.number(),
    page: z.number(),
    pageSize: z.number(),
});
export const StudentBatchResponseSchema = z.null();
export const StudentIdSchema = z.number();

export const CreateStudentBatchRequestSchema = z.object({
    classBookID: z.number(),
}).and(z.union([
    z.object({ file: z.file() }),
    z.object({ students: CreateStudentCsvSchema.array() }),
]));

export type CreateStudentInputs = z.input<typeof CreateStudentFormSchema>;
export type UpdateStudentInputs = z.input<typeof UpdateStudentFormSchema>;
export type CreateStudentFormInput = z.input<typeof CreateStudentFormSchema>;
export type UpdateStudentFormInput = z.input<typeof UpdateStudentFormSchema>;
export type CreateStudentRequest = z.output<typeof CreateStudentRequestSchema>;
export type UpdateStudentRequest = z.output<typeof UpdateStudentRequestSchema>;
export type StudentProfileFormInput = z.input<typeof StudentProfileFormSchema>;
export type QueryStudentInput = z.input<typeof QueryStudentSchema>;
export type QueryStudent = z.output<typeof QueryStudentSchema>;
export type StudentSearch = z.input<typeof StudentSearchSchema>;
export type StudentPage = z.infer<typeof StudentPageSchema>;
export type StudentBatchResponse = z.infer<typeof StudentBatchResponseSchema>;
export type StudentId = z.infer<typeof StudentIdSchema>;
export type CreateStudentBatchRequest = z.output<typeof CreateStudentBatchRequestSchema>;
