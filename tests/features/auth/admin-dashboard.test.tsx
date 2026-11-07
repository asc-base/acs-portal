// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminDashboardPage from "@/app/admin/page";

describe("admin dashboard page", () => {
  it("shows the admin welcome heading", () => {
    render(<AdminDashboardPage />);
    expect(
      screen.getByRole("heading", { name: "welcome acs admin dashboard" }),
    ).toBeTruthy();
  });
});
