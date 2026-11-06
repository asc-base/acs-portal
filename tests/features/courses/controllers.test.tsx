// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCreateCourseController } from "@/features/courses/hooks/use-create-course-controller";
import { useUpdateCourseController } from "@/features/courses/hooks/use-update-course-controller";
import { useCourseListController } from "@/features/courses/hooks/use-course-list-controller";

const { router, searchParams } = vi.hoisted(() => ({
  router: { push: vi.fn(), back: vi.fn(), refresh: vi.fn() },
  searchParams: { toString: vi.fn(() => "page=2&typeCourseID=5&curriculumID=2") },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/admin/courses",
  useSearchParams: () => searchParams,
}));

const course = {
  id: 7,
  courseCode: "CS101",
  courseNameTh: "การเขียนโปรแกรมเบื้องต้น",
  courseNameEn: "Introduction to Programming",
  credits: "3 (3-0-6)",
  detail: "An introductory course",
  typeCourse: { id: 1, type: "Core", description: "Core course" },
  curriculum: {
    id: 2,
    year: "2026",
    title: "Computer Science",
    documentURL: "https://example.test/curriculum.pdf",
    description: "Undergraduate curriculum",
    thumbnailURL: "https://example.test/curriculum.png",
  },
  prerequisites: [],
};
const envelope = (data: unknown, status = 200) =>
  JSON.stringify({ status, data, msg: "Success", err: null });
const page = { rows: [course], totalRecords: 1, page: 1, pageSize: 10 };

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
  searchParams.toString.mockReturnValue("page=2&typeCourseID=5&curriculumID=2");
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("course form controllers", () => {
  it("maps added prerequisite form rows to request IDs and navigates after create", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        new Response(
          envelope(init?.method === "POST" ? course : page),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateCourseController(2), {
      wrapper,
    });
    await waitFor(() => expect(result.current.courses).toEqual([course]));

    act(() => {
      result.current.form.setValue("typeCourseID", 1);
      result.current.form.setValue("courseCode", "CS102");
      result.current.form.setValue("credits", "3 (3-0-6)");
      result.current.form.setValue("courseNameEn", "Data Structures");
      result.current.form.setValue("courseNameTh", "โครงสร้างข้อมูล");
      result.current.form.setValue("detail", "Data structures");
      result.current.form.setValue("preCoursesID", [{ id: 3 }, { id: 0 }]);
    });
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const createCall = fetch.mock.calls.find(([, init]) => init?.method === "POST");
    expect(JSON.parse(createCall?.[1]?.body as string)).toMatchObject({
      curriculumID: 2,
      preCoursesID: [3],
    });
    expect(result.current.confirmModal?.type).toBe("success");
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith(
      "/admin/courses?page=1&pageSize=10&curriculumID=2",
    );
    act(() => queryClient.clear());
  });

  it("sends only added and deleted prerequisite IDs on edit", async () => {
    const existingCourse = {
      ...course,
      prerequisites: [
        { id: 3, courseCode: "CS100", courseNameTh: "พื้นฐาน", courseNameEn: "Basics", credits: "3", detail: "Basics" },
        { id: 4, courseCode: "CS099", courseNameTh: "ก่อน", courseNameEn: "Earlier", credits: "3", detail: "Earlier" },
      ],
    };
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) =>
        new Response(
          envelope(init?.method === "PATCH" ? course : page),
          { headers: { "content-type": "application/json" } },
        ),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(
      () => useUpdateCourseController(2, existingCourse),
      { wrapper },
    );
    await waitFor(() => expect(result.current.courses).toEqual([course]));
    act(() => result.current.form.setValue("preCoursesID", [{ id: 3 }, { id: 5 }]));

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const updateCall = fetch.mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(JSON.parse(updateCall?.[1]?.body as string)).toMatchObject({
      newPrecourseId: [5],
      deletePrecourseId: [4],
    });
    expect(JSON.parse(updateCall?.[1]?.body as string)).not.toHaveProperty("courseCode");
    expect(JSON.parse(updateCall?.[1]?.body as string)).not.toHaveProperty("curriculumID");
    expect(JSON.parse(updateCall?.[1]?.body as string)).not.toHaveProperty("preCoursesID");
    act(() => queryClient.clear());
  });

  it("shows mutation pending and error state when create fails", async () => {
    let finishRequest!: (response: Response) => void;
    let requestStarted!: () => void;
    const started = new Promise<void>((resolve) => (requestStarted = resolve));
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input, init) => {
        if (init?.method === "POST") {
          requestStarted();
          return new Promise<Response>((resolve) => (finishRequest = resolve));
        }
        return new Response(envelope(page), {
          headers: { "content-type": "application/json" },
        });
      },
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateCourseController(2), {
      wrapper,
    });
    await waitFor(() => expect(result.current.courses).toEqual([course]));
    act(() => {
      result.current.form.setValue("typeCourseID", 1);
      result.current.form.setValue("courseCode", "CS102");
      result.current.form.setValue("credits", "3");
      result.current.form.setValue("courseNameEn", "Data Structures");
      result.current.form.setValue("courseNameTh", "โครงสร้างข้อมูล");
      result.current.form.setValue("detail", "Data structures");
      result.current.form.setValue("preCoursesID", []);
    });
    let submission!: Promise<void>;
    act(() => {
      submission = result.current.form.handleSubmit(result.current.onSubmit)();
    });
    await started;
    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => {
      finishRequest(
        new Response(envelope(null, 500), {
          status: 500,
          statusText: "Server Error",
          headers: { "content-type": "application/json" },
        }),
      );
      await submission;
    });
    expect(result.current.isError).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    act(() => queryClient.clear());
  });
});

describe("course list controller", () => {
  it("keeps URL filters while debouncing search and confirms deletion before refresh", async () => {
    vi.useFakeTimers();
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(envelope(course), {
        headers: { "content-type": "application/json" },
      }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCourseListController(), { wrapper });

    act(() => result.current.form.setValue("search", "systems"));
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });
    expect(router.push).toHaveBeenCalledWith(
      "/admin/courses?page=1&typeCourseID=5&curriculumID=2&search=systems",
      { scroll: false },
    );
    vi.useRealTimers();
    router.push.mockClear();
    act(() => result.current.handleSort("courseCode"));
    expect(router.push).toHaveBeenCalledWith(
      "/admin/courses?page=2&typeCourseID=5&curriculumID=2&orderBy=courseCode&sortBy=desc",
      { scroll: false },
    );
    router.push.mockClear();
    act(() => result.current.handleFilterTypeCourse("all"));
    expect(router.push).toHaveBeenCalledWith(
      "/admin/courses?page=1&curriculumID=2",
      { scroll: false },
    );

    act(() => result.current.confirmDeleteCourse(7));
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.refresh).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledOnce();
    act(() => queryClient.clear());
  });

  it("shows a delete error and leaves refresh until successful confirmation", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(envelope(null, 500), {
        status: 500,
        statusText: "Server Error",
        headers: { "content-type": "application/json" },
      }),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCourseListController(), { wrapper });

    act(() => result.current.confirmDeleteCourse(7));
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() =>
      expect(result.current.errorMessage).toBe("ไม่สามารถลบรายวิชาได้"),
    );
    expect(router.refresh).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledOnce();
    act(() => queryClient.clear());
  });
});
