// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectList from "@/features/projects/components/public/project.list.components";
import { projectFixture } from "./fixtures";

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn() },
  searchParams: new URLSearchParams("fieldIds=1&categoryIds=2&projectTypeIds=3"),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => searchParams,
}));



describe("public project pagination", () => {
  it("keeps selected classifications in the next-page URL", () => {
    render(<ProjectList projects={[projectFixture]} totalRecords={18} page={1} pageSize={9} sortOrder="desc" />);
    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }));

    expect(router.push).toHaveBeenCalledWith(
      "/project?fieldIds=1&categoryIds=2&projectTypeIds=3&page=2&pageSize=9&sortBy=createdAt&sortOrder=desc",
    );
  });
});
