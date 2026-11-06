// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNewsBulletinManager } from "@/features/news/hooks/useNewsBulletinManager";

const news = {
  id: 7,
  title: "News title",
  thumbnailURL: null,
  detail: "News details",
  startDate: "2026-10-08T08:00:00.000Z",
  dueDate: null,
  images: [],
};
let queryClient: QueryClient;
let enabled = false;

beforeEach(() => {
  enabled = false;
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function response(data: unknown) {
  return new Response(JSON.stringify({ data, status: 200 }), {
    headers: { "content-type": "application/json" },
  });
}

describe("news bulletin manager controller", () => {
  it("submits trimmed searches and retains them when the page changes", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
      String(input).includes("/bulletins")
        ? response([])
        : response({ rows: [news], totalRecords: 25, page: 1, pageSize: 12 }),
    );
    const { result } = renderHook(() => useNewsBulletinManager("HIGHLIGHT"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.rows).toEqual([news]));

    act(() => result.current.setQuery("  ข่าว A&B  "));
    act(() => result.current.submitSearch());
    await waitFor(() => expect(fetch).toHaveBeenLastCalledWith(
      "/api/v1/news/?page=1&pageSize=12&orderBy=createdAt&sortBy=desc&search=%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%20A%26B&searchBy=title",
      expect.objectContaining({ method: "GET" }),
    ));
    act(() => result.current.setPage(2));
    await waitFor(() => expect(fetch).toHaveBeenLastCalledWith(
      "/api/v1/news/?page=2&pageSize=12&orderBy=createdAt&sortBy=desc&search=%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7%20A%26B&searchBy=title",
      expect.objectContaining({ method: "GET" }),
    ));
    expect(result.current.totalPages).toBe(3);
  });

  it("keeps membership while a toggle is pending and exposes failure for retry", async () => {
    let rejectToggle!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) => {
        if (init?.method === "PUT")
          return new Promise((_, reject) => (rejectToggle = reject));
        if (String(_input).includes("/bulletins"))
          return response(enabled ? [{ id: 91, newsID: 7, type: "HIGHLIGHT", news }] : []);
        return response({ rows: [news], totalRecords: 1, page: 1, pageSize: 12 });
      },
    );
    const { result } = renderHook(() => useNewsBulletinManager("HIGHLIGHT"), {
      wrapper,
    });
    await waitFor(() => expect(result.current.rows).toEqual([news]));

    let toggle!: Promise<void>;
    act(() => {
      toggle = result.current.toggle(news);
    });
    await waitFor(() => expect(result.current.busy).toBe(news.id));
    expect(result.current.enabled.has(news.id)).toBe(false);
    await act(async () => {
      rejectToggle(new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "content-type": "application/json" },
      }));
      await toggle;
    });

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.busy).toBeNull();
    expect(result.current.enabled.has(news.id)).toBe(false);
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news/7/bulletins/HIGHLIGHT",
      expect.objectContaining({ method: "PUT" }),
    );

    vi.mocked(fetch).mockImplementation(async (_input, init) => {
      if (init?.method === "PUT") {
        enabled = true;
        return response({ id: 91, newsID: news.id, type: "HIGHLIGHT", news });
      }
      if (String(_input).includes("/bulletins"))
        return response([{ id: 91, newsID: 7, type: "HIGHLIGHT", news }]);
      return response({ rows: [news], totalRecords: 1, page: 1, pageSize: 12 });
    });
    act(() => result.current.clearError());
    await act(async () => result.current.toggle(news));
    await waitFor(() => expect(result.current.enabled.has(news.id)).toBe(true));
  });
});
