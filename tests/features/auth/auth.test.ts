// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/shared/domain/user";
import { HttpError, HttpHelper } from "@/shared/lib/http";
import { AuthService } from "@/features/auth/service/auth.service";
import { AuthRepository } from "@/features/auth/repositories/auth.repository";
import type { IAuthRepository } from "@/features/auth/ports/auth.repository";
import { ForgetPasswordSchema, ResetPasswordSchema } from "@/features/auth/schema/auth";
import { useAuthStore } from "@/features/auth/store/auth";
import { authErrorHandler } from "@/features/auth/lib/auth-error-handler";
import { isAdminUser } from "@/features/auth/lib/admin-access";

const user: UserProfile = {
  id: 1,
  email: "admin@example.com",
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  roles: [{ id: 1, name: "Admin" }],
};
const credentials = { email: user.email, password: "secret" };

beforeEach(() => {
  useAuthStore.getState().clearUser();
  localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  useAuthStore.getState().clearUser();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("auth schemas", () => {
  it("accepts a valid email and rejects empty or malformed emails", () => {
    expect(ForgetPasswordSchema.parse({ email: user.email })).toEqual({
      email: user.email,
    });
    for (const [email, message] of [
      ["", "กรุณากรอกอีเมล"],
      ["invalid", "รูปแบบอีเมลไม่ถูกต้อง"],
      [" user@example.com ", "รูปแบบอีเมลไม่ถูกต้อง"],
    ]) {
      const result = ForgetPasswordSchema.safeParse({ email });
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0]).toEqual(
          expect.objectContaining({ path: ["email"], message }),
        );
    }
  });

  it("enforces six characters on both passwords with the existing field errors", () => {
    expect(
      ResetPasswordSchema.parse({
        password: "secret",
        confirmPassword: "secret",
      }),
    ).toEqual({
      password: "secret",
      confirmPassword: "secret",
    });
    const result = ResetPasswordSchema.safeParse({
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["password"],
            message: "รหัสผ่านอย่างน้อย 6 ตัวอักษร",
          }),
          expect.objectContaining({
            path: ["confirmPassword"],
            message: "ยืนยันรหัสผ่านอย่างน้อย 6 ตัวอักษร",
          }),
        ]),
      );
    }
  });

  it("attaches password mismatch to confirmPassword", () => {
    const result = ResetPasswordSchema.safeParse({
      password: "secret",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: ["confirmPassword"],
          message: "รหัสผ่านไม่ตรงกัน",
        }),
      ]);
    }
  });
});

describe("AuthService", () => {
  const makeRepository = (): IAuthRepository => ({
    getUserData: vi.fn(),
    Login: vi.fn(),
    createCredentailForgetPassowrd: vi.fn(),
    resetPassword: vi.fn(),
    getUser: vi.fn(),
    Logout: vi.fn(),
  });

  it("unwraps the token profile while preserving cookie-profile null", async () => {
    const repository = makeRepository();
    vi.mocked(repository.getUserData).mockResolvedValue({
      data: user,
      status: 200,
      statusCode: 200,
    });
    vi.mocked(repository.getUser).mockResolvedValue(null);
    const service = new AuthService(repository);
    await expect(service.getUserData("token")).resolves.toBe(user);
    expect(repository.getUserData).toHaveBeenCalledWith("token");
    await expect(service.getUser()).resolves.toBeNull();
  });

  it("forwards auth payloads and results without changing the reset reference key", async () => {
    const repository = makeRepository();
    const service = new AuthService(repository);
    const tokens = {
      data: { accessToken: "access", refreshToken: "refresh" },
      status: 200,
      statusCode: 200,
    };
    const response = { data: { message: "ok" }, status: 200, statusCode: 200 };
    vi.mocked(repository.Login).mockResolvedValue(tokens);
    vi.mocked(repository.createCredentailForgetPassowrd).mockResolvedValue(
      response,
    );
    vi.mocked(repository.resetPassword).mockResolvedValue(response);
    await expect(service.Login(credentials)).resolves.toBe(tokens);
    expect(repository.Login).toHaveBeenCalledWith(credentials);
    await expect(
      service.createCredentailForgetPassowrd({ email: user.email }),
    ).resolves.toBe(response);
    expect(repository.createCredentailForgetPassowrd).toHaveBeenCalledWith({
      email: user.email,
    });
    const reset = { refferenceCode: "reference", password: "secret" };
    await expect(service.resetPassword(reset)).resolves.toBe(response);
    expect(repository.resetPassword).toHaveBeenCalledWith(reset);
  });

  it("awaits logout and propagates repository failures", async () => {
    const repository = makeRepository();
    const error = new Error("unavailable");
    vi.mocked(repository.Logout).mockRejectedValue(error);
    vi.mocked(repository.Login).mockRejectedValue(error);
    const service = new AuthService(repository);
    await expect(service.logout()).rejects.toBe(error);
    await expect(service.Login(credentials)).rejects.toBe(error);
    expect(repository.Logout).toHaveBeenCalledOnce();
  });
});

