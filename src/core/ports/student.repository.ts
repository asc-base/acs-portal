import { ApiResponse } from "@/interface/response";
import { IStudent } from "../domain/student";

export interface IStudentRepository {
    getStudentByUserId(id:string):Promise<ApiResponse<IStudent>>;
}
