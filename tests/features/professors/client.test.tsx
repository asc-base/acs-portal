// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/lib/http";
import { useCreateProfessor } from "@/features/professors/client";

const professor = {
  id: 9,
  email: "somchai@example.test",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  professor: {
    id: 31,
    profRoom: "A201",
    phone: "0812345678",
    expertFields: ["Computer science"],
    educations: ["PhD"],
    research_profile: null,
  },
};
const request = {
  prefixID: 2,
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: null,
  lastNameEn: null,
  email: "somchai@example.test",
  phone: "0812345678",
  profRoom: "A201",
  research_profile: null,
  educations: "PhD",
  expertFields: "Computer science",
};
let queryClient: QueryClient;

afterEach(() => {
  vi.restoreAllMocks();
  queryClient.clear();
});

function renderCreateProfessor() {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return renderHook(() => useCreateProfessor(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe("professor mutation hooks", () => {
  it("exposes pending and success while invalidating professor data", async () => {
    let finishRequest!: (response: Response) => void;
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockReturnValue(new Promise((resolve) => (finishRequest = resolve)));
    const { result } = renderCreateProfessor();
    queryClient.setQueryData(["professors"], [professor]);

    let mutation!: Promise<unknown>;
    act(() => {
      mutation = result.current.mutateAsync({ data: request, imageFile: null });
    });
    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => {
      finishRequest(
        new Response(JSON.stringify({ data: professor, status: 200 }), {
          headers: { "content-type": "application/json" },
        }),
      );
      await expect(mutation).resolves.toMatchObject({ data: professor });
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/professors",
      expect.objectContaining({ method: "POST", body: expect.any(FormData) }),
    );
    expect(queryClient.getQueryState(["professors"])?.isInvalidated).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("keeps HTTP status and mutation error state on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "forbidden" }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderCreateProfessor();

    await act(async () => {
      await expect(
        result.current.mutateAsync({ data: request, imageFile: null }),
      ).rejects.toBeInstanceOf(HttpError);
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ status: 403 });
  });
});
