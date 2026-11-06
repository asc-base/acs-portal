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
  it("forwards the personnel group and retains the optional response type", async () => {
    const http = new HttpHelper("https://example.test");
    const row = { ...professor, professor: { ...professor.professor, personnelType: "CURRICULUM_STAFF" } };
    const get = vi.spyOn(http, "get").mockResolvedValue({
      data: { rows: [row], totalRecords: 1, page: 1, pageSize: 12 }, status: 200,
    });
    const repository = new ProfessorRepository("https://example.test", http);
    const result = await repository.getProfessors({ personnelGroup: "staff", page: 1, pageSize: 12 });
    expect(get).toHaveBeenCalledWith("/v1/professors?personnelGroup=staff&page=1&pageSize=12");
    expect(result.data.rows[0].professor.personnelType).toBe("CURRICULUM_STAFF");
  });

  it("serializes professor display name sort in the list query", async () => {
    const http = new HttpHelper("https://example.test");
    const get = vi.spyOn(http, "get").mockResolvedValue({
      data: { rows: [professor], totalRecords: 1, page: 1, pageSize: 12 },
      status: 200,
    });
    await new ProfessorRepository("https://example.test", http).getProfessors({
      personnelGroup: "academic",
      orderBy: "displayNameTh",
      sortBy: "asc",
      page: 1,
      pageSize: 12,
    });
    expect(get).toHaveBeenCalledWith(
      "/v1/professors?personnelGroup=academic&orderBy=displayNameTh&sortBy=asc&page=1&pageSize=12",
    );
  });

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

  it("rejects invalid list pagination at the repository boundary", async () => {
    const http = new HttpHelper("https://example.test");
    vi.spyOn(http, "get").mockResolvedValue({
      data: { rows: [professor], totalRecords: "1", page: 1, pageSize: 10 },
      status: 200,
      statusCode: 200,
    });
    const repository = new ProfessorRepository("https://example.test", http);

    await expect(repository.getProfessors({})).rejects.toThrow();
  });
});
