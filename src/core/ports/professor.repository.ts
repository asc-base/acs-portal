import { ApiResponse } from "@/interface/response";
import { IProfessor } from "../domain/professor";

export interface IProfessorRepository {
    getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
}
