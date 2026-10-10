// @vitest-environment jsdom
import type { ReactNode } from "react";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminLoginForm } from "@/features/auth/hooks/useAdminLoginForm";
import { useForgetPasswordForm } from "@/features/auth/hooks/useForgetPasswordForm";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";
import { useStudentLoginForm } from "@/features/auth/hooks/useStudentLoginForm";
import { useAuthStore } from "@/features/auth/store/auth";
import ForgetPasswordAuthLandingPage from "@/features/auth/components/public/forget-password/forgetpassword.auth";

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
  it("replaces the forget-password form with confirmation after success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(null));
    render(<ForgetPasswordAuthLandingPage />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText("xxxxxxxx@kmutt.ac.th"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ส่งลิงก์ตั้งรหัสผ่านใหม่" }));

    expect(
      await screen.findByRole("heading", {
        name: "ส่งลิงก์ตั้งรหัสผ่านไปยังอีเมลแล้ว",
      }),
    ).toBeTruthy();
    expect(screen.queryByPlaceholderText("xxxxxxxx@kmutt.ac.th")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "ส่งลิงก์ตั้งรหัสผ่านใหม่" }),
    ).toBeNull();
    expect(
      screen.getByText(
        "หากอีเมลนี้มีบัญชีในระบบ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ โปรดตรวจสอบอีเมล",
      ),
    ).toBeTruthy();
  });

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
      new Response(JSON.stringify({ data: null, status: 200 }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "user@example.com"));

    await act(async () => result.current.submit(submitEvent()));

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/credentials",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
    expect(result.current.message).toBe(
      "หากอีเมลนี้มีบัญชีในระบบ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ โปรดตรวจสอบอีเมล",
    );
    expect(result.current.isPending).toBe(false);
  });

  it("posts the reset token and new password, then returns to student login", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response(null));
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useResetPasswordForm("reset/token"), {
      wrapper,
    });
    act(() => {
      result.current.setValue("password", "secret1");
      result.current.setValue("confirmPassword", "secret1");
    });

    await act(async () => result.current.submit(submitEvent()));

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/reset-password/reset%2Ftoken",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ newPassword: "secret1" }),
      }),
    );
    expect(alert).toHaveBeenCalledWith("เปลี่ยนรหัสผ่านสำเร็จ");
    expect(mocks.router.replace).toHaveBeenCalledWith("/auth/student");
  });

  it("shows an error and stays on the page when password reset fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "invalid token" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useResetPasswordForm("expired"), {
      wrapper,
    });
    act(() => {
      result.current.setValue("password", "secret1");
      result.current.setValue("confirmPassword", "secret1");
    });

    await act(async () => result.current.submit(submitEvent()));

    expect(result.current.errorMessage).toBe(
      "เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่หรือขอลิงก์ใหม่",
    );
    expect(mocks.router.replace).not.toHaveBeenCalled();
  });

  it("rejects malformed emails before sending a reset request", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "invalid"));

    await act(async () => result.current.submit(submitEvent()));

    expect(result.current.errors.email?.message).toBe("รูปแบบอีเมลไม่ถูกต้อง");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a request error and clears pending state after failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "user@example.com"));

    await act(async () => result.current.submit(submitEvent()));

    expect(result.current.isError).toBe(true);
    expect(result.current.message).toBe("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    expect(result.current.isPending).toBe(false);
  });

  it("uses the same response for an unknown email", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: null, status: 404 }), {
        status: 404,
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "user@example.com"));

    await act(async () => result.current.submit(submitEvent()));

    expect(result.current.isError).toBe(false);
    expect(result.current.message).toBe(
      "หากอีเมลนี้มีบัญชีในระบบ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ โปรดตรวจสอบอีเมล",
    );
  });

  it("keeps the request pending until the API responds", async () => {
    let resolveResponse!: (response: Response) => void;
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise<Response>((resolve) => (resolveResponse = resolve)),
    );
    const { result } = renderHook(() => useForgetPasswordForm(), { wrapper });
    act(() => result.current.setValue("email", "user@example.com"));

    act(() => result.current.submit(submitEvent()));

    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => resolveResponse(response(null)));

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
