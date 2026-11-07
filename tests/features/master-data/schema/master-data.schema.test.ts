import { describe, expect, it } from "vitest";
import { MasterDataSchema } from "@/features/master-data/schema/master-data";

const dto = {
  roles: [{ id: 1, name: "Admin" }],
  typeCourses: [{ id: 2, type: "Core", description: null }],
  prefixes: [{ id: 6, sequence: 1, nameTh: "อาจารย์", nameEn: "Lecturer", shortNameTh: "อ.", shortNameEn: "Lect." }],
  newsCategories: [{ id: 7, code: "NEWS", name: "News" }],
  fields: [{ id: 1, name: "AI" }],
  categories: [{ id: 1, name: "Education" }],
  projectTypes: [{ id: 1, name: "Research" }],
  techStacks: [{ id: 1, name: "TypeScript" }],
};

describe("MasterDataSchema", () => {
  it("parses the master-data contract with separate classification lookups", () => {
    expect(MasterDataSchema.parse(dto)).toEqual(dto);
  });

  it("rejects retired tags and tag groups instead of ignoring them", () => {
    expect(MasterDataSchema.safeParse({ ...dto, tags: [] }).success).toBe(false);
    expect(MasterDataSchema.safeParse({ ...dto, tagsGroups: [] }).success).toBe(false);
  });
});
