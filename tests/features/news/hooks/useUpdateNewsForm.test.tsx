// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { INews } from "@/features/news/domain/news";
import { useUpdateNewsForm } from "@/features/news/hooks/useUpdateNewsForm";

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const news: INews = {
  id: 7,
  title: "News title",
  thumbnailURL: "https://example.test/card.png",
  detail: "News details",
  startDate: "2026-10-08T08:00:00.000Z",
  dueDate: null,
  tag: { id: 1, name: "News", tagsGroupsId: 1 },
  category: { id: 2, code: "NEWS", name: "News" },
  images: [
    { id: 1, imageID: 1, imageType: "CARD", imageUrl: "https://example.test/card.png", focalPointX: 50, focalPointY: 50, sortOrder: 0 },
    { id: 2, imageID: 2, imageType: "THUMBNAIL", imageUrl: "https://example.test/thumbnail.png", focalPointX: 25, focalPointY: 75, sortOrder: 0 },
    { id: 11, imageID: 11, imageType: "DETAIL", imageUrl: "https://example.test/first.png", focalPointX: null, focalPointY: null, sortOrder: 0 },
    { id: 12, imageID: 12, imageType: "DETAIL", imageUrl: "https://example.test/second.png", focalPointX: null, focalPointY: null, sortOrder: 1 },
  ],
};
let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  router.push.mockReset();
  router.refresh.mockReset();
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify({ data, status }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("update news form controller", () => {
  it("reorders, removes, and uploads details while mapping the update request", async () => {
    const updated = {
      ...news,
      title: "Changed title",
      newsAdditionalImages: [{ id: 99, imageUrl: "https://example.test/new.png" }],
    };
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) =>
      init?.method === "PATCH" ? response(updated) : response(updated),
    );
    const { result } = renderHook(() => useUpdateNewsForm(news), { wrapper });
    const added = new File(["added"], "added.png", { type: "image/png" });

    act(() => result.current.startEditing());
    act(() => result.current.setValue("title", "Changed title", { shouldDirty: true }));
    act(() => result.current.moveAsset(0, 1));
    act(() => result.current.removeAsset(1));
    act(() => result.current.addAssets([added]));
    await act(async () => result.current.submit({ preventDefault: vi.fn(), persist: vi.fn() } as never));

    const patch = fetch.mock.calls.find(([, init]) => init?.method === "PATCH");
    const body = patch?.[1]?.body as FormData;
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news/7",
      expect.objectContaining({ method: "PATCH", body }),
    );
    expect(body.get("title")).toBe("Changed title");
    expect(body.get("newsCategoryId")).toBe("2");
    expect(body.getAll("detailImages")).toEqual([added]);
    expect(body.get("deletedImageIds")).toBe("[11]");
    expect(body.get("detailImageOrder")).toBe('["12","new:0"]');
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news/7",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("exposes failed saves through mutation state without a success modal", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response({ message: "Forbidden" }, 403));
    const { result } = renderHook(() => useUpdateNewsForm(news), { wrapper });
    act(() => result.current.startEditing());
    act(() => result.current.setValue("title", "Changed title", { shouldDirty: true }));
    await act(async () => result.current.submit({ preventDefault: vi.fn(), persist: vi.fn() } as never));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isPending).toBe(false);
    expect(result.current.confirmModal).toBeNull();
  });
});
