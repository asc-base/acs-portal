import { describe, expect, it } from "vitest";
import { changedFields } from "@/shared/lib/changed-fields";

describe("changedFields", () => {
  it("keeps only values that differ, including explicit clears", () => {
    type Values = {
      name: string;
      education: { value: string }[];
      profile: string | null;
    };
    const current: Values = {
      name: "Same",
      education: [],
      profile: null,
    };
    const initial: Partial<Values> = {
      name: "Same",
      education: [{ value: "PhD" }],
      profile: "url",
    };

    expect(changedFields(current, initial)).toEqual({ education: [], profile: null });
  });

  it("compares nested values by content", () => {
    expect(
      changedFields({ values: [{ id: 1 }, { id: 2 }] }, { values: [{ id: 1 }, { id: 2 }] }),
    ).toEqual({});
  });
});
