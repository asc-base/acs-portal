import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useCreateStudentBatch } from "@/features/students/client";
import type { CreateStudentCsv } from "@/features/students/schema/student-csv";
import { useImportStudentStore } from "@/features/students/store/preview-data";
import type { UploadStatus } from "@/features/students/components/admin/uploadStudentFileModal";

function mapCsvRow(row: Record<string, string | undefined>): CreateStudentCsv {
  return {
    studentCode: row.studentCode ?? "",
    email: row.email ?? "",
    firstNameTh: row.firstNameTh ?? "",
    lastNameTh: row.lastNameTh ?? "",
    ...(row.firstNameEn !== undefined && { firstNameEn: row.firstNameEn }),
    ...(row.lastNameEn !== undefined && { lastNameEn: row.lastNameEn }),
    ...(row.nickName !== undefined && { nickName: row.nickName }),
  };
}

function parseStudentCsv(file: File): Promise<CreateStudentCsv[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string | undefined>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim().replace(/^\uFEFF/, ""),
      complete: ({ data }) => resolve(data.map(mapCsvRow)),
      error: reject,
    });
  });
}

export function useStudentCsvUploadController(classBookID: number) {
  const router = useRouter();
  const createStudentBatch = useCreateStudentBatch();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const operationInProgress = useRef(false);

  const handleUpload = async (file: File) => {
    if (operationInProgress.current) return;
    operationInProgress.current = true;
    setIsUploadModalOpen(false);

    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      setUploadStatus("loading");
      try {
        const students = await parseStudentCsv(file);
        if (students.length === 0) {
          setErrorMessage("ไม่พบข้อมูลนักศึกษาในไฟล์ CSV");
          setUploadStatus(null);
          return;
        }
        useImportStudentStore.getState().setImportData(students);
        setUploadStatus(null);
        router.push(`/admin/students/preview?classBookID=${classBookID}`);
      } catch {
        setErrorMessage("ไม่สามารถอ่านไฟล์ CSV ได้ กรุณาตรวจสอบไฟล์");
        setUploadStatus(null);
      } finally {
        operationInProgress.current = false;
      }
      return;
    }

    setUploadStatus("loading");
    try {
      await createStudentBatch.mutateAsync({ classBookID: Number(classBookID), file });
      setUploadStatus("success");
    } catch {
      setUploadStatus("error");
    } finally {
      operationInProgress.current = false;
    }
  };

  return {
    isUploadModalOpen,
    openUploadModal: () => setIsUploadModalOpen(true),
    closeUploadModal: () => setIsUploadModalOpen(false),
    uploadStatus,
    errorMessage,
    closeError: () => setErrorMessage(""),
    handleUpload,
    retryUpload: () => {
      setUploadStatus(null);
      setIsUploadModalOpen(true);
    },
    closeUploadProgress: () => setUploadStatus(null),
    confirmUpload: () => {
      setUploadStatus(null);
      router.refresh();
    },
  };
}
