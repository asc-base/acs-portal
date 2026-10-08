import type { StudentResponse } from "@/shared/schema/profile-response";
import type {
  CreateStudentRequest,
  QueryStudent as QueryStudentType,
  UpdateStudentRequest,
} from "@/features/students/schema/student";

export type IStudent = StudentResponse;
export type QueryStudent = QueryStudentType;
export type ICreateStudent = CreateStudentRequest;
export type IUpdateStudent = Omit<UpdateStudentRequest, "classBookID" | "imageFile">;
