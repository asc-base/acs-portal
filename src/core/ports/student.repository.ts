import { ApiResponse, Pageable } from "@/interface/response";
import { IStudent } from "../domain/student";

export interface IStudentRepository {
  getStudents(
    page: number,
    pageSize: number,
    classBookId: number,
  ): Promise<ApiResponse<Pageable<IStudent>>>;
}
