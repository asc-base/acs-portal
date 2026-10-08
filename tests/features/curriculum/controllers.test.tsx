// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useCreateCurriculumController } from "@/features/curriculum/hooks/use-create-curriculum-controller";
import { useCurriculumListController } from "@/features/curriculum/hooks/use-curriculum-list-controller";
import { useUpdateCurriculumController } from "@/features/curriculum/hooks/use-update-curriculum-controller";

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn(), back: vi.fn(), refresh: vi.fn() },
  searchParams: new URLSearchParams("page=2"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/admin/curriculum",
  useSearchParams: () => searchParams,
}));

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

describe("curriculum form and list controllers", () => {
  it("maps the create year and crop point to the multipart request", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(envelope(curriculum)), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateCurriculumController(), {
      wrapper,
    });
    const thumbnailFile = new File(["image"], "curriculum.png", {
      type: "image/png",
    });

    act(() => {
      result.current.form.setValue("title", curriculum.title);
      result.current.form.setValue("year", "2025-01-01");
      result.current.form.setValue("documentURL", curriculum.documentURL);
      result.current.form.setValue("description", curriculum.description);
      result.current.handleUploadComplete(thumbnailFile, { x: 0, y: 75 });
    });
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const body = fetch.mock.calls[0]?.[1]?.body as FormData;
    expect(body.get("year")).toBe("2025");
    expect(body.get("thumbnailFocalPointX")).toBe("0");
    expect(body.get("thumbnailFocalPointY")).toBe("75");
    expect(body.get("thumbnailFile")).toBe(thumbnailFile);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/curriculum");
    act(() => queryClient.clear());
  });

  it("maps the update year and selected thumbnail, then keeps its course navigation", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(envelope(curriculum)), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(
      () => useUpdateCurriculumController(curriculum),
      { wrapper },
    );
    const thumbnailFile = new File(["image"], "updated.png", {
      type: "image/png",
    });

    act(() => {
      result.current.form.setValue("year", "2026-01-01");
      result.current.handleUploadComplete(thumbnailFile, { x: 15, y: 80 });
    });
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const [url, init] = fetch.mock.calls[0]!;
    const body = init?.body as FormData;
    expect(url).toBe("/api/v1/curriculums/42");
    expect(init?.method).toBe("PATCH");
    expect(body.get("year")).toBe("2026");
    expect(body.get("thumbnailFocalPointX")).toBe("15");
    expect(body.get("thumbnailFile")).toBe(thumbnailFile);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith(
      "/admin/courses?page=1&pageSize=10&curriculumID=42",
    );
    act(() => queryClient.clear());
  });

  it("warns before abandoning dirty curriculum form values", () => {
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateCurriculumController(), {
      wrapper,
    });

    act(() => {
      result.current.form.setValue("title", "Unsaved title", {
        shouldDirty: true,
      });
    });
    act(() => result.current.handleCancel());

    expect(result.current.confirmModal?.type).toBe("warning");
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.back).toHaveBeenCalledOnce();
    act(() => queryClient.clear());
  });

  it("debounces year search into the existing URL and reports delete failures", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Unavailable" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCurriculumListController(), {
      wrapper,
    });

    act(() => result.current.form.setValue("year", "2025"));
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });
    expect(router.push).toHaveBeenCalledWith(
      "/admin/curriculum?page=1&year=2025",
      { scroll: false },
    );
    router.push.mockClear();
    act(() => result.current.handleNextPage(4));
    expect(router.push).toHaveBeenCalledWith("/admin/curriculum?page=4");

    await act(async () => result.current.handleDelete(42));
    expect(result.current.isError).toBe(true);
    expect(result.current.confirmModal).toBeNull();
    expect(fetch).toHaveBeenCalledOnce();
    act(() => queryClient.clear());
  });
});
