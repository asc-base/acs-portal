import { afterEach, describe, expect, it, vi } from "vitest";
import type { CreateProjectRequest, UpdateProjectRequest } from "@/features/projects/schema/project";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";
import { projectEnvelope, projectFixture, projectPageFixture } from "../fixtures";

const response = projectEnvelope(projectFixture);
const image = (name: string) => new File([name], name, { type: "image/png" });

afterEach(() => vi.restoreAllMocks());

describe("project multipart payloads", () => {
  it("stores the contract once as JSON while repeating ordered asset files", async () => {
    const repository = new ProjectRepository("");
    const create = vi.spyOn(repository, "createProject").mockResolvedValue(response);
    const service = new ProjectService(repository);
    const thumbnailFile = image("thumbnail.png");
    const assets = [image("first.png"), image("second.png")];
    const payload: CreateProjectRequest = {
      title: "Project",
      detail: "Project details",
      youtubeURL: "https://youtube.com/watch?v=123",
      githubURL: "https://github.com/kmutt/project",
      documentURL: "https://example.test/document",
      presentationURL: "https://example.test/presentation",
      figmaURL: null,
      courseIds: [3, 8],
      fieldIds: [1],
      categoryIds: [2],
      projectTypeIds: [3],
      techStacks: ["TypeScript", "React"],
      members: [
        { userID: 7, memberType: "STUDENT" },
        { userID: 9, memberType: "ADVISOR" },
      ],
      gallery: [{ fileIndex: 0 }, { fileIndex: 1 }],
      thumbnailFocalPointX: 0,
      thumbnailFocalPointY: 75,
    };

    await expect(service.createProject(payload, { thumbnailFile, assets })).resolves.toBe(projectFixture);

    const form = create.mock.calls[0]![0];
    expect(JSON.parse(String(form.get("payload")))).toEqual(payload);
    expect(form.get("thumbnailFile")).toBe(thumbnailFile);
    expect(form.getAll("assets")).toEqual(assets);
  });

  it("retains gallery order across existing image IDs and uploaded files on update", async () => {
    const repository = new ProjectRepository("");
    const update = vi.spyOn(repository, "updateProject").mockResolvedValue(response);
    const service = new ProjectService(repository);
    const assets = [image("new.png")];
    const payload: UpdateProjectRequest = {
      detail: "Updated details",
      figmaURL: null,
      techStacks: ["TypeScript"],
      members: [
        { userID: 8, memberType: "STUDENT", position: "Backend" },
        { userID: 9, memberType: "ADVISOR" },
      ],
      gallery: [{ imageID: 41 }, { fileIndex: 0 }],
    };

    await expect(service.updateProject("17", payload, { thumbnailFile: null, assets })).resolves.toBe(projectFixture);

    const form = update.mock.calls[0]![1];
    expect(JSON.parse(String(form.get("payload")))).toEqual(payload);
    expect(form.has("thumbnailFile")).toBe(false);
    expect(form.getAll("assets")).toEqual(assets);
  });
});

describe("project service request parsing", () => {
  it("normalizes URL query values before the repository call", async () => {
    const repository = new ProjectRepository("");
    const getProjects = vi.spyOn(repository, "getProjects").mockResolvedValue(projectEnvelope(projectPageFixture));
    const service = new ProjectService(repository);

    await expect(service.getProjects({ page: "2", pageSize: 5, fieldIds: "1" })).resolves.toEqual(projectPageFixture);
    expect(getProjects).toHaveBeenCalledWith({ page: 2, pageSize: 5, fieldIds: ["1"] });
  });

  it("rejects malformed IDs before making a repository call", async () => {
    const repository = new ProjectRepository("");
    const create = vi.spyOn(repository, "createProject");
    const service = new ProjectService(repository);
    const request: CreateProjectRequest = {
      title: "Project",
      detail: "Details",
      youtubeURL: "youtube",
      githubURL: "github",
      documentURL: "document",
      presentationURL: "presentation",
      courseIds: [0],
      fieldIds: [],
      categoryIds: [],
      projectTypeIds: [],
      techStacks: ["TypeScript"],
      members: [
        { userID: 7, memberType: "STUDENT" },
        { userID: 9, memberType: "ADVISOR" },
      ],
      gallery: [{ fileIndex: 0 }],
    };

    await expect(service.createProject(request, { thumbnailFile: image("thumbnail.png"), assets: [image("asset.png")] })).rejects.toThrow();
    expect(create).not.toHaveBeenCalled();
  });
});
