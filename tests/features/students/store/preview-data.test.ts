// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useImportStudentStore } from "@/features/students/store/preview-data";

const storageKey = "import-students-storage";
const rows = [
  { studentCode: "64000000001", email: "first@example.com", firstNameTh: "หนึ่ง", lastNameTh: "ก" },
  { studentCode: "64000000002", email: "middle@example.com", firstNameTh: "สอง", lastNameTh: "ข" },
  { studentCode: "64000000001", email: "duplicate@example.com", firstNameTh: "ซ้ำ", lastNameTh: "ค" },
  { studentCode: "64000000001", email: "last@example.com", firstNameTh: "ซ้ำอีก", lastNameTh: "ง" },
];

function resetStore() {
  useImportStudentStore.persist.clearStorage();
  useImportStudentStore.setState({ importData: [] });
  localStorage.removeItem(storageKey);
}

beforeEach(resetStore);
afterEach(resetStore);

describe("student import preview store", () => {
  it("persists rows and restores them when storage is rehydrated", async () => {
    useImportStudentStore.getState().setImportData(rows);
    const saved = localStorage.getItem(storageKey);
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).state.importData).toEqual(rows);

    useImportStudentStore.setState({ importData: [] });
    localStorage.setItem(storageKey, saved!);
    await useImportStudentStore.persist.rehydrate();

    expect(useImportStudentStore.getState().importData).toEqual(rows);
  });

  it("clears rows from the current state and persisted state", () => {
    useImportStudentStore.getState().setImportData(rows);

    useImportStudentStore.getState().clearImportData();

    expect(useImportStudentStore.getState().importData).toEqual([]);
    expect(JSON.parse(localStorage.getItem(storageKey)!).state.importData).toEqual([]);
  });

  it("deletes only the selected duplicate by student code and row index", () => {
    useImportStudentStore.getState().setImportData(rows);

    useImportStudentStore.getState().deleteByStudentId("64000000001", 2);

    expect(useImportStudentStore.getState().importData).toEqual([rows[0], rows[1], rows[3]]);
  });
});
