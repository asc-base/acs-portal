import { describe, expect, it } from "vitest";
import {
  CreateProfessorSchema,
  ProfessorPageSchema,
  ProfessorQuerySchema,
  UpdateProfessorSchema,
} from "@/features/professors/schema/professor";

const validProfessor = {
  prefixID: 1,
  educations: [{ value: "PhD" }],
  expertFields: [{ value: "Computer science" }],
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: "Somchai",
  lastNameEn: "Jaidee",
  email: "somchai@example.test",
  phone: "0812345678",
  profRoom: "A201",
};

const validImage = new File(["image"], "portrait.png", { type: "image/png" });

describe.each([
  ["create", CreateProfessorSchema, { ...validProfessor, imageFile: validImage }],
  ["update", UpdateProfessorSchema, validProfessor],
])("%s professor schema", (_name, schema, values) => {
  it.each([undefined, "CURRICULUM_HEAD", "LECTURER", "CURRICULUM_STAFF"])(
    "accepts optional personnel type %s", (personnelType) => {
      expect(schema.safeParse({ ...values, personnelType }).success).toBe(true);
    },
  );

  it("rejects an unknown personnel type", () => {
    expect(schema.safeParse({ ...values, personnelType: "ADMIN" }).success).toBe(false);
  });

  it("requires a prefix, education and expert field", () => {
    expect(schema.safeParse(values).success).toBe(true);
    expect(schema.safeParse({ ...values, prefixID: null }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...values, educations: undefined }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...values, expertFields: undefined }).success).toBe(
      false,
    );
    expect(
      schema.safeParse({ ...values, educations: [{ value: " " }] })
        .success,
    ).toBe(false);
    expect(
      schema.safeParse({ ...values, expertFields: [{ value: " " }] })
        .success,
    ).toBe(false);
  });

  it("accepts Thai names and English names, including blank optional English names", () => {
    expect(schema.safeParse(values).success).toBe(true);
    expect(
      schema.safeParse({
        ...values,
        firstNameEn: "",
        lastNameEn: "",
      }).success,
    ).toBe(true);
    expect(schema.safeParse({ ...values, firstNameTh: "Somchai" }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...values, firstNameEn: "สมชาย" }).success).toBe(
      false,
    );
  });

  it.each(["0812345678", "021234567"])("accepts phone %s", (phone) => {
    expect(schema.safeParse({ ...values, phone }).success).toBe(true);
  });

  it.each(["123456789", "08123456", "08123456789", "08-1234-5678"])(
    "rejects phone %s",
    (phone) => {
      expect(schema.safeParse({ ...values, phone }).success).toBe(false);
    },
  );

  it("allows an omitted or blank research URL and accepts HTTP(S) URLs", () => {
    expect(schema.safeParse(values).success).toBe(true);
    expect(
      schema.safeParse({ ...values, research_profile: " " }).success,
    ).toBe(true);
    expect(
      schema.safeParse({
        ...values,
        research_profile: "http://example.test/profile",
      }).success,
    ).toBe(true);
    expect(
      schema.safeParse({
        ...values,
        research_profile: "https://example.test/profile",
      }).success,
    ).toBe(true);
  });

  it.each(["ftp://example.test/profile", "/profile", "https://"])(
    "rejects research URL %s",
    (research_profile) => {
      expect(
        schema.safeParse({ ...values, research_profile }).success,
      ).toBe(false);
    },
  );
});

describe("professor create image validation", () => {
  it.each([undefined, null])("shows the required image message for %s", (imageFile) => {
    const result = CreateProfessorSchema.safeParse({ ...validProfessor, imageFile });
    expect(result.error?.issues.find((issue) => issue.path[0] === "imageFile")?.message)
      .toBe("กรุณาอัปโหลดรูปภาพ");
  });

  it("rejects non-image files on create", () => {
    const nonImage = new File(["text"], "doc.txt", { type: "text/plain" });
    const result = CreateProfessorSchema.safeParse({ ...validProfessor, imageFile: nonImage });
    expect(result.error?.issues.find((issue) => issue.path[0] === "imageFile")?.message)
      .toBe("รองรับเฉพาะไฟล์รูปภาพเท่านั้น");
  });
});

describe("professor request and query schemas", () => {
  it("accepts the existing professor list filters without tightening their values", () => {
    expect(
      ProfessorQuerySchema.parse({
        page: 0,
        pageSize: -1,
        educations: "PhD",
        expertFields: "Systems",
        majorPosition: "true",
        academicPosition: "false",
        search: "  Somchai  ",
        searchBy: "firstNameTh",
      }),
    ).toEqual({
      page: 0,
      pageSize: -1,
      educations: "PhD",
      expertFields: "Systems",
      majorPosition: "true",
      academicPosition: "false",
      search: "  Somchai  ",
      searchBy: "firstNameTh",
    });
    expect(ProfessorQuerySchema.safeParse({ page: "invalid" }).success).toBe(false);
  });

  it("converts pagination values from URL strings into numbers", () => {
    expect(ProfessorQuerySchema.parse({ page: "1", pageSize: "12" })).toEqual({
      page: 1,
      pageSize: 12,
    });
  });

  it("validates pagination alongside professor list response rows", () => {
    const row = {
      id: 9,
      email: "somchai@example.test",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      professor: {
        id: 31,
        profRoom: "A201",
        phone: "0812345678",
        expertFields: [],
        educations: [],
        research_profile: null,
      },
    };
    expect(
      ProfessorPageSchema.parse({
        rows: [row],
        totalRecords: 1,
        page: 1,
        pageSize: 10,
      }).rows,
    ).toEqual([row]);
    expect(
      ProfessorPageSchema.safeParse({
        rows: [row],
        totalRecords: "1",
        page: 1,
        pageSize: 10,
      }).success,
    ).toBe(false);
  });
});
