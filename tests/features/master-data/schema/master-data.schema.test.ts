import { describe, expect, it } from "vitest";
import { MasterDataSchema } from "@/features/master-data/schema/master-data";

const dto = {
  roles: [{ id: 1, name: "Admin" }],
  typeCourses: [
    { id: 2, type: "Core", description: null },
    { id: 3, type: "Elective" },
  ],
  tagsGroups: [
    {
      id: 4,
      name: "project",
      tags: [{ id: 5, name: "research", tagsGroupsId: 4 }],
    },
  ],
  tags: [{ id: 5, name: "research", tagsGroupsId: 4 }],
  prefixes: [
    {
      id: 6,
      sequence: 1,
      nameTh: "อาจารย์",
      nameEn: "Lecturer",
      shortNameTh: "อ.",
      shortNameEn: "Lect.",
    },
  ],
  newsCategories: [{ id: 7, code: "NEWS", name: "News" }],
};

describe("MasterDataSchema", () => {
  it("parses the current master-data DTO and preserves nullable optional fields", () => {
    expect(MasterDataSchema.parse(dto)).toEqual(dto);
  });

  it("rejects malformed master-data references", () => {
    expect(() =>
      MasterDataSchema.parse({ ...dto, tags: [{ id: 5, name: "research" }] }),
    ).toThrow();
  });
});
