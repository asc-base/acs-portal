// @vitest-environment jsdom
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authQueryKeys } from "@/features/auth/client";
import { useAuthStore } from "@/features/auth/store/auth";
import { useCreateStudentController } from "@/features/students/hooks/use-create-student-controller";
import { useStudentListController } from "@/features/students/hooks/use-student-list-controller";
import { useStudentProfileController } from "@/features/students/hooks/use-student-profile-controller";

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn() },
  searchParams: { toString: vi.fn(() => "page=2&classBookID=3&orderBy=studentCode&sortBy=desc") },
}));
vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/admin/students",
  useSearchParams: () => searchParams,
}));

const user = {
  id: 4,
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  roles: [{ id: 2, name: "Student" }],
};
const student = {
  id: 4,
  email: user.email,
  firstNameTh: user.firstNameTh,
  lastNameTh: user.lastNameTh,
  imageUrl: "https://example.test/old.png",
  student: {
    id: 99,
    studentCode: "64000000001",
    classBookID: 3,
    skills: ["TypeScript"],
  },
};
const envelope = (data: unknown, status = 200) =>
  new Response(JSON.stringify({ status, data, msg: "ok", err: null }), {
    status: status >= 400 ? status : 200,
    headers: { "content-type": "application/json" },
  });
let queryClient: QueryClient;

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation((input, init) =>
    Promise.resolve(handler(String(input), init)),
  );
}

