import { ApiResponse, Pageable } from "@/interface/response";
import { IProfessor } from "../domain/professor";
import { QueryProfessor } from "../domain/professor";

export interface IProfessorRepository {
     getProfessors(
       query: QueryProfessor
      ): Promise<ApiResponse<Pageable<IProfessor>>>;
    getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
}
