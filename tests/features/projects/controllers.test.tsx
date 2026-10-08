// @vitest-environment jsdom
import type { ChangeEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateProjectController } from "@/features/projects/hooks/use-create-project-controller";
import { useUpdateProjectController } from "@/features/projects/hooks/use-update-project-controller";
import { useProjectListController } from "@/features/projects/hooks/use-project-list-controller";
import type { IProject } from "@/features/projects/schema/project";
import { projectEnvelope, projectFixture } from "./fixtures";

const { router } = vi.hoisted(() => ({
  router: { push: vi.fn(), refresh: vi.fn() },
}));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

const image = (name: string) => new File([name], name, { type: "image/png" });
const filesEvent = (files: File[]) => ({ target: { files } }) as unknown as ChangeEvent<HTMLInputElement>;
const setValidForm = (form: ReturnType<typeof useCreateProjectController>["form"]) => {
  form.setValue("title", "Project");
  form.setValue("details", "Project details");
  form.setValue("youtubeURL", "https://youtube.com/watch?v=123");
  form.setValue("githubURL", "https://github.com/kmutt/project");
  form.setValue("documentURL", "https://example.test/document");
  form.setValue("presentationURL", "https://example.test/presentation");
  form.setValue("projectCourses", [{ value: 3 }, { value: 8 }]);
  form.setValue("projectTypes", [{ value: 1 }]);
  form.setValue("projectCategories", [{ value: 2 }]);
  form.setValue("techStacks", [{ value: "TypeScript" }]);
  form.setValue("students", [{ userID: 7 }]);
  form.setValue("advisors", [{ userID: 9 }]);
};

beforeEach(() => {
  router.push.mockClear();
  router.refresh.mockClear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("project form controllers", () => {
  it("maps create members and focal points and caps and reorders selected assets", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(projectEnvelope(projectFixture)), { headers: { "content-type": "application/json" } }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useCreateProjectController(), { wrapper });
    const thumbnail = image("thumbnail.png");
    const assets = Array.from({ length: 12 }, (_, index) => image(`asset-${index}.png`));

    act(() => {
      setValidForm(result.current.form);
      result.current.handleCropComplete(thumbnail, { x: 0, y: 75 });
      result.current.handleAssetsChange(filesEvent(assets));
      result.current.handleDragStart(0);
      result.current.handleDrop(1);
    });
    expect(result.current.selectedAssets).toHaveLength(10);
    expect(result.current.selectedAssets.slice(0, 2)).toEqual([assets[1], assets[0]]);

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const body = fetch.mock.calls[0]?.[1]?.body as FormData;
    expect(body.get("members")).toBe('[{"userID":7,"roleID":2},{"userID":9,"roleID":3}]');
    expect(body.get("coursesID")).toBe("[3,8]");
    expect(body.get("thumbnailFocalPointX")).toBe("0");
    expect(body.get("thumbnailFocalPointY")).toBe("75");
    expect(body.get("thumbnailFile")).toBe(thumbnail);
    expect(body.getAll("assets")).toEqual(result.current.selectedAssets);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/projects");
    act(() => queryClient.clear());
  });

  it("sends literal update diffs with the existing role IDs and thumbnail files", async () => {
    const project: IProject = {
      ...projectFixture,
      tag: [...projectFixture.tag, { id: 6, name: "Old category", tagsGroupsId: 3 }],
      member: [
        ...projectFixture.member,
        { ...projectFixture.member[0]!, id: 9, email: "advisor@example.test", role: { id: 3, name: "Advisor" } },
      ],
    };
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(projectEnvelope(projectFixture)), { headers: { "content-type": "application/json" } }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateProjectController("17", project), { wrapper });
    const thumbnail = image("updated-thumbnail.png");
    const assets = Array.from({ length: 10 }, (_, index) => image(`updated-${index}.png`));

    act(() => {
      result.current.form.setValue("projectCourses", [{ value: 8 }]);
      result.current.form.setValue("projectTypes", [{ value: 2 }]);
      result.current.form.setValue("projectCategories", [{ value: 5 }]);
      result.current.form.setValue("students", [{ userID: 11 }]);
      result.current.form.setValue("advisors", [{ userID: 9 }]);
      result.current.handleCropComplete(thumbnail, { x: -10, y: 120 });
      result.current.handleAssetsChange(filesEvent(assets));
    });
    expect(result.current.selectedAssets).toHaveLength(9);
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const body = fetch.mock.calls[0]?.[1]?.body as FormData;
    expect(body.get("newCoursesID")).toBe("[8]");
    expect(body.get("deletedCoursesID")).toBe("[3]");
    expect(body.get("newtagsID")).toBe("[5]");
    expect(body.get("deletedtagsID")).toBe("[6]");
    expect(body.get("newMembers")).toBe('[{"userID":11,"roleID":2}]');
    expect(body.get("deletedmembersID")).toBe("[7]");
    expect(body.get("thumbnailFile")).toBe(thumbnail);
    expect(body.get("thumbnailFocalPointX")).toBe("-10");
    expect(body.get("thumbnailFocalPointY")).toBe("120");
    expect(body.getAll("assets")).toEqual(result.current.selectedAssets);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/projects");
    act(() => queryClient.clear());
  });
});

describe("project list controller", () => {
  it("keeps debounced search/pagination URLs and refreshes only after confirmed deletion", async () => {
    vi.useFakeTimers();
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(projectEnvelope(projectFixture)), { headers: { "content-type": "application/json" } }),
    );
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useProjectListController({ page: 2, pageSize: 15, sortOrder: "desc", search: "" }), { wrapper });

    act(() => result.current.form.setValue("search", "systems"));
    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });
    expect(router.push).toHaveBeenCalledWith("/admin/projects?page=1&pageSize=15&sortBy=createdAt&sortOrder=desc&search=systems");
    router.push.mockClear();
    act(() => result.current.handleNextPage(4));
    expect(router.push).toHaveBeenCalledWith("/admin/projects?page=4&pageSize=15&sortBy=createdAt&sortOrder=desc&search=systems");

    vi.useRealTimers();
    act(() => result.current.confirmDeleteProject(17));
    act(() => result.current.confirmModal?.onConfirm());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.refresh).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith("/api/v1/project/17", expect.objectContaining({ method: "DELETE" }));
    act(() => queryClient.clear());
  });
});
