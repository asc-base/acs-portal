import { ApiResponse, Pageable } from "@/interface/response";
import { IProfessor } from "../domain/professor";

export interface IProfessorRepository {
     getProfessors(
        page: number,
        pageSize: number,
      ): Promise<ApiResponse<Pageable<IProfessor>>>;
    getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
}
