import { z } from "zod";
import dayjs from "dayjs";
import { NewsCategorySchema, TagSchema } from "@/shared/schema/references";
import { PageMetadataSchema } from "@/shared/schema/page-metadata";

export const NewsImageSchema = z.object({
  id: z.number(),
  imageID: z.number(),
  imageType: z.enum(["CARD", "THUMBNAIL", "DETAIL"]),
  imageUrl: z.string(),
  focalPointX: z.number().nullable(),
  focalPointY: z.number().nullable(),
  sortOrder: z.number(),
});

const NewsAdditionalImageSchema = z.object({
  id: z.number(),
  newsID: z.number().optional(),
  imageUrl: z.string(),
});

export const NewsResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnailURL: z.string().nullable(),
  highlightURL: z.string().nullable().optional(),
  detail: z.string(),
  startDate: z.string(),
  dueDate: z.string().nullable().optional(),
  eventStartAt: z.string().nullable().optional(),
  eventEndAt: z.string().nullable().optional(),
  category: NewsCategorySchema.nullable().optional(),
  tag: TagSchema.nullable().optional(),
  images: z.array(NewsImageSchema).optional(),
  newsAdditionalImages: z.array(NewsAdditionalImageSchema).optional(),
  cardFocalPointX: z.number().nullable().optional(),
  cardFocalPointY: z.number().nullable().optional(),
  thumbnailFocalPointX: z.number().nullable().optional(),
  thumbnailFocalPointY: z.number().nullable().optional(),
  createdDate: z.string().optional(),
  updatedDate: z.string().optional(),
});

export const NewsPageSchema = z.object({
  rows: z.array(NewsResponseSchema),
  ...PageMetadataSchema.shape,
});

export const NewsBulletinTypeSchema = z.enum(["HIGHLIGHT", "ANNOUNCEMENT"]);
export const SetNewsBulletinSchema = z.object({
  id: z.number(),
  type: NewsBulletinTypeSchema,
  enabled: z.boolean(),
});
export const NewsBulletinSchema = z.object({
  id: z.number(),
  newsID: z.number(),
  type: NewsBulletinTypeSchema,
  news: NewsResponseSchema,
});
export const NewsBulletinsSchema = z.array(NewsBulletinSchema);

export const NewsInformationSchema = z.object({
  id: z.number(),
  newsID: z.number().optional(),
  tagID: z.number().optional(),
  thumbnailURL: z.string().nullable(),
  highlightURL: z.string().nullable().optional(),
  news: NewsResponseSchema,
  thumbnailFocalPointX: z.number().nullable().optional(),
  thumbnailFocalPointY: z.number().nullable().optional(),
  type: NewsBulletinTypeSchema.optional(),
});

export const NewsFeatureResponseSchema = NewsInformationSchema.extend({
  newsID: z.number(),
  tagID: z.number(),
  thumbnailURL: z.string(),
});

export const NewsInformationsPageSchema = z.object({
  rows: z.array(NewsFeatureResponseSchema),
  ...PageMetadataSchema.shape,
});

const QueryNumberSchema = z.union([
  z.number(),
  z.string().transform((value) => Number(value)).pipe(z.number()),
]);

export const NewsQuerySchema = z.object({
  page: QueryNumberSchema.optional(),
  pageSize: QueryNumberSchema.optional(),
  tagID: QueryNumberSchema.optional(),
  orderBy: z.string().optional(),
  sortBy: z.string().optional(),
  search: z.string().optional(),
  searchBy: z.string().optional(),
});
export const NewsSearchSchema = z.object({ search: z.string().optional() });

export const FocalPointSchema = z.object({
  thumbnailFocalPointX: z.number().min(0).max(100).optional(),
  thumbnailFocalPointY: z.number().min(0).max(100).optional(),
  cardFocalPointX: z.number().min(0).max(100).optional(),
  cardFocalPointY: z.number().min(0).max(100).optional(),
});

export const CreateNewsSchema = z.object({
  title: z.string().min(1, "กรุณากรอกหัวข้อ"),
  detail: z.string().min(1, "กรุณากรอกรายละเอียด"),
  tagID: z.number().min(1, "กรุณาเลือกหมวดหมู่"),
  startDate: z
    .string()
    .min(1, "กรุณาเลือกวันที่เริ่มต้น")
    .refine((val) => dayjs(val).isValid(), {
      message: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  dueDate: z.string().optional(),
  thumbnail: z.file({ message: "กรุณาอัปโหลดภาพหน้าปก" }),
  thumbnailImage: z.file().optional(),
  additionalImages: z.array(z.file()).max(10).optional(),
  ...FocalPointSchema.shape,
});

export const UpdateNewsSchema = z.object({
  title: z.string(),
  startDate: z
    .string()
    .min(1, "กรุณาเลือกวันที่เริ่มต้น")
    .refine((val) => dayjs(val).isValid(), {
      message: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  dueDate: z.string().optional(),
  tag: z.number(),
  detail: z.string().optional(),
  thumbnail: z.union([z.string().trim().min(1), z.file()]),
  thumbnailImage: z.union([z.string().trim().min(1), z.file()]).optional(),
  ...FocalPointSchema.shape,
});

export const UpdateNewsPayloadSchema = z.object({
  title: z.string().optional(),
  tagID: z.number().optional(),
  thumbnail: z.union([z.string().trim().min(1), z.file()]).optional(),
  thumbnailImage: z.union([z.string().trim().min(1), z.file()]).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  detail: z.string().optional(),
  ...FocalPointSchema.shape,
  newAdditionalImages: z.array(z.file()).optional(),
  detailImages: z.array(z.file()).optional(),
  deletedImageIds: z.array(z.number()).optional(),
  detailImageOrder: z.string().optional(),
  deletedAdditionalImagesId: z.array(z.number()).optional(),
  newsCategoryId: z.number().optional(),
  eventStartAt: z.string().optional(),
  eventEndAt: z.string().nullable().optional(),
  cardImage: z.file().optional(),
});

export const CreateNewsPayloadSchema = CreateNewsSchema;

export const CreateNewsInformationSchema = (type: string) =>
  z.object({
    thumbnail: z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" }),
    highlight:
      type === "newshighlight"
        ? z.instanceof(File, { message: "กรุณาอัปโหลดรูปภาพ" })
        : z.instanceof(File).optional(),
    newsID: z.number().min(1, "กรุณาเลือกข่าว"),
  });

export type INews = z.infer<typeof NewsResponseSchema>;
export type INewsImage = z.infer<typeof NewsImageSchema>;
export type INewsInformation = z.infer<typeof NewsInformationSchema>;
export type NewsBulletin = z.infer<typeof NewsBulletinSchema>;
export type SetNewsBulletin = z.infer<typeof SetNewsBulletinSchema>;
export type QueryNews = z.output<typeof NewsQuerySchema>;
export type NewsQueryInput = z.input<typeof NewsQuerySchema>;
export type NewsSearch = z.infer<typeof NewsSearchSchema>;
export type CreateNewsInputs = z.input<typeof CreateNewsSchema>;
export type CreateNewsPayload = z.output<typeof CreateNewsPayloadSchema>;
export type UpdateNewsInputs = z.input<typeof UpdateNewsSchema>;
export type UpdateNewsPayload = z.output<typeof UpdateNewsPayloadSchema>;
export type CreateNewsInformationInputs = z.infer<
  ReturnType<typeof CreateNewsInformationSchema>
>;
