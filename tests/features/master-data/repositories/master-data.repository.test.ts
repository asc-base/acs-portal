import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/lib/http";
import type { MasterData } from "@/features/master-data/domain/master-data";
import { MasterDataRepository } from "@/features/master-data/repositories/master-data.repository";

const data: MasterData = {
  roles: [{ id: 3, name: "Admin" }],
  typeCourses: [
    { id: 4, type: "Core", description: null },
    { id: 5, type: "Elective" },
  ],
  tagsGroups: [
    {
      id: 8,
      name: "project",
      tags: [{ id: 7, name: "research", tagsGroupsId: 8 }],
    },
  ],
  tags: [{ id: 7, name: "research", tagsGroupsId: 8 }],
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
};

const response = {
  data,
  status: 200,
  msg: "Success",
  err: null,
};

afterEach(() => vi.restoreAllMocks());

describe("MasterDataRepository", () => {
  it("requests the master-data endpoint, parses its DTO, and preserves the envelope", async () => {
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

  it("defaults missing tags on all groups returned by the API", async () => {
    const tagsGroups = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      name: `group-${index + 1}`,
    }));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ ...response, data: { ...data, tagsGroups } }),
        { headers: { "content-type": "application/json" } },
      ),
    );
    const repository = new MasterDataRepository("https://api.example.test");

    await expect(repository.getMasterData()).resolves.toMatchObject({
      data: {
        tagsGroups: tagsGroups.map((group) => ({ ...group, tags: [] })),
        tags: data.tags,
      },
    });
  });

  it("rejects malformed master-data returned by the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { ...data, tags: [{ id: 7, name: "research" }] } }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new MasterDataRepository("https://api.example.test");

    await expect(repository.getMasterData()).rejects.toThrow();
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
