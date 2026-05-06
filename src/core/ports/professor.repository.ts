import { ApiResponse, Pageable } from "@/interface/response";
import { IProfessor} from "../domain/professor";
import { QueryProfessor } from "../domain/professor";

export interface IProfessorRepository {
  getProfessors(
    query: QueryProfessor,
  ): Promise<ApiResponse<Pageable<IProfessor>>>;
  getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
  updateProfessor(
    data: FormData,
    id: string,
  ): Promise<ApiResponse<IProfessor>>;
  createProfessor(data: FormData): Promise<ApiResponse<IProfessor>>;
}