describe("AuthRepository", () => {
  it("uses the existing auth endpoints, payloads and explicit token header", async () => {
    const response = { data: user };
    const get = vi
      .spyOn(HttpHelper.prototype, "get")
      .mockResolvedValue(response);
    const post = vi
      .spyOn(HttpHelper.prototype, "post")
      .mockResolvedValue(response);
    const repository = new AuthRepository("/api");
    await expect(repository.getUserData("token")).resolves.toBe(response);
    expect(get).toHaveBeenCalledWith("/v1/users/profile", {
      Authorization: "Bearer token",
    });
    await expect(repository.Login(credentials)).resolves.toBe(response);
    expect(post).toHaveBeenLastCalledWith("/v1/auth/login", credentials);
    await repository.createCredentailForgetPassowrd({ email: user.email });
    expect(post).toHaveBeenLastCalledWith("/v1/auth/forget-password", {
      email: user.email,
    });
    await repository.resetPassword({
      refferenceCode: "reference",
      password: "secret",
    });
    expect(post).toHaveBeenLastCalledWith("/v1/auth/reset-password", {
      refferenceCode: "reference",
      password: "secret",
    });
    await expect(repository.Logout()).resolves.toBeUndefined();
    expect(post).toHaveBeenLastCalledWith("/v1/auth/logout");
  });

  it("unwraps cookie-backed profiles and returns null for missing data", async () => {
    const get = vi
      .spyOn(HttpHelper.prototype, "get")
      .mockResolvedValueOnce({ data: user })
      .mockResolvedValueOnce({});
    const repository = new AuthRepository("/api");
    await expect(repository.getUser()).resolves.toBe(user);
    await expect(repository.getUser()).resolves.toBeNull();
    expect(get).toHaveBeenCalledWith("/v1/users/profile");
  });

  it("handles profile/logout 401 but leaves login 401 rejected", async () => {
    const error = new HttpError("expired", 401);
    vi.spyOn(HttpHelper.prototype, "get").mockRejectedValue(error);
    vi.spyOn(HttpHelper.prototype, "post").mockRejectedValue(error);
    const repository = new AuthRepository("/api");
    useAuthStore.getState().setUser(user);
    await expect(repository.getUser()).resolves.toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    useAuthStore.getState().setUser(user);
    await expect(repository.Logout()).resolves.toBeUndefined();
    expect(useAuthStore.getState().user).toBeNull();
    useAuthStore.getState().setUser(user);
    await expect(repository.Login(credentials)).rejects.toBe(error);
    await expect(repository.getUserData("token")).rejects.toBe(error);
    expect(useAuthStore.getState().user).toBe(user);
  });

  it.each([403, 500])(
    "propagates profile/logout HTTP %i and preserves the store",
    async (status) => {
      const error = new HttpError("failed", status);
      vi.spyOn(HttpHelper.prototype, "get").mockRejectedValue(error);
      vi.spyOn(HttpHelper.prototype, "post").mockRejectedValue(error);
      useAuthStore.getState().setUser(user);
      const repository = new AuthRepository("/api");
      await expect(repository.getUser()).rejects.toBe(error);
      await expect(repository.Logout()).rejects.toBe(error);
      expect(useAuthStore.getState().user).toBe(user);
    },
  );
});

describe("store, 401 handling and admin role", () => {
  it("persists replacing and clearing the user without persisting actions", () => {
    useAuthStore.getState().setUser(user);
    expect(useAuthStore.getState().user).toBe(user);
    expect(JSON.parse(localStorage.getItem("auth-storage")!).state).toEqual({
      user,
    });
    const replacement = { ...user, id: 2, roles: [] };
    useAuthStore.getState().setUser(replacement);
    expect(useAuthStore.getState().user).toBe(replacement);
    expect(JSON.parse(localStorage.getItem("auth-storage")!).state).toEqual({
      user: replacement,
    });
    useAuthStore.getState().clearUser();
    expect(useAuthStore.getState().user).toBeNull();
    expect(JSON.parse(localStorage.getItem("auth-storage")!).state).toEqual({
      user: null,
    });
  });

  it("only treats real unauthorized HttpErrors as handled", () => {
    useAuthStore.getState().setUser(user);
    for (const error of [
      new HttpError("forbidden", 403),
      new Error("401"),
      { status: 401 },
      null,
    ]) {
      expect(authErrorHandler.handleAuthError(error)).toBe(false);
      expect(useAuthStore.getState().user).toBe(user);
    }
    expect(
      authErrorHandler.handleAuthError(new HttpError("expired", 401)),
    ).toBe(true);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("preserves successful values, swallows 401, and rethrows other failures", async () => {
    await expect(
      authErrorHandler.withAuthErrorHandling(async () => user),
    ).resolves.toBe(user);
    useAuthStore.getState().setUser(user);
    await expect(
      authErrorHandler.withAuthErrorHandling(async () => {
        throw new HttpError("expired", 401);
      }),
    ).resolves.toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    const error = new Error("network");
    await expect(
      authErrorHandler.withAuthErrorHandling(async () => {
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it("recognizes trimmed case-insensitive admin roles and denies other users", () => {
    expect(isAdminUser({ ...user, roles: [{ id: 1, name: " aDmIn " }] })).toBe(
      true,
    );
    expect(
      isAdminUser({
        ...user,
        roles: [
          { id: 1, name: "Student" },
          { id: 2, name: "Admin" },
        ],
      }),
    ).toBe(true);
    expect(
      isAdminUser({ ...user, roles: [{ id: 1, name: "SuperAdmin" }] }),
    ).toBe(false);
    expect(isAdminUser({ ...user, roles: [] })).toBe(false);
    expect(isAdminUser(null)).toBe(false);
    expect(isAdminUser(undefined)).toBe(false);
  });
});
