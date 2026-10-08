import { describe, expect, it, vi } from "vitest";
import type { ICurriculum, ICreateCurriculum, IUpdateCurriculum } from "@/features/curriculum/domain/curriculum";
import type { ICurriculumRepository } from "@/features/curriculum/ports/curriculum.repository";
import { CurriculumService } from "@/features/curriculum/service/curriculum.service";

const curriculum: ICurriculum = {
  id: 42,
  title: "Curriculum 2025",
  year: "2025",
  documentURL: "https://drive.google.com/file/d/curriculum/view",
  description: "Undergraduate curriculum",
  thumbnailURL: "https://example.test/curriculum.png",
};
const saved = { data: curriculum, status: 200, statusCode: 200 };
const createInput: ICreateCurriculum = {
  title: curriculum.title,
  year: curriculum.year,
  documentURL: curriculum.documentURL,
  description: curriculum.description,
  thumbnailFocalPointX: 0,
  thumbnailFocalPointY: 75,
};
const image = (name: string) => new File([name], name, { type: "image/png" });

function createRepository() {
  return {
    getCurriculum: vi.fn<ICurriculumRepository["getCurriculum"]>(),
    getCurriculumById: vi.fn<ICurriculumRepository["getCurriculumById"]>(),
    createCurriculum: vi
      .fn<ICurriculumRepository["createCurriculum"]>()
      .mockResolvedValue(saved),
    updateCurriculum: vi
      .fn<ICurriculumRepository["updateCurriculum"]>()
      .mockResolvedValue(saved),
    deleteCurriculum: vi.fn<ICurriculumRepository["deleteCurriculum"]>(),
  } satisfies ICurriculumRepository;
}

describe("CurriculumService multipart requests", () => {
  it("rejects invalid query and request data before reaching the repository", async () => {
    const repository = createRepository();
    const service = new CurriculumService(repository);

    await expect(service.getCurriculum({ page: 0 })).rejects.toThrow();
    await expect(service.getCurriculumById(0)).rejects.toThrow();
    await expect(
      service.createCurriculum({ ...createInput, title: " " }, image("x.png")),
    ).rejects.toThrow();
    await expect(
      service.createCurriculum(createInput, undefined as never),
    ).rejects.toThrow();
    await expect(
      service.updateCurriculum(curriculum.id, { documentURL: "bad" }, null),
    ).rejects.toThrow();
    expect(repository.getCurriculum).not.toHaveBeenCalled();
    expect(repository.getCurriculumById).not.toHaveBeenCalled();
    expect(repository.createCurriculum).not.toHaveBeenCalled();
    expect(repository.updateCurriculum).not.toHaveBeenCalled();
  });

  it("creates the expected fields and unwraps the response", async () => {
    const repository = createRepository();
    const service = new CurriculumService(repository);
    const thumbnail = image("curriculum.png");

    await expect(service.createCurriculum(createInput, thumbnail)).resolves.toBe(
      curriculum,
    );

    const form = repository.createCurriculum.mock.calls[0]![0];
    expect(Array.from(form.entries())).toEqual([
      ["title", curriculum.title],
      ["year", curriculum.year],
      ["documentURL", curriculum.documentURL],
      ["description", curriculum.description],
      ["thumbnailFocalPointX", "0"],
      ["thumbnailFocalPointY", "75"],
      ["thumbnailFile", thumbnail],
    ]);
  });

  it("omits null and undefined update fields and an absent thumbnail", async () => {
    const repository = createRepository();
    const service = new CurriculumService(repository);
    const update = {
      title: "Revised curriculum",
      year: undefined,
      documentURL: null,
      description: undefined,
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: null,
    } as unknown as IUpdateCurriculum;

    await expect(service.updateCurriculum(curriculum.id, update, null)).resolves.toBe(
      curriculum,
    );

    const [id, form] = repository.updateCurriculum.mock.calls[0]!;
    expect(id).toBe(curriculum.id);
    expect(Array.from(form.entries())).toEqual([
      ["title", "Revised curriculum"],
      ["thumbnailFocalPointX", "0"],
    ]);
  });

  it("uploads a supplied update thumbnail and unwraps the response", async () => {
    const repository = createRepository();
    const service = new CurriculumService(repository);
    const thumbnail = image("updated.png");

    await expect(
      service.updateCurriculum(curriculum.id, { title: "Revised" }, thumbnail),
    ).resolves.toBe(curriculum);
    expect(repository.updateCurriculum.mock.calls[0]![1].get("thumbnailFile")).toBe(
      thumbnail,
    );
  });

  it("unwraps list and item responses and preserves a missing item", async () => {
    const repository = createRepository();
    const rows = { rows: [curriculum], totalRecords: 1, page: 1, pageSize: 10 };
    repository.getCurriculum.mockResolvedValue({
      data: rows,
      status: 200,
      statusCode: 200,
    });
    repository.getCurriculumById.mockResolvedValue(saved);
    const service = new CurriculumService(repository);

    await expect(service.getCurriculum({ page: 1 })).resolves.toBe(rows);
    await expect(service.getCurriculumById(curriculum.id)).resolves.toBe(curriculum);
    repository.getCurriculumById.mockResolvedValueOnce(null);
    await expect(service.getCurriculumById(404)).resolves.toBeNull();
  });
});
