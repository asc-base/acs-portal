import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ICreateProfessor,
  IUpdateProfessor,
} from "@/features/professors/domain/professor";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
import { ProfessorService } from "@/features/professors/service/professor.service";
import { HttpHelper } from "@/shared/lib/http";

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
      ["expertFields", "Computer science"],
      ["firstNameTh", "สมชาย"],
      ["lastNameTh", "ใจดี"],
      ["firstNameEn", ""],
      ["lastNameEn", ""],
      ["email", "somchai@example.test"],
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
      id: 9,
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
      ["id", "9"],
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

  it("returns null and logs repository failures for create and update", async () => {
    const repository = new ProfessorRepository("https://example.test");
    const createError = new Error("Create failed");
    const updateError = new Error("Update failed");
    vi.spyOn(repository, "createProfessor").mockRejectedValue(createError);
    vi.spyOn(repository, "updateProfessor").mockRejectedValue(updateError);
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
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
      id: 9,
      prefixID: 2,
      profRoom: "A201",
      phone: "0812345678",
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: null,
      lastNameEn: null,
      email: "somchai@example.test",
    };

    expect(await service.createProfessor(createData, null)).toBeNull();
    expect(await service.updateProfessor("9", updateData, null)).toBeNull();
    expect(log).toHaveBeenNthCalledWith(
      1,
      "Failed to create professor:",
      createError,
    );
    expect(log).toHaveBeenNthCalledWith(
      2,
      "Failed to update professor:",
      updateError,
    );
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

    const page = await service.getProfessors({ page: 1, pageSize: 10 });
    expect(page).toEqual({
      rows: [professor],
      totalRecords: 1,
      page: 1,
      pageSize: 10,
    });
    expect(await service.getProfessorById("9")).toEqual(professor);
  });
});
