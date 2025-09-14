import { ApiResponse } from "@/interface/response";
import { IProfessor } from "@/interface/professor";

export interface IProfessorRepository {
    getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
}
