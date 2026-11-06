import type { ApiResponse } from "@/shared/types/response";
import type { IProfessor, QueryProfessor } from "@/features/professors/domain/professor";
import type { ProfessorPage } from "@/features/professors/schema/professor";

export interface IProfessorRepository {
  getProfessors(
    query: QueryProfessor,
  ): Promise<ApiResponse<ProfessorPage>>;
  getProfessorById(id: string): Promise<ApiResponse<IProfessor>>;
  updateProfessor(
    data: FormData,
    id: string,
  ): Promise<ApiResponse<IProfessor>>;
  createProfessor(data: FormData): Promise<ApiResponse<IProfessor>>;
  deleteProfessor(id: number): Promise<ApiResponse<IProfessor>>;
}
