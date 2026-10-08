import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpHelper } from "@/shared/lib/http";
import type { QueryProject } from "@/features/projects/schema/project";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { projectEnvelope, projectFixture, projectPageFixture } from "../fixtures";

const page = { ...projectPageFixture, page: 2, pageSize: 15 };
const response = projectEnvelope;

afterEach(() => vi.restoreAllMocks());

describe("project repository queries", () => {
  it("keeps repeated filters ordered and encodes values in the URL", async () => {
    const http = new HttpHelper();
    const payload = response(page);
    const get = vi.spyOn(http, "get").mockResolvedValue(payload);
    const repository = new ProjectRepository("", http);
    const query: QueryProject = {
      sortBy: "title & date",
      sortOrder: "desc",
      page: 2,
      pageSize: 15,
      fields: ["field one", "field&two"],
      categories: ["category?"],
      types: ["type one"],
      courses: ["course 1", "course&2"],
      classBooks: ["book 1", "book&2"],
      search: "AI & systems?view=1",
    };

    await expect(repository.getProjects(query)).resolves.toEqual(payload);

    const url = get.mock.calls[0]![0];
    expect(url).toBe(
      "/v1/project?orderBy=title+%26+date&sortBy=desc&page=2&pageSize=15&tagID=field+one&tagID=field%26two&tagID=category%3F&tagID=type+one&courseID=course+1&courseID=course%262&classBookID=book+1&classBookID=book%262&search=AI+%26+systems%3Fview%3D1",
    );
    const params = new URL(url, "https://example.test").searchParams;
    expect(params.getAll("tagID")).toEqual([
      "field one",
      "field&two",
      "category?",
      "type one",
    ]);
    expect(params.getAll("courseID")).toEqual(["course 1", "course&2"]);
    expect(params.getAll("classBookID")).toEqual(["book 1", "book&2"]);
    expect(params.get("search")).toBe("AI & systems?view=1");
  });

  it("routes list and CRUD calls to their project endpoints and returns responses", async () => {
    const http = new HttpHelper();
    const listResponse = response(page);
    const projectResponse = response(projectFixture);
    const get = vi
      .spyOn(http, "get")
      .mockResolvedValueOnce(listResponse)
      .mockResolvedValueOnce(projectResponse);
    const post = vi.spyOn(http, "post").mockResolvedValue(projectResponse);
    const put = vi.spyOn(http, "put").mockResolvedValue(projectResponse);
    const remove = vi
      .spyOn(http, "delete")
      .mockResolvedValue(projectResponse);
    const repository = new ProjectRepository("", http);
    const form = new FormData();

    await expect(repository.getProjects({})).resolves.toEqual(listResponse);
    await expect(repository.getProjectById("17")).resolves.toEqual(projectResponse);
    await expect(repository.createProject(form)).resolves.toEqual(projectResponse);
    await expect(repository.updateProject("17", form)).resolves.toEqual(projectResponse);
    await expect(repository.deleteProject(17)).resolves.toEqual(projectResponse);

    expect(get).toHaveBeenNthCalledWith(1, "/v1/project");
    expect(get).toHaveBeenNthCalledWith(2, "/v1/project/17");
    expect(post).toHaveBeenCalledWith("/v1/project", form);
    expect(put).toHaveBeenCalledWith("/v1/project/17", form);
    expect(remove).toHaveBeenCalledWith("/v1/project/17");
  });

  it("parses a JSON page response through HttpHelper", async () => {
    const payload = response(page);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(payload), {
        headers: { "content-type": "application/json" },
      }),
    );
    const repository = new ProjectRepository("https://api.example.test/");

    await expect(repository.getProjects({ page: 2 })).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.test/v1/project?page=2",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("rejects malformed project DTOs and pagination at the repository boundary", async () => {
    const http = new HttpHelper();
    vi.spyOn(http, "get").mockResolvedValue(response({ rows: [{ id: 17 }], totalRecords: 1, page: 1, pageSize: 10 }));
    const repository = new ProjectRepository("", http);

    await expect(repository.getProjects({})).rejects.toThrow();
  });
});
