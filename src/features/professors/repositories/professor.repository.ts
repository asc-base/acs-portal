import { IProfessorRepository } from "@/features/professors/ports/professor.repository";
import { IProfessor } from "@/features/professors/domain/professor";
import { HttpHelper } from "@/shared/lib/http";
import { ApiResponse, Pageable } from "@/shared/types/response";
import { QueryProfessor } from "@/features/professors/domain/professor";
import { ProfessorResponseSchema } from "@/shared/schema/profile-response";

export class ProfessorRepository implements IProfessorRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
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
      search,
      searchBy,
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
    if (search) {
      params.append("search", search);
    }
    if (searchBy) {
      params.append("searchBy", searchBy);
    }
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/professors${queryString}`;
    const response =
      await this.http.get<ApiResponse<Pageable<IProfessor>>>(url);
    return {
      ...response,
      data: {
        ...response.data,
        rows: ProfessorResponseSchema.array().parse(response.data.rows),
      },
    };
  }

  async getProfessorById(id: string): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.get<ApiResponse<IProfessor>>(
      `/v1/professors/${id}`,
    );
    return { ...response, data: ProfessorResponseSchema.parse(response.data) };
  }

  async updateProfessor(
    data: FormData,
    id: string,
  ): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.patch<ApiResponse<IProfessor>>(
      `/v1/professors/${id}`,
      data,
    );
    return { ...response, data: ProfessorResponseSchema.parse(response.data) };
  }

  async createProfessor(data: FormData): Promise<ApiResponse<IProfessor>> {
    const response = await this.http.post<ApiResponse<IProfessor>>(
      `/v1/professors`,
      data,
    );
    return { ...response, data: ProfessorResponseSchema.parse(response.data) };
  }

async deleteProfessor(id: number): Promise<ApiResponse<IProfessor>> {

  const response = await this.http.delete<ApiResponse<IProfessor>>(
    `/v1/professors/${id}`,
  );

  return { ...response, data: ProfessorResponseSchema.parse(response.data) };
}
}
