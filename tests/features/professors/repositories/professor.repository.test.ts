import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
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

describe("professor profile response parsing", () => {
  it("parses the user-root response with nested professor fields", async () => {
    const http = new HttpHelper("https://example.test");
    const get = vi.spyOn(http, "get").mockResolvedValue(response);
    const repository = new ProfessorRepository("https://example.test", http);

    expect(await repository.getProfessorById("9")).toEqual(response);
    expect(get).toHaveBeenCalledWith("/v1/professors/9");
  });

  it("rejects the legacy response with user fields nested under user", async () => {
    const http = new HttpHelper("https://example.test");
    vi.spyOn(http, "get").mockResolvedValue({
      data: {
        user: {
          id: professor.id,
          email: professor.email,
          firstNameTh: professor.firstNameTh,
          lastNameTh: professor.lastNameTh,
        },
        professor: professor.professor,
      },
      status: 200,
      statusCode: 200,
    });
    const repository = new ProfessorRepository("https://example.test", http);

    await expect(repository.getProfessorById("9")).rejects.toThrow();
  });
});
