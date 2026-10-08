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

describe.each([
  ["create", CreateProfessorSchema],
  ["update", UpdateProfessorSchema],
])("%s professor schema", (_name, schema) => {
  it("requires a prefix, education and expert field", () => {
    expect(schema.safeParse(validProfessor).success).toBe(true);
    expect(schema.safeParse({ ...validProfessor, prefixID: null }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...validProfessor, educations: undefined }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...validProfessor, expertFields: undefined }).success).toBe(
      false,
    );
    expect(
      schema.safeParse({ ...validProfessor, educations: [{ value: " " }] })
        .success,
    ).toBe(false);
    expect(
      schema.safeParse({ ...validProfessor, expertFields: [{ value: " " }] })
        .success,
    ).toBe(false);
  });

  it("accepts Thai names and English names, including blank optional English names", () => {
    expect(schema.safeParse(validProfessor).success).toBe(true);
    expect(
      schema.safeParse({
        ...validProfessor,
        firstNameEn: "",
        lastNameEn: "",
      }).success,
    ).toBe(true);
    expect(schema.safeParse({ ...validProfessor, firstNameTh: "Somchai" }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...validProfessor, firstNameEn: "สมชาย" }).success).toBe(
      false,
    );
  });

  it.each(["0812345678", "021234567"])("accepts phone %s", (phone) => {
    expect(schema.safeParse({ ...validProfessor, phone }).success).toBe(true);
  });

  it.each(["123456789", "08123456", "08123456789", "08-1234-5678"])(
    "rejects phone %s",
    (phone) => {
      expect(schema.safeParse({ ...validProfessor, phone }).success).toBe(false);
    },
  );

  it("allows an omitted or blank research URL and accepts HTTP(S) URLs", () => {
    expect(schema.safeParse(validProfessor).success).toBe(true);
    expect(
      schema.safeParse({ ...validProfessor, research_profile: " " }).success,
    ).toBe(true);
    expect(
      schema.safeParse({
        ...validProfessor,
        research_profile: "http://example.test/profile",
      }).success,
    ).toBe(true);
    expect(
      schema.safeParse({
        ...validProfessor,
        research_profile: "https://example.test/profile",
      }).success,
    ).toBe(true);
  });

  it.each(["ftp://example.test/profile", "/profile", "https://"])(
    "rejects research URL %s",
    (research_profile) => {
      expect(
        schema.safeParse({ ...validProfessor, research_profile }).success,
      ).toBe(false);
    },
  );
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
    expect(ProfessorQuerySchema.safeParse({ page: "1" }).success).toBe(false);
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
