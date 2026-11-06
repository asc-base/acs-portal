import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { ClassBookResponse } from "@/features/classbook/schema/classbook";
import type {
  IClassBook,
  ICreateClassBook,
  IUpdateClassBook,
} from "@/features/classbook/domain/classbook";
import type { IClassBookRepository } from "@/features/classbook/ports/class-book.repository";
import { ClassBookService } from "@/features/classbook/service/class-book.service";

const curriculum = {
  id: 3,
  year: "2025",
  title: "Applied Computer Science",
  documentURL: "https://example.test/curriculum.pdf",
  description: "Undergraduate curriculum",
  thumbnailURL: "https://example.test/curriculum.png",
};
const classbook: IClassBook = {
  id: 42,
  firstYearAcademic: "2025",
  thumbnailURL: "thumbnail.png",
  classof: "68",
  curriculumID: 3,
  curriculum,
};
const saved: ClassBookResponse = {
  data: classbook,
  status: 200,
  statusCode: 200,
};
const validCreate: ICreateClassBook = {
  classof: "68",
  firstYearAcademic: "2025",
  curriculumID: 3,
};
const image = (name: string) => new File([name], name, { type: "image/png" });

function createRepository() {
  return {
    getClassBooks: vi.fn<IClassBookRepository["getClassBooks"]>(),
    getClassBookById: vi
      .fn<IClassBookRepository["getClassBookById"]>()
      .mockResolvedValue(saved),
    createClassBook: vi
      .fn<IClassBookRepository["createClassBook"]>()
      .mockResolvedValue(saved),
    updateClassBook: vi
      .fn<IClassBookRepository["updateClassBook"]>()
      .mockResolvedValue(saved),
    deleteClassBook: vi
      .fn<IClassBookRepository["deleteClassBook"]>()
      .mockResolvedValue(saved),
  } satisfies IClassBookRepository;
}

describe("ClassBookService multipart requests", () => {
  it("creates a classbook with its thumbnail and stringified fields", async () => {
    const repository = createRepository();
    const service = new ClassBookService(repository);
    const thumbnail = image("classbook.png");

    await expect(service.createClassBook(validCreate, thumbnail)).resolves.toEqual(
      classbook,
    );

    const form = repository.createClassBook.mock.calls[0]![0];
    expect(form.get("classof")).toBe("68");
    expect(form.get("firstYearAcademic")).toBe("2025");
    expect(form.get("curriculumID")).toBe("3");
    expect(form.get("thumbnailFile")).toBe(thumbnail);
  });

  it("omits a null update thumbnail and includes a supplied one", async () => {
    const repository = createRepository();
    const service = new ClassBookService(repository);
    const update: IUpdateClassBook = {
      classof: "69",
      firstYearAcademic: "2026",
      curriculumID: 4,
    };

    await service.updateClassBook(update, null, 42);
    const withoutThumbnail = repository.updateClassBook.mock.calls[0]![0];
    expect(repository.updateClassBook.mock.calls[0]![1]).toBe(42);
    expect(withoutThumbnail.get("classof")).toBe("69");
    expect(withoutThumbnail.get("firstYearAcademic")).toBe("2026");
    expect(withoutThumbnail.get("curriculumID")).toBe("4");
    expect(withoutThumbnail.has("thumbnailFile")).toBe(false);

    const thumbnail = image("updated.png");
    await service.updateClassBook(update, thumbnail, 42);
    expect(repository.updateClassBook.mock.calls[1]![0].get("thumbnailFile")).toBe(
      thumbnail,
    );
  });

  it("parses query, identifier, and mutation data before reaching the repository", async () => {
    const repository = createRepository();
    repository.getClassBooks.mockResolvedValue({
      data: { rows: [classbook], totalRecords: 1, page: 2, pageSize: 10 },
      status: 200,
      statusCode: 200,
    });
    const service = new ClassBookService(repository);

    await expect(service.getClassBooks({ page: "2", pageSize: "10" })).resolves
      .toEqual({ rows: [classbook], totalRecords: 1, page: 2, pageSize: 10 });
    expect(repository.getClassBooks).toHaveBeenCalledWith({ page: 2, pageSize: 10 });
    await expect(service.getClassBooks({ page: "0" })).rejects.toBeInstanceOf(
      ZodError,
    );
    await expect(service.createClassBook({ ...validCreate, curriculumID: 0 }, image("bad.png")))
      .rejects.toBeInstanceOf(ZodError);
    await expect(service.updateClassBook({ curriculumID: 0 }, null, 42)).rejects
      .toBeInstanceOf(ZodError);
    await expect(service.deleteClassBook(0)).rejects.toBeInstanceOf(ZodError);
    expect(repository.createClassBook).not.toHaveBeenCalled();
    expect(repository.updateClassBook).not.toHaveBeenCalled();
    expect(repository.deleteClassBook).not.toHaveBeenCalled();
  });

  it("preserves mutation failures for callers", async () => {
    const repository = createRepository();
    const error = new Error("Save failed");
    repository.createClassBook.mockRejectedValue(error);
    repository.updateClassBook.mockRejectedValue(error);
    repository.deleteClassBook.mockRejectedValue(error);
    const service = new ClassBookService(repository);

    await expect(service.createClassBook(validCreate, image("new.png"))).rejects.toBe(
      error,
    );
    await expect(service.updateClassBook({}, null, 42)).rejects.toBe(error);
    await expect(service.deleteClassBook(42)).rejects.toBe(error);
  });
});
