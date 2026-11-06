import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { HttpHelper } from "@/shared/lib/http";
import type { IClassBook } from "@/features/classbook/domain/classbook";
import { ClassBookRepository } from "@/features/classbook/repositories/class-book.repository";

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
const page = {
  rows: [classbook],
  totalRecords: 1,
  page: 1,
  pageSize: 10,
};
const response = <T>(data: T) => ({ data, status: 200, statusCode: 200 });

afterEach(() => vi.restoreAllMocks());

describe("classbook queries", () => {
  it("uses the search and sort defaults", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(response(page));
    const repository = new ClassBookRepository("", http);

    await repository.getClassBooks({});

    expect(get).toHaveBeenCalledWith(
      "/v1/class-books?searchBy=classof&orderBy=createdAt&sortBy=desc",
    );
  });

  it("encodes search text and includes supplied filters", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(response(page));
    const repository = new ClassBookRepository("", http);

    await repository.getClassBooks({
      page: 2,
      pageSize: 15,
      search: "Class A&B? x=1",
      searchBy: "classof",
      curriculumID: 3,
      orderBy: "firstYearAcademic",
      sortBy: "asc",
    });

    expect(get).toHaveBeenCalledWith(
      "/v1/class-books?page=2&pageSize=15&search=Class+A%26B%3F+x%3D1&searchBy=classof&curriculumID=3&orderBy=firstYearAcademic&sortBy=asc",
    );
  });
});

describe("classbook responses", () => {
  it("parses a JSON list response through HttpHelper", async () => {
    const payload = response(page);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new ClassBookRepository("https://api.example.test");

    await expect(repository.getClassBooks({})).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/v1/class-books?searchBy=classof&orderBy=createdAt&sortBy=desc",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("preserves a missing book result", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(null as never);
    const repository = new ClassBookRepository("", http);

    await expect(repository.getClassBookById(404)).resolves.toBeNull();
    expect(get).toHaveBeenCalledWith("/v1/class-books/404");
  });

  it("rejects malformed classbook DTOs at the repository boundary", async () => {
    const http = new HttpHelper();
    vi.spyOn(http, "get").mockResolvedValue(
      response({ ...page, rows: [{ id: 42 }] }),
    );
    const repository = new ClassBookRepository("", http);

    await expect(repository.getClassBooks({})).rejects.toBeInstanceOf(ZodError);
  });
});
