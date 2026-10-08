import { z } from "zod";

export const UserPrefixSchema = z.object({
  id: z.number(),
  sequence: z.number(),
  nameTh: z.string(),
  nameEn: z.string(),
  shortNameTh: z.string(),
  shortNameEn: z.string(),
});

export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstNameTh: z.string(),
  lastNameTh: z.string(),
  firstNameEn: z.string().nullable().optional(),
  lastNameEn: z.string().nullable().optional(),
  nickName: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  imageFocalPointX: z.number().nullable().optional(),
  imageFocalPointY: z.number().nullable().optional(),
  prefix: UserPrefixSchema.nullable().optional(),
});

export const StudentResponseSchema = UserResponseSchema.extend({
  student: z.object({
    id: z.number(),
    studentCode: z.string(),
    linkedin: z.string().nullable().optional(),
    facebook: z.string().nullable().optional(),
    instagram: z.string().nullable().optional(),
    github: z.string().nullable().optional(),
    classBookID: z.number().nullable(),
    skills: z.array(z.string()),
  }),
});

export const ProfessorResponseSchema = UserResponseSchema.extend({
  professor: z.object({
    id: z.number(),
    profRoom: z.string(),
    phone: z.string(),
    expertFields: z.array(z.string()),
    educations: z.array(z.string()),
    research_profile: z.string().nullable(),
  }),
});

export type UserPrefix = z.infer<typeof UserPrefixSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type StudentResponse = z.infer<typeof StudentResponseSchema>;
export type ProfessorResponse = z.infer<typeof ProfessorResponseSchema>;
