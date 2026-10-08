// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminLoginForm } from "@/features/auth/hooks/useAdminLoginForm";
import { useForgetPasswordForm } from "@/features/auth/hooks/useForgetPasswordForm";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";
import { useStudentLoginForm } from "@/features/auth/hooks/useStudentLoginForm";
import { useAuthStore } from "@/features/auth/store/auth";

const mocks = vi.hoisted(() => ({
  router: { push: vi.fn(), replace: vi.fn() },
}));
vi.mock("next/navigation", () => ({ useRouter: () => mocks.router }));

const profile = {
  id: 2,
  email: "student@example.com",
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  roles: [{ id: 2, name: "Student" }],
};
const response = (data: unknown) =>
  new Response(JSON.stringify({ data, status: 200, msg: "ok", err: null }), {
    headers: { "content-type": "application/json" },
  });
let queryClient: QueryClient;

beforeEach(() => {
  mocks.router.push.mockReset();
  mocks.router.replace.mockReset();
  useAuthStore.getState().clearUser();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
  useAuthStore.getState().clearUser();
  vi.restoreAllMocks();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function submitEvent() {
  return undefined;
}

describe("auth form controllers", () => {
  it("keeps the special missing student account message and skips the request", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useStudentLoginForm(), { wrapper });
    act(() => {
      result.current.setValue("email", "00000000000");
      result.current.setValue("password", "x");
    });

    await act(async () => result.current.submit(submitEvent()));

    expect(result.current.errors.email?.message).toBe(
      "ไม่พบบัญชีผู้ใช้",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("denies non-admin login and preserves the admin role message", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);
      return Promise.resolve(
        url.endsWith("/v1/auth/login")
          ? response({ accessToken: "a", refreshToken: "r" })
          : response(profile),
      );
    });
    const { result } = renderHook(() => useAdminLoginForm(), { wrapper });
    act(() => {
      result.current.setValue("email", "admin@example.com");
      result.current.setValue("password", "secret1");
    });

    await act(async () => result.current.submit(submitEvent()));

    await waitFor(() =>
      expect(result.current.errors.password?.message).toBe(
        "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล",
      ),
    );
    expect(mocks.router.replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("maps the forget form email and clears pending state after success", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: null, status: 0 }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "user@example.com"));

    await act(async () => result.current.submit(submitEvent()));

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/forget-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
    expect(result.current.message).toBe(
      "ระบบได้ส่งรหัสผ่านชั่วคราวไปยังอีเมลของคุณแล้ว โปรดตรวจสอบอีเมล",
    );
    expect(result.current.isPending).toBe(false);
  });

  it("maps reset form data to the existing reference key and navigates on success", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(null));
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useResetPasswordForm("ref-code"), {
      wrapper,
    });
    act(() => {
      result.current.setValue("password", "secret1");
      result.current.setValue("confirmPassword", "secret1");
    });

    await act(async () => result.current.submit(submitEvent()));

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/reset-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ refferenceCode: "ref-code", password: "secret1" }),
      }),
    );
    expect(alert).toHaveBeenCalledWith("เปลี่ยนรหัสผ่านสำเร็จ");
    expect(mocks.router.push).toHaveBeenCalledWith("/auth/login");
  });
});
