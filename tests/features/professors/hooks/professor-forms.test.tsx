// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateProfessorForm } from "@/features/professors/hooks/useCreateProfessorForm";
import { useUpdateProfessorForm } from "@/features/professors/hooks/useUpdateProfessorForm";

const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const professor = {
  id: 9,
  email: "somchai@example.test",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
  firstNameEn: "Somchai",
  lastNameEn: "Jaidee",
  imageUrl: "https://example.test/portrait.png",
  imageFocalPointX: null,
  imageFocalPointY: null,
  prefix: { id: 2, sequence: 1, nameTh: "อาจารย์", nameEn: "Professor", shortNameTh: "อ.", shortNameEn: "Prof." },
  professor: {
    id: 31,
    profRoom: "A201",
    phone: "0812345678",
    expertFields: ["Computer science"],
    educations: ["PhD"],
    research_profile: null,
  },
};
let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
  router.push.mockReset();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function submitEvent() {
  return { preventDefault: vi.fn(), persist: vi.fn() } as never;
}

function response() {
  return new Response(JSON.stringify({ data: professor, status: 200 }), {
    headers: { "content-type": "application/json" },
  });
}

describe("professor form controllers", () => {
  it("maps create field arrays, crop points, and the image into the multipart request", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response());
    const { result } = renderHook(() => useCreateProfessorForm(), { wrapper });
    const image = new File(["cropped"], "portrait.png", { type: "image/png" });

    act(() => {
      result.current.setValue("prefixID", 2);
      result.current.setValue("firstNameTh", "สมชาย");
      result.current.setValue("lastNameTh", "ใจดี");
      result.current.setValue("firstNameEn", "");
      result.current.setValue("lastNameEn", "");
      result.current.setValue("email", "somchai@example.test");
      result.current.setValue("phone", "0812345678");
      result.current.setValue("profRoom", "A201");
      result.current.appendEducation({ value: "B.Sc." });
      result.current.appendEducation({ value: "PhD" });
      result.current.appendExpert({ value: "Systems" });
      result.current.appendExpert({ value: "AI" });
      result.current.handleCropComplete(image, { x: 0.25, y: 0.75 });
    });
    await act(async () => result.current.submit(submitEvent()));

    const options = fetch.mock.calls[0][1] as RequestInit;
    const body = options.body as FormData;
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/professors",
      expect.objectContaining({ method: "POST", body }),
    );
    expect(Object.fromEntries(body.entries())).toMatchObject({
      prefixID: "2",
      educations: "B.Sc./PhD",
      expertFields: "Systems/AI",
      firstNameEn: "",
      lastNameEn: "",
      research_profile: "",
      imageFocalPointX: "0.25",
      imageFocalPointY: "0.75",
      imageFile: image,
    });
    expect(result.current.confirmModal?.type).toBe("success");
  });

  it("resets edit fields from the profile and maps updated arrays with the crop file", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response());
    const { result } = renderHook(() => useUpdateProfessorForm(professor), {
      wrapper,
    });
    const image = new File(["cropped"], "portrait.png", { type: "image/png" });
    await waitFor(() => expect(result.current.educationFields).toHaveLength(1));

    act(() => {
      result.current.appendEducation({ value: "M.Sc." });
      result.current.appendExpert({ value: "AI" });
      result.current.handleCropComplete(image, { x: 0.1, y: 0.9 });
    });
    await act(async () => result.current.submit(submitEvent()));

    const options = fetch.mock.calls[0][1] as RequestInit;
    const body = options.body as FormData;
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/professors/9",
      expect.objectContaining({ method: "PATCH", body }),
    );
    expect(Object.fromEntries(body.entries())).toMatchObject({
      educations: "PhD/M.Sc.",
      expertFields: "Computer science/AI",
      imageFocalPointX: "0.1",
      imageFocalPointY: "0.9",
      imageFile: image,
    });
    expect(body.has("phone")).toBe(false);
    expect(body.has("email")).toBe(false);
    expect(body.has("id")).toBe(false);
    expect(result.current.isEdit).toBe(false);
    expect(result.current.confirmModal?.type).toBe("success");
  });

  it("sends an empty education list when every education is removed", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response());
    const { result } = renderHook(() => useUpdateProfessorForm(professor), {
      wrapper,
    });
    await waitFor(() => expect(result.current.educationFields).toHaveLength(1));

    act(() => result.current.removeEducation(0));
    await act(async () => result.current.submit(submitEvent()));

    const body = fetch.mock.calls[0]?.[1]?.body as FormData;
    expect(body.get("educations")).toBe("");
    expect(body.has("phone")).toBe(false);
  });

  it("does not issue a request when the professor form is unchanged", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(response());
    const { result } = renderHook(() => useUpdateProfessorForm(professor), {
      wrapper,
    });

    await act(async () => result.current.submit(submitEvent()));

    expect(fetch).not.toHaveBeenCalled();
  });
});
