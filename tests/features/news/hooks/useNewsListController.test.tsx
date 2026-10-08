// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNewsListController } from "@/features/news/hooks/useNewsListController";

const navigation = vi.hoisted(() => ({
  pathname: "/admin/news",
  params: new URLSearchParams("page=3&search=News&searchBy=title&tab=active"),
  router: { push: vi.fn(), refresh: vi.fn() },
}));
vi.mock("next/navigation", () => ({
  useRouter: () => navigation.router,
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.params,
}));

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  navigation.router.push.mockReset();
  navigation.router.refresh.mockReset();
  navigation.params = new URLSearchParams("page=3&search=News&searchBy=title&tab=active");
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("news list controller", () => {
  it("debounces search and preserves unrelated URL parameters when cleared", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useNewsListController(), { wrapper });

    act(() => result.current.resetSearch());
    await act(async () => vi.advanceTimersByTimeAsync(500));

    expect(navigation.router.push).toHaveBeenCalledWith(
      "/admin/news?page=3&tab=active",
      { scroll: false },
    );
  });

  it("resets pagination when changing the category while keeping other filters", () => {
    const { result } = renderHook(() => useNewsListController(), { wrapper });

    act(() => result.current.handleFilterCategory("17"));

    expect(navigation.router.push).toHaveBeenCalledWith(
      "/admin/news?page=1&search=News&searchBy=title&tab=active&tagID=17",
      { scroll: false },
    );
  });

  it("keeps delete confirmation and refreshes after the delete mutation succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        data: {
          id: 7,
          title: "News title",
          thumbnailURL: null,
          detail: "News details",
          startDate: "2026-10-08T08:00:00.000Z",
          dueDate: null,
        },
        status: 200,
      }), { headers: { "content-type": "application/json" } }),
    );
    const { result } = renderHook(() => useNewsListController(), { wrapper });

    act(() => result.current.confirmDeleteNews(7));
    expect(result.current.confirmModal?.type).toBe("delete");
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    act(() => result.current.confirmModal?.onConfirm());
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });
});
