import type { ICurriculumRepository } from "@/features/curriculum/ports/curriculum.repository";
import type { QueryCurriculum } from "@/features/curriculum/domain/curriculum";
import { HttpHelper } from "@/shared/lib/http";
import {
  CurriculumPageResponseSchema,
  CurriculumResponseSchema,
  NullableCurriculumResponseSchema,
} from "@/features/curriculum/schema/curriculum";

export class CurriculumRepository implements ICurriculumRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async getCurriculum(
    query: QueryCurriculum,
  ) {
    const searchParams = new URLSearchParams({
      page: query.page?.toString() || "1",
      pageSize: query.pageSize?.toString() || "10",
    });
    if (query.year) {
      searchParams.append("year", query.year);
    }
    if (query.sortBy) {
      searchParams.append("sortBy", query.sortBy);
    }

    if (query.orderBy) {
      searchParams.append("orderBy", query.orderBy);
    }

    const url = `/v1/curriculums?${searchParams.toString()}`;

    const response = await this.http.get<unknown>(url);
    return CurriculumPageResponseSchema.parse(response);
  }

  async getCurriculumById(id: number) {
    const url = `/v1/curriculums/${id}`;
    const response = await this.http.get<unknown>(url);
    return response === null ? null : NullableCurriculumResponseSchema.parse(response);
  }

  async createCurriculum(data: FormData) {
    const response = await this.http.post<unknown>(
      `/v1/curriculums/`,
      data,
    );
    return CurriculumResponseSchema.parse(response);
  }

  async updateCurriculum(
    id: number,
    data: FormData,
  ) {
    const response = await this.http.patch<unknown>(
      `/v1/curriculums/${id}`,
      data,
    );
    return CurriculumResponseSchema.parse(response);
  }

  async deleteCurriculum(id: number) {
    const response = await this.http.delete<unknown>(
      `/v1/curriculums/${id}`,
    );
    return CurriculumResponseSchema.parse(response);
  }
}
