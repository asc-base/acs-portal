// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProfessorListController } from "@/features/professors/hooks/useProfessorListController";

const navigation = vi.hoisted(() => ({
  pathname: "/admin/professors",
  params: new URLSearchParams("page=3&search=Somchai&searchBy=firstNameTh&tab=active"),
  router: { push: vi.fn(), refresh: vi.fn() },
}));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation.router,
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.params,
}));

const professor = {
  id: 9,
  email: "somchai@example.test",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  professor: {
    id: 31,
    profRoom: "A201",
    phone: "0812345678",
    expertFields: [],
    educations: [],
    research_profile: null,
  },
};
let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  navigation.router.push.mockReset();
  navigation.router.refresh.mockReset();
  navigation.params = new URLSearchParams(
    "page=3&search=Somchai&searchBy=firstNameTh&tab=active",
  );
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("professor list controller", () => {
  it("debounces search changes and preserves unrelated URL parameters", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useProfessorListController(), { wrapper });
    act(() => result.current.resetSearch());
    await act(async () => vi.advanceTimersByTimeAsync(500));

    expect(navigation.router.push).toHaveBeenCalledWith(
      "/admin/professors?page=1&tab=active",
      { scroll: false },
    );
  });

  it("preserves the server URL filters while changing the page", () => {
    const { result } = renderHook(() => useProfessorListController(), { wrapper });

    act(() => result.current.handleNextPage(5));

    expect(navigation.router.push).toHaveBeenCalledWith(
      "/admin/professors?page=5&search=Somchai&searchBy=firstNameTh&tab=active",
      { scroll: false },
    );
  });

  it("keeps the delete confirmation and refreshes SSR data after success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: professor, status: 200 }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useProfessorListController(), { wrapper });

    act(() => result.current.confirmDeleteProfessor(9));
    expect(result.current.confirmModal?.type).toBe("delete");
    await act(async () => {
      await result.current.confirmModal?.onConfirm();
    });
    expect(result.current.confirmModal?.type).toBe("success");

    act(() => result.current.confirmModal?.onConfirm());
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });
});
