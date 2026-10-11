import { afterEach, describe, expect, it, vi } from "vitest";
import type { CreateProjectRequest } from "@/features/projects/schema/project";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";
import { projectEnvelope, projectFixture, projectPageFixture } from "../fixtures";

const response = projectEnvelope(projectFixture);
const image = (name: string) => new File([name], name, { type: "image/png" });

afterEach(() => vi.restoreAllMocks());

describe("project create multipart payload", () => {
  it("JSON-encodes array fields, repeats assets, and retains focal points", async () => {
    const repository = new ProjectRepository("");
    const create = vi.spyOn(repository, "createProject").mockResolvedValue(response);
    const service = new ProjectService(repository);
    const thumbnailFile = image("thumbnail.png");
    const assets = [image("first.png"), image("second.png")];

    await expect(service.createProject({
      title: "Project",
      details: "Project details",
      youtubeURL: "https://youtube.com/watch?v=123",
      githubURL: "https://github.com/kmutt/project",
      documentURL: "https://example.test/document",
      presentationURL: "https://example.test/presentation",
      figmaURL: "",
      coursesID: [3, 8],
      tagsID: [2, 5],
      techStacks: ["TypeScript", "React"],
      members: [{ userID: 7, roleID: 2 }],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    }, { thumbnailFile, assets })).resolves.toBe(projectFixture);

    const form = create.mock.calls[0]![0];
    expect(form.get("title")).toBe("Project");
    expect(form.get("youtubeURL")).toBe("https://youtube.com/watch?v=123");
    expect(form.get("figmaURL")).toBe("");
    expect(form.get("thumbnailFocalPointX")).toBe("0");
    expect(form.get("thumbnailFocalPointY")).toBe("75");
    expect(form.get("coursesID")).toBe("[3,8]");
    expect(form.get("tagsID")).toBe("[2,5]");
    expect(form.get("techStacks")).toBe('["TypeScript","React"]');
    expect(form.get("members")).toBe('[{"userID":7,"roleID":2}]');
    expect(form.get("thumbnailFile")).toBe(thumbnailFile);
    expect(form.getAll("assets")).toEqual(assets);
  });
});

describe("project update multipart payload", () => {
  it("omits an optional thumbnail, repeats new assets, and retains focal points", async () => {
    const repository = new ProjectRepository("");
    const update = vi.spyOn(repository, "updateProject").mockResolvedValue(response);
    const service = new ProjectService(repository);
    const assets = [image("first.png"), image("second.png")];

    await expect(service.updateProject("17", {
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
      thumbnailFocalPointX: -10,
      thumbnailFocalPointY: 120,
    }, { thumbnailFile: null, assets })).resolves.toBe(projectFixture);

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
    expect(form.get("thumbnailFocalPointX")).toBe("-10");
    expect(form.get("thumbnailFocalPointY")).toBe("120");
    expect(form.has("figmaURL")).toBe(false);
    expect(form.has("thumbnailFile")).toBe(false);
    expect(form.getAll("assets")).toEqual(assets);
  });
});

describe("project service request parsing", () => {
  it("normalizes URL query values before the repository call", async () => {
    const repository = new ProjectRepository("");
    const getProjects = vi.spyOn(repository, "getProjects").mockResolvedValue(projectEnvelope(projectPageFixture));
    const service = new ProjectService(repository);

    await expect(service.getProjects({ page: "2", pageSize: 5, fields: "1" })).resolves.toEqual(projectPageFixture);
    expect(getProjects).toHaveBeenCalledWith({ page: 2, pageSize: 5, fields: ["1"] });
  });

  it("rejects malformed request IDs before making a repository call", async () => {
    const repository = new ProjectRepository("");
    const create = vi.spyOn(repository, "createProject");
    const service = new ProjectService(repository);
    const request: CreateProjectRequest = {
      title: "Project",
      details: "Details",
      youtubeURL: "youtube",
      githubURL: "github",
      documentURL: "document",
      presentationURL: "presentation",
      coursesID: [0],
      tagsID: [2],
      techStacks: ["TypeScript"],
      members: [{ userID: 7, roleID: 2 }],
    };

    await expect(service.createProject(request, { thumbnailFile: image("thumbnail.png"), assets: [] })).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });
});
