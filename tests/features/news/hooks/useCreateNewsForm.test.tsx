// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateNewsForm } from "@/features/news/hooks/useCreateNewsForm";

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  router.push.mockReset();
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function response() {
  return new Response(JSON.stringify({
    data: {
      id: 7,
      title: "News title",
      thumbnailURL: "https://example.test/card.png",
      detail: "News details",
      startDate: "2026-10-08T08:00:00.000Z",
      dueDate: null,
    },
    status: 200,
  }), { headers: { "content-type": "application/json" } });
}

describe("create news form controller", () => {
  it("crops images, preserves detail order/deletion, and sends the API multipart fields", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response());
    const { result } = renderHook(() => useCreateNewsForm(), { wrapper });
    const card = new File(["card"], "card.png", { type: "image/png" });
    const thumbnail = new File(["thumbnail"], "thumbnail.png", { type: "image/png" });
    const firstDetail = new File(["first"], "first.png", { type: "image/png" });
    const secondDetail = new File(["second"], "second.png", { type: "image/png" });

    act(() => {
      result.current.setValue("title", "News title");
      result.current.setValue("detail", "News details");
      result.current.setValue("tagID", 16);
      result.current.setValue("startDate", "2026-10-08T15:00:00+07:00");
      result.current.setValue("dueDate", "2026-10-09T15:00:00+07:00");
    });
    act(() => result.current.addAssets([firstDetail, secondDetail]));
    act(() => result.current.moveAsset(0, 1));
    act(() => result.current.removeAsset(1));
    act(() => result.current.handleFileSelection(card, "card"));
    act(() => result.current.handleCropComplete(card, { x: 0, y: 100 }));
    act(() => result.current.handleFileSelection(thumbnail, "thumbnail"));
    act(() => result.current.handleCropComplete(thumbnail, { x: 100, y: 0 }));

    await act(async () => result.current.submit({ preventDefault: vi.fn(), persist: vi.fn() } as never));

    const body = (fetch.mock.calls[0][1] as RequestInit).body as FormData;
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news",
      expect.objectContaining({ method: "POST", body }),
    );
    expect(Object.fromEntries(body.entries())).toMatchObject({
      title: "News title",
      detail: "News details",
      newsCategoryId: "16",
      eventStartAt: "2026-10-08T08:00:00.000Z",
      eventEndAt: "2026-10-09T08:00:00.000Z",
      cardImage: card,
      thumbnailImage: thumbnail,
      cardFocalPointX: "0",
      cardFocalPointY: "100",
      thumbnailFocalPointX: "100",
      thumbnailFocalPointY: "0",
    });
    expect(body.getAll("detailImages")).toEqual([secondDetail]);
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
  });
});
