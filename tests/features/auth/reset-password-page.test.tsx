// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ResetPasswordPage from "@/app/(public)/auth/reset-password/page";
import RootResetPasswordPage from "@/app/(public)/reset-password/page";

describe.each([
  { path: "/auth/reset-password", Page: ResetPasswordPage },
  { path: "/reset-password", Page: RootResetPasswordPage },
])("reset password page $path", ({ Page }) => {
  it.each([
    { searchParams: {}, caseName: "missing token" },
    { searchParams: { token: "   " }, caseName: "blank token" },
    {
      searchParams: { token: ["first", "second"] },
      caseName: "multiple tokens",
    },
    {
      searchParams: { token: "valid", error: "INVALID_TOKEN" },
      caseName: "invalid token error",
    },
  ])("shows the request link for $caseName", async ({ searchParams }) => {
    render(
      await Page({ searchParams: Promise.resolve(searchParams) }),
    );

    expect(
      screen.getByText("ลิงก์ตั้งรหัสผ่านใช้ไม่ได้หรือหมดอายุแล้ว"),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "ขอลิงก์ตั้งรหัสผ่านใหม่" })
        .getAttribute("href"),
    ).toBe("/auth/forget-password");
    expect(screen.queryByRole("button", { name: "เปลี่ยนรหัสผ่าน" })).toBeNull();
  });

  it("shows the password form for a single non-empty token", async () => {
    const page = (await Page({
      searchParams: Promise.resolve({ token: "valid-token" }),
    })) as ReactElement<{ children: ReactElement<{ token: string | null }> }>;

    expect(page.props.children.props.token).toBe("valid-token");
  });
});
