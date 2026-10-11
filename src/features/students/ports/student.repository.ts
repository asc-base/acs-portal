import { ApiResponse, Pageable } from "@/shared/types/response";
import { IStudent, QueryStudent } from "@/features/students/domain/student";

export interface IStudentRepository {
  getStudents(query: QueryStudent): Promise<ApiResponse<Pageable<IStudent>>>;
  getStudentById(id: number): Promise<ApiResponse<IStudent>>;
  getStudentByUserId(userId: number): Promise<ApiResponse<IStudent | null>>;
  createStudent(data: FormData): Promise<ApiResponse<IStudent>>;
  deleteStudent(id: number): Promise<ApiResponse<IStudent>>;
  updateStudent(
    data: FormData,
    studentId: number,
  ): Promise<ApiResponse<IStudent>>;
  createStudentBatch(data: FormData): Promise<ApiResponse<null>>;
}
