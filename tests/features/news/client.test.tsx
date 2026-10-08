// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { HttpError } from "@/shared/lib/http";
import {
  useNews,
  useNewsBulletins,
  useSetNewsBulletin,
} from "@/features/news/client";

const news = {
  id: 7,
  title: "News title",
  thumbnailURL: null,
  detail: "News details",
  startDate: "2026-10-08T08:00:00.000Z",
  dueDate: null,
  images: [],
};
const bulletin = {
  id: 91,
  newsID: 7,
  type: "ANNOUNCEMENT",
  news,
};
let queryClient: QueryClient;

afterEach(() => {
  vi.restoreAllMocks();
  queryClient.clear();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function setup() {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

describe("news data hooks", () => {
  it("loads validated news pages through the public query hook", async () => {
    setup();
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { rows: [news], totalRecords: 1, page: 1, pageSize: 12 },
          status: 200,
        }),
        { headers: { "content-type": "application/json" } },
      ),
    );
    const { result } = renderHook(
      () => useNews({ page: 1, pageSize: 12, tagID: 16 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.data?.rows).toEqual([news]));
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news/?page=1&pageSize=12&tagID=16&orderBy=startDate&sortBy=desc",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("keeps transport failures visible to query consumers", async () => {
    setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 503, statusText: "Unavailable" }),
    );
    const { result } = renderHook(() => useNews({ page: 1, pageSize: 12 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(HttpError);
    expect((result.current.error as HttpError).status).toBe(503);
  });

  it("loads bulletin membership and refetches it after a successful toggle", async () => {
    setup();
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        init?.method === "DELETE"
          ? new Response(JSON.stringify({ data: null, status: 200 }), {
              headers: { "content-type": "application/json" },
            })
          : new Response(JSON.stringify({ data: [bulletin], status: 200 }), {
              headers: { "content-type": "application/json" },
            }),
    );
    const { result } = renderHook(
      () => ({
        bulletins: useNewsBulletins("ANNOUNCEMENT"),
        toggle: useSetNewsBulletin(),
      }),
      { wrapper },
    );
    await waitFor(() =>
      expect(result.current.bulletins.data).toMatchObject([
        { id: bulletin.id, type: bulletin.type, news: bulletin.news, thumbnailURL: null },
      ]),
    );

    await act(async () => {
      await result.current.toggle.mutateAsync({
        id: news.id,
        type: "ANNOUNCEMENT",
        enabled: false,
      });
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/news/7/bulletins/ANNOUNCEMENT",
      expect.objectContaining({ method: "DELETE" }),
    );
    await waitFor(() =>
      expect(queryClient.getQueryState(["news", "bulletins", "ANNOUNCEMENT"])?.isInvalidated)
        .toBe(false),
    );
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("rejects a malformed PUT DTO and leaves the mutation in its error state", async () => {
    setup();
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        init?.method === "PUT"
          ? new Response(JSON.stringify({ data: null, status: 200 }), {
              headers: { "content-type": "application/json" },
            })
          : new Response(JSON.stringify({ data: [bulletin], status: 200 }), {
              headers: { "content-type": "application/json" },
            }),
    );
    const { result } = renderHook(
      () => ({
        bulletins: useNewsBulletins("ANNOUNCEMENT"),
        toggle: useSetNewsBulletin(),
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.bulletins.data).toBeDefined());

    await act(async () => {
      await expect(
        result.current.toggle.mutateAsync({
          id: news.id,
          type: "ANNOUNCEMENT",
          enabled: true,
        }),
      ).rejects.toBeInstanceOf(ZodError);
    });

    await waitFor(() => expect(result.current.toggle.isError).toBe(true));
    expect(result.current.toggle.isSuccess).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      queryClient.getQueryState(["news", "bulletins", "ANNOUNCEMENT"])
        ?.isInvalidated,
    ).toBe(false);
  });
});
