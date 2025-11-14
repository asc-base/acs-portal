import { ApiResponse, Pageable } from "@/interface/response";
import { IStudent, QueryStudent } from "../domain/student";

export interface IStudentRepository {
  getStudents(query: QueryStudent): Promise<ApiResponse<Pageable<IStudent>>>;
  getStudentByUserId(id:number):Promise<ApiResponse<IStudent>>;
}

