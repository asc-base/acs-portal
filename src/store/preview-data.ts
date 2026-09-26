import { ICreateStudentCsv } from "@/core/domain/student";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ImportStudentState = {
  importData: ICreateStudentCsv[];
  setImportData: (data: ICreateStudentCsv[]) => void;
  clearImportData: () => void;
  deleteByStudentId: (studentId: string, index: number) => void;
};

export const useImportStudentStore = create<ImportStudentState>()(
  persist(
    (set) => ({
      importData: [],
      setImportData: (data) => set({ importData: data }),
      clearImportData: () => set({ importData: [] }),
      deleteByStudentId: (studentCode: string, index: number) =>
        set((state) => ({
          importData: state.importData.filter(
            (row, i) => !(row.studentCode === studentCode && i === index),
          ),
        })),
    }),
    {
      name: "import-students-storage",
    },
  ),
);
