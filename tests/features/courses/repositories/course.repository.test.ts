import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { HttpHelper } from "@/shared/lib/http";
import type { ICourse } from "@/features/courses/domain/course";
import type { QueryCourse } from "@/features/courses/schema/course";
import { CourseRepository } from "@/features/courses/repositories/course.repository";

const coursePage = {
  rows: [] as ICourse[],
  totalRecords: 0,
  page: 0,
  pageSize: 0,
};
const response = <T>(data: T) => ({ data, status: 200, statusCode: 200 });

afterEach(() => vi.restoreAllMocks());

describe("course query construction", () => {
  it("encodes search text and preserves false and zero filters", async () => {
    const http = new HttpHelper();
    const get = vi.spyOn(http, "get").mockResolvedValue(response(coursePage));
    const repository = new CourseRepository("", http);
    const query: QueryCourse = {
      page: 0,
      pageSize: 0,
      prerequisite: false,
      curriculumID: 0,
      typeCourseID: 0,
      search: "C++ & systems?level=1",
      orderBy: "course code",
      sortBy: "desc",
    };

    await repository.getCourse(query);

    const url = get.mock.calls[0]![0];
    expect(url.startsWith("/v1/courses?")).toBe(true);
    expect(Object.fromEntries(new URL(url, "https://example.test").searchParams)).toEqual({
      page: "0",
      pageSize: "0",
      prerequisite: "false",
      curriculumID: "0",
      typeCourseID: "0",
      search: "C++ & systems?level=1",
      orderBy: "course code",
      sortBy: "desc",
    });
  });

  it("parses a JSON page response through HttpHelper", async () => {
    const payload = response(coursePage);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new CourseRepository("https://api.example.test");

    await expect(repository.getCourse({ page: 0, pageSize: 0 })).resolves.toEqual(
      payload,
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/v1/courses?page=0&pageSize=0",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("rejects malformed course pages at the repository boundary", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify(
          response({
            rows: [{ id: 7 }],
            totalRecords: 1,
            page: 1,
            pageSize: 10,
          }),
        ),
        { headers: { "content-type": "application/json" } },
      ),
    );
    const repository = new CourseRepository("https://api.example.test");

    await expect(repository.getCourse({})).rejects.toBeInstanceOf(ZodError);
  });
});

describe("course batch repository request", () => {
  it("posts the supplied FormData to the batch endpoint", async () => {
    const http = new HttpHelper();
    const post = vi.spyOn(http, "post").mockResolvedValue(response(null));
    const repository = new CourseRepository("", http);
    const form = new FormData();
    form.append("file", new Blob(["courseCode"]), "courses.csv");

    await repository.createCourseBatch(form);

    expect(post).toHaveBeenCalledWith("/v1/courses/batch", form);
    expect(post.mock.calls[0]![1]).toBe(form);
  });
});
