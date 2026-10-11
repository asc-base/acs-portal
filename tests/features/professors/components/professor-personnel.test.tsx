// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfessorsListComponent from "@/features/professors/components/public/professors.list.compnent";
import type { IProfessor } from "@/features/professors/domain/professor";
import ProfessorsPage from "@/app/(public)/professors/page";

const mocks = vi.hoisted(() => ({ push: vi.fn(), getProfessors: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => new URLSearchParams("page=2&staffPage=3&pageSize=1"),
}));
vi.mock("@/features/professors/server", () => ({
  createProfessorServerService: async () => ({
    getProfessors: mocks.getProfessors,
  }),
}));

function profile(
  id: number,
  name: string,
  personnelType?: IProfessor["professor"]["personnelType"],
): IProfessor {
  return {
    id,
    firstNameTh: name,
    lastNameTh: "ทดสอบ",
    email: `person${id}@example.test`,
    professor: {
      id,
      phone: "0812345678",
      profRoom: "A201",
      educations: [],
      expertFields: [],
      research_profile: null,
      personnelType,
    },
  };
}

afterEach(() => vi.clearAllMocks());

describe("public professor personnel sections", () => {
  it("shows heads with teachers, labels only heads, and keeps staff in their own section", () => {
    render(
      <ProfessorsListComponent
        academics={{
          rows: [
            profile(1, "หัวหน้า", "CURRICULUM_HEAD"),
            profile(2, "อาจารย์เดิม"),
          ],
          totalRecords: 2,
          page: 1,
          pageSize: 12,
        }}
        staff={{
          rows: [profile(3, "เจ้าหน้าที่", "CURRICULUM_STAFF")],
          totalRecords: 1,
          page: 1,
          pageSize: 12,
        }}
      />,
    );
    const teachers = screen.getByRole("region", { name: "อาจารย์" });
    const staff = screen.getByRole("region", {
      name: "เจ้าหน้าที่ประจำหลักสูตร",
    });
    expect(within(teachers).getByText("หัวหน้าหลักสูตร")).toBeTruthy();
    expect(
      within(teachers).getByRole("link", { name: /อาจารย์เดิม/ }).textContent,
    ).not.toContain("หัวหน้าหลักสูตร");
    expect(
      within(staff)
        .getByRole("link", { name: /เจ้าหน้าที่/ })
        .getAttribute("href"),
    ).toBe("/professors/3");
    expect(
      within(teachers).queryByRole("link", { name: /เจ้าหน้าที่/ }),
    ).toBeNull();
  });

  it("changes each section page while preserving the other page and page size", () => {
    render(
      <ProfessorsListComponent
        academics={{
          rows: [profile(1, "อาจารย์")],
          totalRecords: 4,
          page: 2,
          pageSize: 1,
        }}
        staff={{
          rows: [profile(2, "เจ้าหน้าที่", "CURRICULUM_STAFF")],
          totalRecords: 4,
          page: 3,
          pageSize: 1,
        }}
      />,
    );
    fireEvent.click(
      within(screen.getByRole("region", { name: "อาจารย์" })).getByRole(
        "button",
        { name: "Go to next page" },
      ),
    );
    expect(mocks.push).toHaveBeenLastCalledWith(
      "/professors?page=3&staffPage=3&pageSize=1",
    );
    fireEvent.click(
      within(
        screen.getByRole("region", { name: "เจ้าหน้าที่ประจำหลักสูตร" }),
      ).getByRole("button", { name: "Go to previous page" }),
    );
    expect(mocks.push).toHaveBeenLastCalledWith(
      "/professors?page=2&staffPage=2&pageSize=1",
    );
  });

  it("requests separately filtered pages on the server", async () => {
    const data = { rows: [], totalRecords: 0, page: 1, pageSize: 12 };
    mocks.getProfessors.mockResolvedValue(data);
    await ProfessorsPage({
      searchParams: Promise.resolve({
        page: "2",
        staffPage: "3",
        pageSize: "12",
      }),
    });
    expect(mocks.getProfessors.mock.calls).toEqual([
      [{ page: "2", pageSize: "12", personnelGroup: "academic" }],
      [{ page: "3", pageSize: "12", personnelGroup: "staff" }],
    ]);
  });
});
