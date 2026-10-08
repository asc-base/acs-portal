import { ApiResponse, Pageable } from "@/shared/types/response";
import { IProfessor} from "@/features/professors/domain/professor";
import { QueryProfessor } from "@/features/professors/domain/professor";

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
  deleteProfessor(id: number): Promise<ApiResponse<IProfessor>>;
}
