import { ICreateStudentCsv } from "@/core/domain/student";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ImportStudentState = {
  importData: ICreateStudentCsv[];
  importFile: File | null;
  setImportData: (data: ICreateStudentCsv[]) => void;
  setImportFile: (file: File) => void;
  clearImportData: () => void;
  deleteByStudentId: (studentId: string, index: number) => void;
};

export const useImportStudentStore = create<ImportStudentState>()(
  persist(
    (set) => ({
      importData: [],
      importFile: null,
      setImportData: (data) => set({ importData: data }),
      setImportFile: (file) => set({ importFile: file }),
      clearImportData: () => set({ importData: [], importFile: null }),
      deleteByStudentId: (studentCode: string, index: number) =>
        set((state) => ({
          importData: state.importData.filter(
            (row, i) => !(row.studentCode === studentCode && i === index),
          ),
        })),
    }),
    {
      name: "import-students-storage",
      partialize: (state) => ({
        importData: state.importData,
      }),
    },
  ),
);
