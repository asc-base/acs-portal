import { ApiResponse, Pageable } from "@/interface/response";
import { IStudent, QueryStudent , ICreateStudent } from "../domain/student";

export interface IStudentRepository {
  getStudents(query: QueryStudent): Promise<ApiResponse<Pageable<IStudent>>>;
  getStudentByUserId(id:number):Promise<ApiResponse<IStudent>>;
  createStudent(data : ICreateStudent[] , classBookId: number): Promise<ApiResponse<IStudent[]>>;
  deleteStudent(id : number): Promise<ApiResponse<IStudent>>;
  updateStudent(data : FormData , studentId : number): Promise<ApiResponse<IStudent>>;
}

