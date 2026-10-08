import { describe, expect, it, vi } from "vitest";
import type { ApiResponse } from "@/shared/types/response";
import type {
  IClassBook,
  ICreateClassBook,
  IUpdateClassBook,
} from "@/features/classbook/domain/classbook";
import type { IClassBookRepository } from "@/features/classbook/ports/class-book.repository";
import { ClassBookService } from "@/features/classbook/service/class-book.service";

const classbook: IClassBook = {
  id: 42,
  firstYearAcademic: "2025",
  image: "classbook.png",
  thumbnailURL: "thumbnail.png",
  classof: "68",
  curriculumID: 3,
};
const saved: ApiResponse<IClassBook> = {
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

    await expect(service.createClassBook(validCreate, thumbnail)).resolves.toBe(
      saved,
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

  it("returns null when create, update, or delete fails", async () => {
    const repository = createRepository();
    const error = new Error("Save failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    repository.createClassBook.mockRejectedValue(error);
    repository.updateClassBook.mockRejectedValue(error);
    repository.deleteClassBook.mockRejectedValue(error);
    const service = new ClassBookService(repository);

    await expect(service.createClassBook(validCreate, image("new.png"))).resolves.toBeNull();
    await expect(service.updateClassBook({}, null, 42)).resolves.toBeNull();
    await expect(service.deleteClassBook(42)).resolves.toBeNull();
    expect(log).toHaveBeenCalledTimes(3);
  });
});