beforeEach(() => {
  router.push.mockClear();
  searchParams.toString.mockReturnValue("page=2&classBookID=3&orderBy=studentCode&sortBy=desc");
  useAuthStore.getState().clearUser();
  localStorage.clear();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  vi.useRealTimers();
  queryClient.clear();
  useAuthStore.getState().clearUser();
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("student profile controller", () => {
  it("waits for a fresh current user before loading and exposing that user's profile", async () => {
    let finishSession!: (response: Response) => void;
    const fetch = mockFetch((url) => {
      if (url.endsWith("/v1/users/profile")) {
        return new Promise<Response>((resolve) => (finishSession = resolve));
      }
      if (url.endsWith("/v1/students/user/4")) return envelope(student);
      throw new Error(`Unexpected request: ${url}`);
    });
    queryClient.setQueryData(authQueryKeys.currentUser, { ...user, id: 8 });
    queryClient.setQueryData(["students", "profile", 8], { ...student, id: 8 });

    const { result } = renderHook(() => useStudentProfileController(), { wrapper });

    expect(result.current.student).toBeNull();
    expect(fetch).toHaveBeenCalledOnce();
    await act(async () => finishSession(envelope(user)));
    await waitFor(() => expect(result.current.student).toEqual(student));
    expect(fetch.mock.calls.map(([url]) => url)).toEqual([
      "/api/v1/users/profile",
      "/api/v1/students/user/4",
    ]);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("keeps the student-login redirect when the fresh session is absent", async () => {
    const fetch = mockFetch((url) => {
      if (url.endsWith("/v1/users/profile")) return envelope(null);
      throw new Error(`Unexpected request: ${url}`);
    });
    const { result } = renderHook(() => useStudentProfileController(), { wrapper });

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/auth/student"));
    expect(result.current.student).toBeNull();
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("maps skills and cropped image data, uses the public user ID, and syncs the shared session", async () => {
    let savedStudent = student;
    let requestStarted!: () => void;
    let finishPatch!: (response: Response) => void;
    const started = new Promise<void>((resolve) => (requestStarted = resolve));
    let patchBody: FormData | undefined;
    const fetch = mockFetch((url, init) => {
      if (url.endsWith("/v1/users/profile")) return envelope(user);
      if (url.endsWith("/v1/students/user/4")) return envelope(savedStudent);
      if (url.endsWith("/v1/students/4") && init?.method === "PATCH") {
        patchBody = init.body as FormData;
        requestStarted();
        return new Promise<Response>((resolve) => (finishPatch = resolve));
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    const { result } = renderHook(() => useStudentProfileController(), { wrapper });
    await waitFor(() => expect(result.current.student).toEqual(student));
    const image = new File(["cropped"], "profile.png", { type: "image/png" });
    act(() => {
      result.current.handleEdit();
      result.current.form.setValue("skills", ["TypeScript", "React"]);
      result.current.handleCropComplete(image, { x: 0, y: 100 });
    });

    let submit!: Promise<void>;
    act(() => {
      submit = result.current.form.handleSubmit(result.current.onSubmit)();
    });
    await started;
    await waitFor(() => expect(result.current.isPending).toBe(true));
    expect(String(fetch.mock.calls.find(([url]) => String(url).endsWith("/v1/students/4"))?.[0])).toBe("/api/v1/students/4");
    expect(patchBody?.get("imageFile")).toBe(image);
    expect(patchBody?.getAll("skills")).toEqual(["TypeScript", "React"]);
    expect(patchBody?.get("imageFocalPointX")).toBe("0");
    expect(patchBody?.get("imageFocalPointY")).toBe("100");
    expect(patchBody?.has("classBookID")).toBe(false);

    savedStudent = { ...student, imageUrl: "https://example.test/new.png" };
    await act(async () => {
      finishPatch(envelope(savedStudent));
      await submit;
    });
    await waitFor(() =>
      expect(queryClient.getQueryData(authQueryKeys.currentUser)).toMatchObject({
        id: 4,
        imageUrl: "https://example.test/new.png",
        roles: user.roles,
      }),
    );
    expect(useAuthStore.getState().user).toMatchObject({
      id: 4,
      imageUrl: "https://example.test/new.png",
      roles: user.roles,
    });
    expect(result.current.isEditing).toBe(false);
  });

  it("keeps edit mode open after a failed profile save", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetch = mockFetch((url, init) => {
      if (url.endsWith("/v1/users/profile")) return envelope(user);
      if (url.endsWith("/v1/students/user/4")) return envelope(student);
      if (url.endsWith("/v1/students/4") && init?.method === "PATCH") {
        return envelope({ message: "failed" }, 500);
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    const { result } = renderHook(() => useStudentProfileController(), { wrapper });
    await waitFor(() => expect(result.current.student).toEqual(student));
    act(() => {
      result.current.handleEdit();
      result.current.form.setValue("github", "https://github.com/edited", {
        shouldDirty: true,
      });
    });

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(fetch.mock.calls.some(([url, init]) => String(url).endsWith("/v1/students/4") && init?.method === "PATCH")).toBe(true);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(queryClient.getQueryData(authQueryKeys.currentUser)).toEqual(user);
  });
});

describe("create student controller", () => {
  it("maps form values and cropped image focal points before showing success", async () => {
    let request: FormData | undefined;
    const image = new File(["cropped"], "profile.png", { type: "image/png" });
    const fetch = mockFetch((url, init) => {
      if (url.endsWith("/v1/master-data")) {
        return envelope({ roles: [], typeCourses: [], tagsGroups: [], tags: [], prefixes: [], newsCategories: [] });
      }
      if (url.endsWith("/v1/students") && init?.method === "POST") {
        request = init.body as FormData;
        return envelope(student);
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    const { result } = renderHook(() => useCreateStudentController(3), { wrapper });
    act(() => {
      result.current.form.setValue("prefixID", 1);
      result.current.form.setValue("firstNameTh", "สมชาย");
      result.current.form.setValue("lastNameTh", "ใจดี");
      result.current.form.setValue("firstNameEn", "Somchai");
      result.current.form.setValue("lastNameEn", "Jaidee");
      result.current.form.setValue("studentCode", "64000000001");
      result.current.form.setValue("email", "student@example.com");
      result.current.handleCropComplete(image, { x: 0, y: 100 });
    });

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(fetch.mock.calls.filter(([url]) => String(url).endsWith("/v1/students"))).toHaveLength(1);
    expect(request?.get("prefixID")).toBe("1");
    expect(request?.get("classBookID")).toBe("3");
    expect(request?.get("imageFile")).toBe(image);
    expect(request?.get("imageFocalPointX")).toBe("0");
    expect(request?.get("imageFocalPointY")).toBe("100");
    expect(result.current.confirmModal?.type).toBe("success");
  });
});

describe("student list controller", () => {
  it("keeps URL filters during search and sorting, and confirms delete before redirect", async () => {
    vi.useFakeTimers();
    const fetch = mockFetch((url, init) => {
      if (url.endsWith("/v1/students/4") && init?.method === "DELETE") return envelope(student);
      throw new Error(`Unexpected request: ${url}`);
    });
    const { result } = renderHook(() => useStudentListController(undefined, 3), { wrapper });

    act(() => result.current.form.setValue("search", "somchai"));
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });
    expect(router.push).toHaveBeenCalledWith(
      "/admin/students?page=1&classBookID=3&orderBy=studentCode&sortBy=desc&search=somchai",
      { scroll: false },
    );

    vi.useRealTimers();
    router.push.mockClear();
    act(() => result.current.handleSort("studentCode"));
    expect(router.push).toHaveBeenCalledWith(
      "/admin/students?page=2&classBookID=3&orderBy=studentCode&sortBy=asc",
      { scroll: false },
    );

    act(() => result.current.confirmDeleteStudent(4));
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/students/4",
      expect.objectContaining({ method: "DELETE" }),
    );
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenLastCalledWith(
      "/admin/students?page=1&pageSize=10&classBookID=3",
    );
  });
});
