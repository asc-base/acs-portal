import { ApiResponse, Pageable } from "@/interface/response";
import { IStudent, QueryStudent, ICreateStudentCsv } from "../domain/student";

export interface IStudentRepository {
  getStudents(query: QueryStudent): Promise<ApiResponse<Pageable<IStudent>>>;
  getStudentByUserId(id: number): Promise<ApiResponse<IStudent>>;
  createStudent(data: FormData): Promise<ApiResponse<IStudent>>;
  deleteStudent(id: number): Promise<ApiResponse<IStudent>>;
  updateStudent(data: FormData, studentId: number): Promise<ApiResponse<IStudent>>;
  createStudentBatch(data: { classBookID: number, students: ICreateStudentCsv[]; }): Promise<ApiResponse<IStudent[]>>;
}

