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
  form.setValue("detail", "Project details");
  form.setValue("youtubeURL", "https://youtube.com/watch?v=123");
  form.setValue("githubURL", "https://github.com/kmutt/project");
  form.setValue("documentURL", "https://example.test/document");
  form.setValue("presentationURL", "https://example.test/presentation");
  form.setValue("projectCourses", [{ value: 3 }, { value: 8 }]);
  form.setValue("projectTypes", [{ value: 1 }]);
  form.setValue("projectCategories", [{ value: 2 }]);
  form.setValue("projectFields", [{ value: 1 }]);
  form.setValue("techStacks", [{ value: "TypeScript" }]);
  form.setValue("students", [{ userID: 7 }]);
  form.setValue("advisors", [{ userID: 9 }]);
  form.setValue("coAdvisors", []);
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
  it("maps typed members and focal points and caps and reorders gallery uploads", async () => {
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
    const payload = JSON.parse(String(body.get("payload")));
    expect(payload.members).toEqual([
      { userID: 7, memberType: "STUDENT" },
      { userID: 9, memberType: "ADVISOR" },
    ]);
    expect(payload.courseIds).toEqual([3, 8]);
    expect(payload.gallery.slice(0, 2)).toEqual([{ fileIndex: 0 }, { fileIndex: 1 }]);
    expect(payload.thumbnailFocalPointX).toBe(0);
    expect(payload.thumbnailFocalPointY).toBe(75);
    expect(body.get("thumbnailFile")).toBe(thumbnail);
    expect(body.getAll("assets")).toEqual(result.current.selectedAssets);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/projects");
    act(() => queryClient.clear());
  });

  it("replaces relations and reorders retained and uploaded gallery images", async () => {
    const project: IProject = {
      ...projectFixture,
      categories: [{ id: 1, name: "Education" }, { id: 5, name: "Business" }],
      projectTypes: [{ id: 1, name: "Research" }],
      members: [
        ...projectFixture.members,
        { user: { id: 9, email: "advisor@example.test", firstNameTh: "อาจารย์", lastNameTh: "ที่ปรึกษา" }, memberType: "ADVISOR", position: null },
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
      result.current.form.setValue("students", [{ userID: 11, position: "Backend" }]);
      result.current.form.setValue("advisors", [{ userID: 9, position: "Advisor" }]);
      result.current.form.setValue("coAdvisors", [{ userID: 10, position: "Co-advisor" }]);
      result.current.handleCropComplete(thumbnail, { x: -10, y: 120 });
      result.current.handleAssetsChange(filesEvent(assets));
    });
    act(() => {
      result.current.handleDragStart(1);
    });
    act(() => {
      result.current.handleDrop(0);
    });
    expect(result.current.selectedAssets).toHaveLength(9);
    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    const body = fetch.mock.calls[0]?.[1]?.body as FormData;
    const payload = JSON.parse(String(body.get("payload")));
    expect(payload.courseIds).toEqual([8]);
    expect(payload.categoryIds).toEqual([5]);
    expect(payload.projectTypeIds).toEqual([2]);
    expect(payload.fieldIds).toBeUndefined();
    expect(payload.members).toEqual([
      { userID: 11, memberType: "STUDENT", position: "Backend" },
      { userID: 9, memberType: "ADVISOR", position: "Advisor" },
      { userID: 10, memberType: "CO_ADVISOR", position: "Co-advisor" },
    ]);
    expect(payload.gallery.slice(0, 2)).toEqual([{ fileIndex: 0 }, { imageID: 22 }]);
    expect(body.get("thumbnailFile")).toBe(thumbnail);
    expect(payload.title).toBeUndefined();
    expect(payload.figmaURL).toBeUndefined();
    expect(payload.thumbnailFocalPointX).toBe(-10);
    expect(payload.thumbnailFocalPointY).toBe(120);
    expect(body.getAll("assets")).toEqual(result.current.selectedAssets);
    act(() => result.current.confirmModal?.onConfirm());
    expect(router.push).toHaveBeenCalledWith("/admin/projects");
    act(() => queryClient.clear());
  });

  it("restores the original gallery when an edit is canceled", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateProjectController("17", projectFixture), { wrapper });

    act(() => {
      result.current.setIsEditMode(true);
      result.current.handleAssetsChange(filesEvent([image("new.png")]));
    });
    expect(result.current.galleryItems).toHaveLength(2);

    act(() => result.current.cancelForm());
    expect(result.current.confirmModal?.type).toBe("warning");
    act(() => result.current.confirmModal?.onConfirm());

    expect(result.current.galleryItems).toEqual([{
      kind: "existing",
      imageID: 22,
      imageUrl: "https://example.test/asset.png",
      contentType: "image/png",
    }]);
    expect(result.current.isEditMode).toBe(false);
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
