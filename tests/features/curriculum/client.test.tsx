// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ZodError } from "zod";
import {
  useCreateCurriculum,
  useCurriculums,
} from "@/features/curriculum/client";

const curriculum = {
  id: 42,
  title: "Curriculum 2025",
  year: "2025",
  documentURL: "https://drive.google.com/file/d/curriculum/view",
  description: "Undergraduate curriculum",
  thumbnailURL: "https://example.test/curriculum.png",
  thumbnailContentType: null,
  thumbnailFocalPointX: null,
  thumbnailFocalPointY: 75,
};
const page = { rows: [curriculum], totalRecords: 1, page: 1, pageSize: 10 };
const envelope = (data: unknown) => ({ status: 200, data, msg: "Success", err: null });

afterEach(() => vi.restoreAllMocks());

function createWrapper(queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

describe("curriculum client hooks", () => {
  it("shares a validated list query under its filter key", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(envelope(page)), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const query = { orderBy: "year", sortBy: "desc" as const };
    const first = renderHook(() => useCurriculums(query), { wrapper });
    const second = renderHook(() => useCurriculums(query), { wrapper });

    await waitFor(() => expect(first.result.current.data).toEqual(page));
    expect(second.result.current.data).toEqual(page);
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/curriculums?page=1&pageSize=10&sortBy=desc&orderBy=year",
      expect.objectContaining({ method: "GET" }),
    );
    act(() => queryClient.clear());
  });

  it("surfaces malformed API DTOs as query errors without retrying", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(envelope({ ...page, rows: [{ id: 42 }] })), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCurriculums({}), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(ZodError);
    expect(fetch).toHaveBeenCalledOnce();
    act(() => queryClient.clear());
  });

  it("invalidates active curriculum lists after a successful create", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        new Response(
          JSON.stringify(
            envelope(init?.method === "POST" ? curriculum : page),
          ),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const { queryClient, wrapper } = createWrapper();
    const list = renderHook(() => useCurriculums({}), { wrapper });
    const create = renderHook(() => useCreateCurriculum(), { wrapper });
    await waitFor(() => expect(list.result.current.data).toEqual(page));

    await act(async () => {
      await create.result.current.mutateAsync({
        data: {
          title: curriculum.title,
          year: curriculum.year,
          documentURL: curriculum.documentURL,
          description: curriculum.description,
        },
        thumbnailFile: new File(["image"], "curriculum.png", {
          type: "image/png",
        }),
      });
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[1]?.[1]?.method).toBe("POST");
    act(() => queryClient.clear());
  });
});
