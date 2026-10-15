// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EdgeSidebarAdmin } from "@/app/_components/edgesidebaradmin";

const mocks = vi.hoisted(() => ({ path: "/admin" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.path,
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
vi.mock("@/features/auth/client", () => ({
  useLogout: () => ({ mutateAsync: vi.fn() }),
}));

beforeEach(() => {
  mocks.path = "/admin";
});

describe("admin sidebar dashboard link", () => {
  it("links to /admin and is active only on the dashboard route", () => {
    const { rerender } = render(<EdgeSidebarAdmin username="Admin" />);
    const dashboard = screen.getByRole("link", { name: "Dashboard" });

    expect(dashboard.getAttribute("href")).toBe("/admin");
    expect(dashboard.className).toContain("border-l-4");

    mocks.path = "/admin/news";
    rerender(<EdgeSidebarAdmin username="Admin" />);
    expect(dashboard.className).not.toContain("border-l-4");
  });
});
