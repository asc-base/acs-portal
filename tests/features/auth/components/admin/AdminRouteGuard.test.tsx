// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/shared/domain/user";
import { useAuthStore } from "@/features/auth/store/auth";
import { AdminRouteGuard } from "@/features/auth/components/admin/AdminRouteGuard";

const mocks = vi.hoisted(() => ({
  session: {
    data: undefined as UserProfile | null | undefined,
    isFetchedAfterMount: false,
    isFetching: true,
    isError: false,
  },
  router: { replace: vi.fn() },
}));
vi.mock("@/features/auth/client", () => ({
  useCurrentUser: () => mocks.session,
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
  mocks.session = {
    data: undefined,
    isFetchedAfterMount: false,
    isFetching: true,
    isError: false,
  };
  mocks.router.replace.mockReset();
  useAuthStore.getState().clearUser();
  localStorage.clear();
});

afterEach(() => {
  useAuthStore.getState().clearUser();
  localStorage.clear();
});

function renderGuard() {
  return render(
    <AdminRouteGuard>
      <p>Protected admin content</p>
    </AdminRouteGuard>,
  );
}

describe("AdminRouteGuard", () => {
  it("waits for a fresh server profile before exposing a persisted admin", async () => {
    useAuthStore.getState().setUser(admin);
    const view = renderGuard();
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
    act(() => {
      mocks.session = {
        data: serverAdmin,
        isFetchedAfterMount: true,
        isFetching: false,
        isError: false,
      };
      view.rerender(
        <AdminRouteGuard>
          <p>Protected admin content</p>
        </AdminRouteGuard>,
      );
    });

    expect(screen.getByText("Protected admin content")).toBeTruthy();
    expect(useAuthStore.getState().user).toBe(serverAdmin);
    expect(mocks.router.replace).not.toHaveBeenCalled();
  });

  it("hides previously authorized content while fresh validation is pending and after it denies access", async () => {
    mocks.session = {
      data: admin,
      isFetchedAfterMount: true,
      isFetching: false,
      isError: false,
    };
    const view = renderGuard();
    await waitFor(() =>
      expect(screen.getByText("Protected admin content")).toBeTruthy(),
    );

    act(() => {
      mocks.session = {
        data: admin,
        isFetchedAfterMount: true,
        isFetching: true,
        isError: false,
      };
      view.rerender(
        <AdminRouteGuard>
          <p>Protected admin content</p>
        </AdminRouteGuard>,
      );
    });
    expect(screen.queryByText("Protected admin content")).toBeNull();

    const student = { ...admin, id: 2, roles: [{ id: 2, name: "Student" }] };
    act(() => {
      mocks.session = {
        data: student,
        isFetchedAfterMount: true,
        isFetching: false,
        isError: false,
      };
      view.rerender(
        <AdminRouteGuard>
          <p>Protected admin content</p>
        </AdminRouteGuard>,
      );
    });
    await waitFor(() =>
      expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
    );
    expect(screen.queryByText("Protected admin content")).toBeNull();
    expect(useAuthStore.getState().user).toBe(student);
  });

  it("hides children and clears identity when a fresh profile request fails after authorization", async () => {
    mocks.session = {
      data: admin,
      isFetchedAfterMount: true,
      isFetching: false,
      isError: false,
    };
    const view = renderGuard();
    await waitFor(() =>
      expect(screen.getByText("Protected admin content")).toBeTruthy(),
    );

    act(() => {
      mocks.session = {
        data: admin,
        isFetchedAfterMount: true,
        isFetching: false,
        isError: true,
      };
      view.rerender(
        <AdminRouteGuard>
          <p>Protected admin content</p>
        </AdminRouteGuard>,
      );
    });

    await waitFor(() =>
      expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
    );
    expect(screen.queryByText("Protected admin content")).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("replaces a persisted admin with the current non-admin profile and redirects", async () => {
    const student = { ...admin, id: 2, roles: [{ id: 2, name: "Student" }] };
    useAuthStore.getState().setUser(admin);
    mocks.session = {
      data: student,
      isFetchedAfterMount: true,
      isFetching: false,
      isError: false,
    };

    renderGuard();
    await waitFor(() =>
      expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
    );
    expect(useAuthStore.getState().user).toBe(student);
    expect(screen.queryByText("Protected admin content")).toBeNull();
  });

  it.each(["unauthenticated", "invalid profile"]) (
    "clears persisted admin and redirects for %s session data",
    async (kind) => {
      useAuthStore.getState().setUser(admin);
      mocks.session = {
        data: kind === "unauthenticated" ? null : undefined,
        isFetchedAfterMount: true,
        isFetching: false,
        isError: kind === "invalid profile",
      };

      renderGuard();
      await waitFor(() =>
        expect(mocks.router.replace).toHaveBeenCalledWith("/home"),
      );
      expect(useAuthStore.getState().user).toBeNull();
      expect(screen.queryByText("Protected admin content")).toBeNull();
    },
  );
});
