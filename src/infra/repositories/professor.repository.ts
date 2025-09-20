import { IProfessorRepository } from "@/core/ports/professor.repository";
import { IProfessor } from "@/core/domain/professor";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class ProfessorRepository implements IProfessorRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getProfessors(
        page: number,
        pageSize: number,
      ): Promise<ApiResponse<Pageable<IProfessor>>> {
        const url = `/v1/professors?page=${page}&pageSize=${pageSize}`;
    
        const response = await this.http.get<ApiResponse<Pageable<IProfessor>>>(url);
        return response;
      }

  async getProfessorById(id: string): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.get<ApiResponse<IProfessor>>(`/v1/professors/${id}`);
    return response;
  }
}
