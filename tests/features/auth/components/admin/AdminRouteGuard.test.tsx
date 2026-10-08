// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/shared/domain/user";
import { useAuthStore } from "@/features/auth/store/auth";
import { AdminRouteGuard } from "@/features/auth/components/admin/AdminRouteGuard";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  router: { replace: vi.fn() },
}));
vi.mock("@/features/auth/client", () => ({
  clientAuthService: { getUser: mocks.getUser },
}));
vi.mock("next/navigation", () => ({ useRouter: () => mocks.router }));

const admin: UserProfile = {
  id: 1,
  email: "admin@example.com",
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  roles: [{ id: 1, name: "Admin" }],
};

beforeEach(() => {
  mocks.getUser.mockReset();
  mocks.router.replace.mockReset();
  useAuthStore.getState().clearUser();
  localStorage.clear();
});

afterEach(() => {
  useAuthStore.getState().clearUser();
  localStorage.clear();
});

function deferredProfile() {
  let resolve!: (user: UserProfile | null) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<UserProfile | null>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  mocks.getUser.mockReturnValue(promise);
  return { resolve, reject };
}

function renderGuard() {
  return render(
    <AdminRouteGuard>
      <p>Protected admin content</p>
    </AdminRouteGuard>,
  );
}

describe("AdminRouteGuard", () => {
  it("keeps children hidden with a stale persisted admin until the server authorizes access", async () => {
    const pending = deferredProfile();
    useAuthStore.getState().setUser(admin);
    renderGuard();
    expect(screen.queryByText("Protected admin content")).toBeNull();
    expect(
      screen
        .getByRole("main", { name: "Checking access permission" })
        .getAttribute("aria-busy"),
    ).toBe("true");
    expect(mocks.router.replace).not.toHaveBeenCalled();
    const serverAdmin = {
      ...admin,
      id: 2,
      roles: [{ id: 2, name: " aDmIn " }],
    };
    await act(async () => {
      pending.resolve(serverAdmin);
    });
    expect(screen.getByText("Protected admin content")).toBeTruthy();
    expect(useAuthStore.getState().user).toBe(serverAdmin);
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.router.replace).not.toHaveBeenCalled();
  });

  it("replaces stale admin state with the non-admin profile and redirects without exposing children", async () => {
    const student = { ...admin, id: 2, roles: [{ id: 2, name: "Student" }] };
    useAuthStore.getState().setUser(admin);
    mocks.getUser.mockResolvedValue(student);
    renderGuard();
    await waitFor(() =>
      expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
    );
    expect(useAuthStore.getState().user).toBe(student);
    expect(screen.queryByText("Protected admin content")).toBeNull();
  });

  it.each(["null", "rejection"])(
    "clears stale state and redirects for a %s profile result",
    async (kind) => {
      useAuthStore.getState().setUser(admin);
      if (kind === "null") mocks.getUser.mockResolvedValue(null);
      else mocks.getUser.mockRejectedValue(new Error("profile unavailable"));
      renderGuard();
      await waitFor(() =>
        expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
      );
      expect(useAuthStore.getState().user).toBeNull();
      expect(screen.queryByText("Protected admin content")).toBeNull();
    },
  );

  it("denies a malformed profile with missing roles using the existing catch path", async () => {
    // A missing roles field currently throws in isAdminUser; see KNOWN_ISSUES.md.
    const malformed: Partial<UserProfile> = { ...admin };
    delete malformed.roles;
    mocks.getUser.mockResolvedValue(malformed);
    useAuthStore.getState().setUser(admin);
    renderGuard();
    await waitFor(() =>
      expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
    );
    expect(useAuthStore.getState().user).toBeNull();
    expect(screen.queryByText("Protected admin content")).toBeNull();
  });

  it.each(["admin", "null", "rejection"])(
    "ignores a late %s result after unmount",
    async (kind) => {
      const pending = deferredProfile();
      const { unmount } = renderGuard();
      unmount();
      const newerUser = { ...admin, id: 3, roles: [] };
      useAuthStore.getState().setUser(newerUser);
      await act(async () => {
        if (kind === "rejection") pending.reject(new Error("late failure"));
        else pending.resolve(kind === "admin" ? admin : null);
      });
      expect(useAuthStore.getState().user).toBe(newerUser);
      expect(mocks.router.replace).not.toHaveBeenCalled();
    },
  );
});
