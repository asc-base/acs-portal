// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/lib/http";
import { useClassBooks, useCreateClassBook } from "@/features/classbook/client";

const curriculum = {
  id: 3,
  year: "2025",
  title: "Applied Computer Science",
  documentURL: "https://example.test/curriculum.pdf",
  description: "Undergraduate curriculum",
  thumbnailURL: "https://example.test/curriculum.png",
};
const classbook = {
  id: 42,
  classof: "68",
  firstYearAcademic: "2025",
  thumbnailURL: "https://example.test/classbook.png",
  thumbnailContentType: null,
  curriculumID: 3,
  curriculum,
};
const page = { rows: [classbook], totalRecords: 1, page: 1, pageSize: 10 };
const envelope = (data: unknown) => ({ status: 200, data, msg: "Success", err: null });

let queryClient: QueryClient;

afterEach(() => {
  vi.restoreAllMocks();
  queryClient.clear();
});

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

describe("classbook client hooks", () => {
  it("exposes pending and success and invalidates the list after create", async () => {
    let finishRequest!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        init?.method === "GET"
          ? Promise.resolve(
              new Response(JSON.stringify(envelope(page)), {
                headers: { "content-type": "application/json" },
              }),
            )
          : new Promise((resolve) => (finishRequest = resolve)),
    );
    const wrapper = createWrapper();
    const list = renderHook(() => useClassBooks({}), { wrapper });
    const create = renderHook(() => useCreateClassBook(), { wrapper });
    queryClient.setQueryData(["class-books", "list", { page: 1 }], page);

    await waitFor(() => expect(list.result.current.data).toEqual(page));
    let mutation!: Promise<unknown>;
    act(() => {
      mutation = create.result.current.mutateAsync({
        data: { classof: "68", firstYearAcademic: "2025", curriculumID: 3 },
        thumbnailFile: new File(["image"], "classbook.png", {
          type: "image/png",
        }),
      });
    });
    await waitFor(() => expect(create.result.current.isPending).toBe(true));
    await act(async () => {
      finishRequest(
        new Response(JSON.stringify(envelope(classbook)), {
          headers: { "content-type": "application/json" },
        }),
      );
      await expect(mutation).resolves.toEqual(classbook);
    });

    expect(fetch.mock.calls[1]?.[1]).toMatchObject({
      method: "POST",
      body: expect.any(FormData),
    });
    expect(queryClient.getQueryState(["class-books", "list", { page: 1 }])?.isInvalidated)
      .toBe(true);
    await waitFor(() => expect(create.result.current.isSuccess).toBe(true));
  });

  it("keeps HTTP status and mutation error state on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "forbidden" }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "content-type": "application/json" },
      }),
    );
    const wrapper = createWrapper();
    const create = renderHook(() => useCreateClassBook(), { wrapper });

    await act(async () => {
      await expect(
        create.result.current.mutateAsync({
          data: { classof: "68", firstYearAcademic: "2025", curriculumID: 3 },
          thumbnailFile: new File(["image"], "classbook.png", {
            type: "image/png",
          }),
        }),
      ).rejects.toBeInstanceOf(HttpError);
    });
    await waitFor(() => expect(create.result.current.isError).toBe(true));
    expect(create.result.current.error).toMatchObject({ status: 403 });
  });
});
