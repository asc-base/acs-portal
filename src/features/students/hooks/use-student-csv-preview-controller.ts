import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateStudentBatch } from "@/features/students/client";
import {
  CreateStudentCsvSchema,
  type CreateStudentCsv,
} from "@/features/students/schema/student-csv";
import { useImportStudentStore } from "@/features/students/store/preview-data";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

const duplicateMessage = "เนื่องจากมีข้อมูลบางรายการซ้ำกัน กรุณาแก้ไขก่อนดำเนินการถัดไป";

export function useStudentCsvPreviewController(classBookID: number) {
  const router = useRouter();
  const createStudentBatch = useCreateStudentBatch();
  const { importData, deleteByStudentId, setImportData } = useImportStudentStore();
  const [alert, setAlert] = useState({ open: false, message: "", severity: "error" as const });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const submitting = useRef(false);

  const duplicateIds = useMemo(() => {
    const seen = new Set<string>();
    const duplicate = new Set<string>();
    importData.forEach(({ studentCode }) => {
      const normalizedCode = studentCode.trim();
      if (seen.has(normalizedCode)) duplicate.add(normalizedCode);
      else seen.add(normalizedCode);
    });
    return [...duplicate];
  }, [importData]);

  const rowErrors = useMemo(
    () =>
      importData.flatMap((student, index) => {
        const result = CreateStudentCsvSchema.safeParse(student);
        return result.success
          ? []
          : result.error.issues.map((issue) => `แถว ${index + 2}: ${issue.message}`);
      }),
    [importData],
  );

  useEffect(() => {
    if (duplicateIds.length > 0) {
      setAlert({ open: true, message: duplicateMessage, severity: "error" });
    } else {
      setAlert((previous) =>
        previous.message === duplicateMessage ? { ...previous, open: false } : previous,
      );
    }
  }, [duplicateIds]);

  const updateStudentRow = (
    index: number,
    field: keyof CreateStudentCsv,
    value: string,
  ) => {
    const rows = useImportStudentStore.getState().importData;
    setImportData(rows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row,
    ));
  };

  const deleteStudentRowById = (studentCode: string, index: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        deleteByStudentId(studentCode, index);
        setConfirmModal(null);
      },
    });
  };

  const onSubmit = async () => {
    if (submitting.current || createStudentBatch.isPending || confirmModal?.type === "success") return;
    if (duplicateIds.length > 0) {
      setAlert({ open: true, message: duplicateMessage, severity: "error" });
      return;
    }

    const result = CreateStudentCsvSchema.array().safeParse(importData);
    if (importData.length === 0 || !result.success) {
      setAlert({
        open: true,
        message: rowErrors.length > 0
          ? `ข้อมูลนักศึกษาไม่ถูกต้อง\n${rowErrors.join("\n")}`
          : "ข้อมูลนักศึกษาไม่ถูกต้อง",
        severity: "error",
      });
      return;
    }

    submitting.current = true;
    try {
      await createStudentBatch.mutateAsync({
        classBookID: Number(classBookID),
        students: result.data,
      });
      useImportStudentStore.getState().clearImportData();
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          router.push(`/admin/students?page=1&pageSize=10&classBookID=${classBookID}`);
        },
      });
    } catch {
      setAlert({ open: true, message: "ไม่สามารถเพิ่มข้อมูลนักศึกษาได้", severity: "error" });
    } finally {
      submitting.current = false;
    }
  };

  return {
    students: importData,
    duplicateIds,
    rowErrors,
    isSubmitDisabled: importData.length === 0 || duplicateIds.length > 0 || createStudentBatch.isPending,
    alert,
    confirmModal,
    editingIndex,
    onSubmit,
    onCloseAlert: () => setAlert((previous) => ({ ...previous, open: false })),
    onBack: () => router.push(`/admin/students?classBookID=${classBookID}`),
    toggleRowEditing: (index: number) => setEditingIndex((previous) => previous === index ? null : index),
    updateStudentRow,
    deleteStudentRowById,
  };
}
