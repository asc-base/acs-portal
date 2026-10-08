import { afterEach, describe, expect, it, vi } from "vitest";
import type { IProject } from "@/features/projects/domain/project";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";

const project = { id: 17, title: "Project" } as IProject;
const response = { data: project, status: 200, statusCode: 200 };
const image = (name: string) => new File([name], name, { type: "image/png" });

afterEach(() => vi.restoreAllMocks());

describe("project create multipart payload", () => {
  it("JSON-encodes object fields, repeats assets, and returns response data", async () => {
    const repository = new ProjectRepository("");
    const create = vi
      .spyOn(repository, "createProject")
      .mockResolvedValue(response);
    const service = new ProjectService(repository);
    const thumbnailFile = image("thumbnail.png");
    const assets = [image("first.png"), image("second.png")];

    await expect(
      service.createProject(
        {
          title: "Project",
          details: "Project details",
          youtubeURL: "https://youtube.com/watch?v=123",
          githubURL: "https://github.com/kmutt/project",
          documentURL: "https://example.test/document",
          presentationURL: "https://example.test/presentation",
          figmaURL: null,
          coursesID: [3, 8],
          tagsID: [2, 5],
          techStacks: ["TypeScript", "React"],
          members: [{ userID: 7, roleID: 2 }],
        },
        { thumbnailFile, assets },
      ),
    ).resolves.toBe(project);

    const form = create.mock.calls[0]![0];
    expect(form.get("title")).toBe("Project");
    expect(form.get("details")).toBe("Project details");
    expect(form.get("youtubeURL")).toBe("https://youtube.com/watch?v=123");
    expect(form.get("figmaURL")).toBeNull();
    expect(form.get("coursesID")).toBe("[3,8]");
    expect(form.get("tagsID")).toBe("[2,5]");
    expect(form.get("techStacks")).toBe('["TypeScript","React"]');
    expect(form.get("members")).toBe('[{"userID":7,"roleID":2}]');
    expect(form.get("thumbnailFile")).toBe(thumbnailFile);
    expect(form.getAll("assets")).toEqual(assets);
    expect(form.has("figmaURL")).toBe(false);
  });
});

describe("project update multipart payload", () => {
  it("omits an optional thumbnail, repeats new assets, and returns response data", async () => {
    const repository = new ProjectRepository("");
    const update = vi
      .spyOn(repository, "updateProject")
      .mockResolvedValue(response);
    const service = new ProjectService(repository);
    const assets = [image("first.png"), image("second.png")];

    await expect(
      service.updateProject(
        "17",
        {
          title: "Updated project",
          details: "Updated details",
          youtubeURL: "https://youtube.com/watch?v=456",
          githubURL: "https://github.com/kmutt/project",
          documentURL: "https://example.test/document",
          presentationURL: "https://example.test/presentation",
          figmaURL: null,
          techStacks: ["TypeScript"],
          newtagsID: [5],
          deletedtagsID: [2],
          newMembers: [{ userID: 8, roleID: 2 }],
          deletedmembersID: [7],
          newCoursesID: [9],
          deletedCoursesID: [3],
        },
        { thumbnailFile: null, assets },
      ),
    ).resolves.toBe(project);

    expect(update).toHaveBeenCalledWith("17", expect.any(FormData));
    const form = update.mock.calls[0]![1];
    expect(form.get("title")).toBe("Updated project");
    expect(form.get("techStacks")).toBe('["TypeScript"]');
    expect(form.get("newtagsID")).toBe("[5]");
    expect(form.get("deletedtagsID")).toBe("[2]");
    expect(form.get("newMembers")).toBe('[{"userID":8,"roleID":2}]');
    expect(form.get("deletedmembersID")).toBe("[7]");
    expect(form.get("newCoursesID")).toBe("[9]");
    expect(form.get("deletedCoursesID")).toBe("[3]");
    expect(form.has("figmaURL")).toBe(false);
    expect(form.has("thumbnailFile")).toBe(false);
    expect(form.getAll("assets")).toEqual(assets);
  });
});
