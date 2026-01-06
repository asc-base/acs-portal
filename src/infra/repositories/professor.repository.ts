import { IProfessorRepository } from "@/core/ports/professor.repository";
import { IProfessor, IUpdateProfessor } from "@/core/domain/professor";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";
import { QueryProfessor } from "@/core/domain/professor";

export class ProfessorRepository implements IProfessorRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getProfessors(
    query: QueryProfessor,
  ): Promise<ApiResponse<Pageable<IProfessor>>> {
    const {
      page,
      pageSize,
      educations,
      expertFields,
      majorPosition,
      academicPosition,
    } = query;

    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());

    if (educations && educations.length > 0) {
      params.append("educations", educations);
    }
    if (expertFields && expertFields.length > 0) {
      params.append("expertFields", expertFields);
    }
    if (majorPosition && majorPosition.length > 0) {
      params.append("majorPosition", majorPosition);
    }
    if (academicPosition && academicPosition.length > 0) {
      params.append("academicPosition", academicPosition);
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/professors${queryString}`;
    const response =
      await this.http.get<ApiResponse<Pageable<IProfessor>>>(url);
    return response;
  }

  async getProfessorById(id: string): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.get<ApiResponse<IProfessor>>(
      `/v1/professors/${id}`,
    );
    return response;
  }

  async updateProfessor(
    data: IUpdateProfessor,
    id: string,
  ): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.put<ApiResponse<IProfessor>>(
      `/v1/professors/${id}`,
      data,
    );
    return response;
  }

  // async createProfessor(data: FormData): Promise<ApiResponse<IProfessor>> {
  //   const response = await this.http.post<ApiResponse<IProfessor>>(
  //     `/v2/professors`,
  //     data,
  //   );
  //   return response;
  // }
}
