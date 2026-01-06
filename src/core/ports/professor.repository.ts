import { ApiResponse, Pageable } from "@/interface/response";
import { IProfessor, IUpdateProfessor } from "../domain/professor";
import { QueryProfessor } from "../domain/professor";

export interface IProfessorRepository {
  getProfessors(
    query: QueryProfessor,
  ): Promise<ApiResponse<Pageable<IProfessor>>>;
  getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
  updateProfessor(
    data: IUpdateProfessor,
    id: string,
  ): Promise<ApiResponse<IProfessor>>;
  // createProfessor(data: FormData): Promise<ApiResponse<IProfessor>>;
}
