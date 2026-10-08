// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/lib/http";
import { useCreateProject, useProjects } from "@/features/projects/client";
import { projectEnvelope, projectFixture, projectPageFixture } from "./fixtures";

const request = {
  title: "Project",
  details: "Project details",
  youtubeURL: "https://youtube.com/watch?v=123",
  githubURL: "https://github.com/kmutt/project",
  documentURL: "https://example.test/document",
  presentationURL: "https://example.test/presentation",
  figmaURL: "",
  coursesID: [3],
  tagsID: [2],
  techStacks: ["TypeScript"],
  members: [{ userID: 7, roleID: 2 }],
  thumbnailFocalPointX: 0,
  thumbnailFocalPointY: 75,
};

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

describe("project data hooks", () => {
  it("exposes pending and success, preserves multipart request data, and invalidates lists", async () => {
    let finishRequest!: (response: Response) => void;
    const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) => init?.method === "GET"
        ? Promise.resolve(new Response(JSON.stringify(projectEnvelope(projectPageFixture)), { headers: { "content-type": "application/json" } }))
        : new Promise((resolve) => { finishRequest = resolve; }),
    );
    const wrapper = createWrapper();
    const list = renderHook(() => useProjects({ page: 1 }), { wrapper });
    const create = renderHook(() => useCreateProject(), { wrapper });
    queryClient.setQueryData(["projects", "list", { page: 2 }], projectPageFixture);
    await waitFor(() => expect(list.result.current.data).toEqual(projectPageFixture));

    let mutation!: Promise<unknown>;
    act(() => {
      mutation = create.result.current.mutateAsync({
        payload: request,
        files: {
          thumbnailFile: new File(["thumbnail"], "thumbnail.png", { type: "image/png" }),
          assets: [new File(["asset"], "asset.png", { type: "image/png" })],
        },
      });
    });
    await waitFor(() => expect(create.result.current.isPending).toBe(true));
    await act(async () => {
      finishRequest(new Response(JSON.stringify(projectEnvelope(projectFixture)), { headers: { "content-type": "application/json" } }));
      await expect(mutation).resolves.toEqual(projectFixture);
    });

    const [url, init] = fetch.mock.calls.find(([, options]) => options?.method === "POST")!;
    expect(url).toBe("/api/v1/project");
    expect(init?.body).toBeInstanceOf(FormData);
    expect((init?.body as FormData).get("thumbnailFocalPointX")).toBe("0");
    expect(queryClient.getQueryState(["projects", "list", { page: 2 }])?.isInvalidated).toBe(true);
  });

  it("preserves HTTP mutation errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
      JSON.stringify({ message: "forbidden" }),
      { status: 403, statusText: "Forbidden", headers: { "content-type": "application/json" } },
    ));
    const wrapper = createWrapper();
    const create = renderHook(() => useCreateProject(), { wrapper });

    await act(async () => {
      await expect(create.result.current.mutateAsync({
        payload: request,
        files: { thumbnailFile: new File(["image"], "thumbnail.png"), assets: [] },
      })).rejects.toBeInstanceOf(HttpError);
    });
    await waitFor(() => expect(create.result.current.isError).toBe(true));
    expect(create.result.current.error).toMatchObject({ status: 403 });
  });
});
