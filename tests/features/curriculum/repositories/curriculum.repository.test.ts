import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpHelper } from "@/shared/lib/http";
import type { ICurriculum } from "@/features/curriculum/domain/curriculum";
import { CurriculumRepository } from "@/features/curriculum/repositories/curriculum.repository";

const curriculum: ICurriculum = {
  id: 42,
  title: "Curriculum 2025",
  year: "2025",
  documentURL: "https://drive.google.com/file/d/curriculum/view",
  description: "Undergraduate curriculum",
  thumbnailURL: "https://example.test/curriculum.png",
};
const response = <T>(data: T) => ({ data, status: 200, statusCode: 200 });
const page = { rows: [curriculum], totalRecords: 1, page: 2, pageSize: 25 };

afterEach(() => vi.restoreAllMocks());

describe("curriculum queries", () => {
  it("sends pagination and the supplied year filter", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(response(page));
    const repository = new CurriculumRepository("", http);

    await repository.getCurriculum({
      page: 2,
      pageSize: 25,
      year: "2025 & 2026",
      sortBy: "desc",
      orderBy: "year",
    });

    expect(get).toHaveBeenCalledWith(
      "/v1/curriculums?page=2&pageSize=25&year=2025+%26+2026&sortBy=desc&orderBy=year",
    );
  });
});

describe("curriculum responses and paths", () => {
  it("parses the JSON response through HttpHelper", async () => {
    const payload = response(page);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new CurriculumRepository("https://api.example.test");

    await expect(repository.getCurriculum({ page: 2, pageSize: 25 })).resolves.toEqual(
      payload,
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/v1/curriculums?page=2&pageSize=25",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("returns a null lookup result", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(null as never);
    const repository = new CurriculumRepository("", http);

    await expect(repository.getCurriculumById(404)).resolves.toBeNull();
    expect(get).toHaveBeenCalledWith("/v1/curriculums/404");
  });

  it("uses the expected item and mutation request paths", async () => {
    const http = new HttpHelper();
    const itemResponse = response(curriculum);
    const get = vi.spyOn(http, "get").mockResolvedValue(itemResponse);
    const post = vi.spyOn(http, "post").mockResolvedValue(itemResponse);
    const patch = vi.spyOn(http, "patch").mockResolvedValue(itemResponse);
    const deleteRequest = vi.spyOn(http, "delete").mockResolvedValue(itemResponse);
    const repository = new CurriculumRepository("", http);
    const form = new FormData();

    await repository.getCurriculumById(curriculum.id);
    await repository.createCurriculum(form);
    await repository.updateCurriculum(curriculum.id, form);
    await repository.deleteCurriculum(curriculum.id);

    expect(get).toHaveBeenCalledWith("/v1/curriculums/42");
    expect(post).toHaveBeenCalledWith("/v1/curriculums/", form);
    expect(patch).toHaveBeenCalledWith("/v1/curriculums/42", form);
    expect(deleteRequest).toHaveBeenCalledWith("/v1/curriculums/42");
  });
});
