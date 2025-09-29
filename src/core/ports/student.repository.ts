import { ApiResponse } from "@/interface/response";
import { IStudent } from "../domain/student";

export interface IStudentRepository {
    getStudentById(id:string):Promise<ApiResponse<IStudent>>;
}
