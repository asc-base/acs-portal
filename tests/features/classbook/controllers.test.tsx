// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCreateClassbookController } from "@/features/classbook/hooks/use-create-classbook-controller";
import { useClassBookListController } from "@/features/classbook/hooks/use-class-book-list-controller";
import { useUpdateClassbookController } from "@/features/classbook/hooks/use-update-classbook-controller";
import { useClassBooks } from "@/features/classbook/client";

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn(), back: vi.fn(), refresh: vi.fn() },
  searchParams: new URLSearchParams("page=2"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/admin/classbook",
  useSearchParams: () => searchParams,
}));

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
const classbookPage = {
  rows: [classbook],
  totalRecords: 1,
  page: 2,
  pageSize: 10,
};
const curriculumPage = {
  rows: [curriculum],
  totalRecords: 1,
  page: 1,
  pageSize: 10,
};
const envelope = (data: unknown) => ({ status: 200, data, msg: "Success", err: null });

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

beforeEach(() => {
  router.push.mockClear();
  router.back.mockClear();
  router.refresh.mockClear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("classbook form and list controllers", () => {
  it("maps the create form and crop point to its multipart request", async () => {
    const thumbnailFile = new File(["image"], "classbook.png", {
      type: "image/png",
    });
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        new Response(
          JSON.stringify(envelope(init?.method === "POST" ? classbook : curriculumPage)),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateClassbookController(), { wrapper });

    act(() => {
      result.current.form.setValue("classof", "68");
      result.current.form.setValue("firstYearAcademic", "2025");
      result.current.form.setValue("curriculumID", 3);
      result.current.handleUploadComplete(thumbnailFile, { x: 0, y: 75 });
    });
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const body = fetch.mock.calls.find(([, init]) => init?.method === "POST")?.[1]
      ?.body as FormData;
    expect(body.get("classof")).toBe("68");
    expect(body.get("firstYearAcademic")).toBe("2025");
    expect(body.get("curriculumID")).toBe("3");
    expect(body.get("imageFocalPointX")).toBe("0");
    expect(body.get("imageFocalPointY")).toBe("75");
    expect(body.get("thumbnailFile")).toBe(thumbnailFile);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/classbook");
    act(() => queryClient.clear());
  });

  it("maps edit crop metadata and file to the classbook update request", async () => {
    const thumbnailFile = new File(["image"], "updated.png", {
      type: "image/png",
    });
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(envelope(classbook)), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(
      () => useUpdateClassbookController(classbook),
      { wrapper },
    );

    act(() => {
      result.current.form.setValue("classof", "69");
      result.current.handleUploadComplete(thumbnailFile, { x: 15, y: 80 });
    });
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const [url, init] = fetch.mock.calls.find(([, options]) => options?.method === "PATCH")!;
    const body = init?.body as FormData;
    expect(url).toBe("/api/v1/class-books/42");
    expect(body.get("classof")).toBe("69");
    expect(body.has("firstYearAcademic")).toBe(false);
    expect(body.has("curriculumID")).toBe(false);
    expect(body.get("imageFocalPointX")).toBe("15");
    expect(body.get("imageFocalPointY")).toBe("80");
    expect(body.get("thumbnailFile")).toBe(thumbnailFile);
    act(() => result.current.confirmModal?.onConfirm());
    expect(result.current.isEdit).toBe(false);
    act(() => queryClient.clear());
  });

  it("preserves list search and pagination URLs and refreshes after confirmed deletion", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        new Response(
          JSON.stringify(envelope(init?.method === "DELETE" ? classbook : classbookPage)),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useClassBookListController(), { wrapper });
    const list = renderHook(() => useClassBooks({ page: 2 }), { wrapper });
    await waitFor(() => expect(list.result.current.data).toEqual(classbookPage));

    act(() => result.current.form.setValue("search", "68"));
    await waitFor(
      () =>
        expect(router.push).toHaveBeenCalledWith(
          "/admin/classbook?page=1&search=68",
          { scroll: false },
        ),
      { timeout: 2000 },
    );
    router.push.mockClear();
    act(() => result.current.handleNextPage(4));
    expect(router.push).toHaveBeenCalledWith("/admin/classbook?page=4");

    act(() => result.current.confirmDeleteClassbook(42));
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.refresh).toHaveBeenCalledOnce();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch.mock.calls[1]?.[1]?.method).toBe("DELETE");
    expect(list.result.current.data).toEqual(classbookPage);
    act(() => queryClient.clear());
  });
});
