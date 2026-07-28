import { ICreateCourseCsv } from "@/core/domain/course";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ImportCourseState {
  importData: ICreateCourseCsv[];
  setImportData: (data: ICreateCourseCsv[]) => void;
  clearImportData: () => void;
  deleteByCourseCode: (courseCode: string, index: number) => void;
}

export const useImportCourseStore = create<ImportCourseState>()(
  persist(
    (set) => ({
      importData: [],
      setImportData: (data) => set({ importData: data }),
      clearImportData: () => set({ importData: [] }),
      deleteByCourseCode: (courseCode: string, index: number) =>
        set((state) => ({
          importData: state.importData.filter(
            (row, i) => !(row.courseCode === courseCode && i === index),
          ),
        })),
    }),
    {
      name: "import-courses-storage",
    },
  ),
);
