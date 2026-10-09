import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ICreateProfessor,
  IUpdateProfessor,
} from "@/features/professors/domain/professor";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
import { ProfessorService } from "@/features/professors/service/professor.service";
import { HttpError, HttpHelper } from "@/shared/lib/http";

const professor = {
  id: 9,
  email: "somchai@example.test",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: "Somchai",
  lastNameEn: "Jaidee",
  professor: {
    id: 31,
    profRoom: "A201",
    phone: "0812345678",
    expertFields: ["Computer science"],
    educations: ["PhD"],
    research_profile: null,
  },
};
const response = { data: professor, status: 200, statusCode: 200 };

afterEach(() => vi.restoreAllMocks());

describe("professor create/update multipart requests", () => {
  it("sends create fields and an optional image file", async () => {
    const http = new HttpHelper("https://example.test");
    const post = vi.spyOn(http, "post").mockResolvedValue(response);
    const service = new ProfessorService(
      new ProfessorRepository("https://example.test", http),
    );
    const image = new File(["portrait"], "portrait.png", {
      type: "image/png",
    });
    const data: ICreateProfessor = {
      prefixID: 2,
      educations: "PhD",
      expertFields: "Computer science",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: null,
      lastNameEn: null,
      email: "somchai@example.test",
      phone: "0812345678",
      profRoom: "A201",
      research_profile: null,
    };

    expect(await service.createProfessor(data, image)).toEqual(response);
    expect(post).toHaveBeenCalledWith(
      "/v1/professors",
      expect.any(FormData),
    );
    const form = post.mock.calls[0][1] as FormData;
    expect(Array.from(form.entries())).toEqual([
      ["prefixID", "2"],
      ["educations", "PhD"],
      ["email", "somchai@example.test"],
      ["expertFields", "Computer science"],
      ["firstNameEn", ""],
      ["firstNameTh", "สมชาย"],
      ["lastNameEn", ""],
      ["lastNameTh", "ใจดี"],
      ["phone", "0812345678"],
      ["profRoom", "A201"],
      ["research_profile", ""],
      ["imageFile", image],
    ]);
  });

  it("sends update fields and omits an absent image file", async () => {
    const http = new HttpHelper("https://example.test");
    const patch = vi.spyOn(http, "patch").mockResolvedValue(response);
    const service = new ProfessorService(
      new ProfessorRepository("https://example.test", http),
    );
    const data: IUpdateProfessor = {
      prefixID: 2,
      profRoom: "A201",
      phone: "0812345678",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      email: "somchai@example.test",
      expertFields: "Computer science",
      educations: "PhD",
      research_profile: "https://example.test/profile",
    };

    expect(await service.updateProfessor("9", data, null)).toEqual(response);
    expect(patch).toHaveBeenCalledWith(
      "/v1/professors/9",
      expect.any(FormData),
    );
    const form = patch.mock.calls[0][1] as FormData;
    expect(Array.from(form.entries())).toEqual([
      ["prefixID", "2"],
      ["profRoom", "A201"],
      ["phone", "0812345678"],
      ["firstNameTh", "สมชาย"],
      ["lastNameTh", "ใจดี"],
      ["firstNameEn", "Somchai"],
      ["lastNameEn", "Jaidee"],
      ["email", "somchai@example.test"],
      ["expertFields", "Computer science"],
      ["educations", "PhD"],
      ["research_profile", "https://example.test/profile"],
    ]);
  });

  it("omits undefined update fields from multipart data", async () => {
    const http = new HttpHelper("https://example.test");
    const patch = vi.spyOn(http, "patch").mockResolvedValue(response);
    const service = new ProfessorService(
      new ProfessorRepository("https://example.test", http),
    );

    await service.updateProfessor("9", { educations: "PhD" }, null);

    const form = patch.mock.calls[0]?.[1] as FormData;
    expect(Array.from(form.entries())).toEqual([["educations", "PhD"]]);
  });

  it("preserves repository failures for create and update", async () => {
    const repository = new ProfessorRepository("https://example.test");
    const createError = new HttpError("Create failed", 502);
    const updateError = new HttpError("Update failed", 503);
    vi.spyOn(repository, "createProfessor").mockRejectedValue(createError);
    vi.spyOn(repository, "updateProfessor").mockRejectedValue(updateError);
    const service = new ProfessorService(repository);
    const createData: ICreateProfessor = {
      prefixID: 2,
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      email: "somchai@example.test",
      phone: "0812345678",
      profRoom: "A201",
    };
    const updateData: IUpdateProfessor = {
      prefixID: 2,
      profRoom: "A201",
      phone: "0812345678",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: null,
      lastNameEn: null,
      email: "somchai@example.test",
    };

    await expect(service.createProfessor(createData, null)).rejects.toBe(
      createError,
    );
    await expect(service.updateProfessor("9", updateData, null)).rejects.toBe(
      updateError,
    );
  });

  it("rejects invalid create and update payloads before repository calls", async () => {
    const repository = new ProfessorRepository("https://example.test");
    const createProfessor = vi.spyOn(repository, "createProfessor");
    const updateProfessor = vi.spyOn(repository, "updateProfessor");
    const service = new ProfessorService(repository);

    await expect(
      service.createProfessor({ prefixID: "2" } as never, null),
    ).rejects.toThrow();
    await expect(
      service.updateProfessor("9", { prefixID: "invalid" } as never, null),
    ).rejects.toThrow();
    expect(createProfessor).not.toHaveBeenCalled();
    expect(updateProfessor).not.toHaveBeenCalled();
  });

  it("preserves HttpError status and rejects invalid query data before repository access", async () => {
    const repository = new ProfessorRepository("https://example.test");
    const error = new HttpError("forbidden", 403);
    const getProfessors = vi
      .spyOn(repository, "getProfessors")
      .mockRejectedValue(error);
    const service = new ProfessorService(repository);

    await expect(service.getProfessors({ page: 1 })).rejects.toBe(error);
    await expect(
      service.getProfessors({ page: "invalid" } as never),
    ).rejects.toThrow();
    expect(getProfessors).toHaveBeenCalledOnce();
  });
});

describe("professor service reads", () => {
  it("unwraps list and detail data from the repository response", async () => {
    const http = new HttpHelper("https://example.test");
    vi.spyOn(http, "get").mockResolvedValueOnce({
      data: { rows: [professor], totalRecords: 1, page: 1, pageSize: 10 },
      status: 200,
      statusCode: 200,
    });
    vi.spyOn(http, "get").mockResolvedValueOnce(response);
    const service = new ProfessorService(
      new ProfessorRepository("https://example.test", http),
    );

    const page = await service.getProfessors({ page: "1", pageSize: "10" });
    expect(http.get).toHaveBeenCalledWith("/v1/professors?page=1&pageSize=10");
    expect(page).toEqual({
      rows: [professor],
      totalRecords: 1,
      page: 1,
      pageSize: 10,
    });
    expect(await service.getProfessorById("9")).toEqual(professor);
  });
});
