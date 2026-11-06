// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ZodError } from "zod";
import { useMasterData } from "@/features/master-data/client";

const data = {
  roles: [],
  typeCourses: [],
  tagsGroups: [],
  tags: [],
  prefixes: [],
  newsCategories: [],
};

afterEach(() => vi.restoreAllMocks());

describe("useMasterData", () => {
  it("loads and shares validated lookup data through its public query", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data, status: 200, msg: "Success", err: null }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const first = renderHook(() => useMasterData(), { wrapper });
    const second = renderHook(() => useMasterData(), { wrapper });

    await waitFor(() => expect(first.result.current.data).toEqual(data));
    expect(second.result.current.data).toEqual(data);
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/master-data",
      expect.objectContaining({ method: "GET" }),
    );
    act(() => queryClient.clear());
  });

  it("exposes invalid API data as a query error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { ...data, prefixes: [{ id: 1 }] } }), {
        headers: { "content-type": "application/json" },
      }),
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useMasterData(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(ZodError);
    act(() => queryClient.clear());
  });
});
