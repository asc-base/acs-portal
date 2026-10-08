// @vitest-environment jsdom
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useStudentCsvUploadController } from "@/features/students/hooks/use-student-csv-upload-controller";
import { useStudentCsvPreviewController } from "@/features/students/hooks/use-student-csv-preview-controller";
import { useImportStudentStore } from "@/features/students/store/preview-data";

const { router } = vi.hoisted(() => ({ router: { push: vi.fn(), refresh: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const validStudent = {
  studentCode: "64000000001",
  email: "student@example.com",
  firstNameTh: "สมชาย",
  lastNameTh: "ใจดี",
};
let queryClient: QueryClient;

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function mockBatch(handler: () => Promise<Response>) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(() => handler());
}

function envelope(data: unknown, status = 200) {
  return new Response(JSON.stringify({ status, data, msg: "ok", err: null }), {
    status: status >= 400 ? status : 200,
    headers: { "content-type": "application/json" },
  });
}

beforeEach(() => {
  router.push.mockClear();
  router.refresh.mockClear();
  useImportStudentStore.persist.clearStorage();
  useImportStudentStore.setState({ importData: [] });
  localStorage.clear();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
  useImportStudentStore.persist.clearStorage();
  useImportStudentStore.setState({ importData: [] });
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("student CSV upload controller", () => {
  it("maps CSV columns into persisted preview rows and keeps student codes as strings", async () => {
    const { result } = renderHook(() => useStudentCsvUploadController(3), { wrapper });
    const file = new File(
      [
        "studentCode,email,firstNameTh,lastNameTh,firstNameEn,lastNameEn,nickName\n" +
          "06400000001,student@example.com,สมชาย,ใจดี,Somchai,Jaidee,ชาย",
      ],
      "students.csv",
      { type: "text/csv" },
    );

    await act(async () => result.current.handleUpload(file));

    expect(useImportStudentStore.getState().importData).toEqual([
      {
        studentCode: "06400000001",
        email: "student@example.com",
        firstNameTh: "สมชาย",
        lastNameTh: "ใจดี",
        firstNameEn: "Somchai",
        lastNameEn: "Jaidee",
        nickName: "ชาย",
      },
    ]);
    expect(router.push).toHaveBeenCalledWith("/admin/students/preview?classBookID=3");
  });

  it("keeps spreadsheet upload progress and reopens the file picker after a failure", async () => {
    const fetch = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(envelope({ message: "failed" }, 500))
      .mockResolvedValueOnce(envelope(null));
    const { result } = renderHook(() => useStudentCsvUploadController(3), { wrapper });
    const file = new File(["sheet"], "students.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await act(async () => result.current.handleUpload(file));
    expect(result.current.uploadStatus).toBe("error");
    expect(fetch).toHaveBeenCalledOnce();

    act(() => result.current.retryUpload());
    expect(result.current.isUploadModalOpen).toBe(true);
    expect(result.current.uploadStatus).toBeNull();

    await act(async () => result.current.handleUpload(file));
    expect(result.current.uploadStatus).toBe("success");
    expect(fetch).toHaveBeenCalledTimes(2);
    act(() => result.current.confirmUpload());
    expect(router.refresh).toHaveBeenCalledOnce();
  });
});

describe("student CSV preview controller", () => {
  it("exposes row validation errors and duplicate codes, then updates persisted editable rows", async () => {
    useImportStudentStore.getState().setImportData([
      validStudent,
      { ...validStudent, studentCode: "bad", email: "invalid" },
      { ...validStudent, studentCode: ` ${validStudent.studentCode} `, firstNameTh: "คนซ้ำ" },
    ]);
    const { result } = renderHook(() => useStudentCsvPreviewController(3), { wrapper });

    expect(result.current.duplicateIds).toEqual([validStudent.studentCode]);
    expect(result.current.rowErrors).toContain("แถว 3: รหัสนักศึกษาต้องมี 11 หลัก");
    expect(result.current.rowErrors).toContain("แถว 3: รูปแบบอีเมลไม่ถูกต้อง");

    act(() => result.current.updateStudentRow(1, "studentCode", "64000000002"));
    act(() => result.current.updateStudentRow(2, "studentCode", " 64000000003 "));

    expect(useImportStudentStore.getState().importData[1]?.studentCode).toBe("64000000002");
    expect(result.current.duplicateIds).toEqual([]);
    const fetch = vi.spyOn(globalThis, "fetch");
    await act(async () => result.current.onSubmit());
    expect(result.current.alert.message).toContain("แถว 3: รูปแบบอีเมลไม่ถูกต้อง");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("treats a null batch result as success and prevents overlapping submissions", async () => {
    useImportStudentStore.getState().setImportData([validStudent]);
    let finishFirst!: (response: Response) => void;
    const fetch = mockBatch(
      () => new Promise<Response>((resolve) => (finishFirst = resolve)),
    );
    const { result } = renderHook(() => useStudentCsvPreviewController(3), { wrapper });

    let firstSubmit!: Promise<void>;
    act(() => {
      firstSubmit = result.current.onSubmit();
      void result.current.onSubmit();
    });
    await waitFor(() => expect(fetch).toHaveBeenCalledOnce());
    expect(result.current.isSubmitDisabled).toBe(true);
    await act(async () => {
      finishFirst(envelope(null));
      await firstSubmit;
    });
    expect(result.current.confirmModal?.type).toBe("success");
    expect(useImportStudentStore.getState().importData).toEqual([]);
  });

  it("keeps preview data after an error so the user can retry", async () => {
    useImportStudentStore.getState().setImportData([validStudent]);
    const fetch = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(envelope({ message: "failed" }, 500))
      .mockResolvedValueOnce(envelope(null));
    const { result } = renderHook(() => useStudentCsvPreviewController(3), { wrapper });

    await act(async () => result.current.onSubmit());
    await waitFor(() => expect(result.current.alert.message).toBe("ไม่สามารถเพิ่มข้อมูลนักศึกษาได้"));
    expect(useImportStudentStore.getState().importData).toEqual([validStudent]);

    act(() => result.current.onCloseAlert());
    await act(async () => result.current.onSubmit());
    await waitFor(() => expect(result.current.confirmModal?.type).toBe("success"));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
