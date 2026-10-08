import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/lib/http";
import type { ApiResponse } from "@/shared/types/response";
import type { MasterData } from "@/features/master-data/domain/master-data";
import { MasterDataRepository } from "@/features/master-data/repositories/master-data.repository";

const response: ApiResponse<MasterData> = {
  data: {
    majorPositions: [
      {
        id: 1,
        sequence: 1,
        nameTh: "อาจารย์",
        nameEn: "Lecturer",
        shortNameTh: "อ.",
        shortNameEn: "Lect.",
      },
    ],
    types: [
      {
        id: 2,
        name: "ประเภท",
        createdDate: new Date("2026-01-01T00:00:00.000Z"),
        updatedDate: new Date("2026-01-02T00:00:00.000Z"),
      },
    ],
    roles: [{ id: 3, name: "admin" }],
    typeCourses: [
      {
        id: 4,
        type: "Core",
        description: "Core course",
        createdDate: new Date("2026-01-01T00:00:00.000Z"),
        updatedDate: new Date("2026-01-02T00:00:00.000Z"),
      },
    ],
    listTypes: [
      {
        id: 5,
        name: "รายการ",
        createdDate: new Date("2026-01-01T00:00:00.000Z"),
        updatedDate: new Date("2026-01-02T00:00:00.000Z"),
      },
    ],
    educationLevels: [
      {
        id: 6,
        level: "Doctorate",
        createdDate: new Date("2026-01-01T00:00:00.000Z"),
        updatedDate: new Date("2026-01-02T00:00:00.000Z"),
        name: "PhD",
        description: "Doctoral degree",
      },
    ],
    tags: [{ id: 7, name: "research", tagsGroupsId: 8 }],
    tagsGroups: [{ id: 8, name: "project" }],
    prefixes: [
      {
        id: 9,
        sequence: 2,
        nameTh: "รองศาสตราจารย์",
        nameEn: "Associate Professor",
        shortNameTh: "รศ.",
        shortNameEn: "Assoc. Prof.",
      },
    ],
    newsCategories: [{ id: 10, code: "NEWS", name: "News" }],
  },
  status: 200,
  statusCode: 200,
};

afterEach(() => vi.restoreAllMocks());

describe("MasterDataRepository", () => {
  it("requests the master-data endpoint and preserves the full response", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(response), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new MasterDataRepository("https://api.example.test");

    await expect(repository.getMasterData()).resolves.toEqual(
      JSON.parse(JSON.stringify(response)),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/v1/master-data",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("preserves upstream HTTP errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Unavailable" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new MasterDataRepository("https://api.example.test");

    await expect(repository.getMasterData()).rejects.toMatchObject({
      name: "HttpError",
      status: 503,
      data: { message: "Unavailable" },
    } satisfies Partial<HttpError>);
  });
});
