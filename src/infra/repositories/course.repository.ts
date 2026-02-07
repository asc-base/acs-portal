import { ICourseRepository } from "@/core/ports/course.repository";
import {
  ICourse,
  ICreateCourse,
  IUpdateCourse,
  QueryCourse,
} from "@/core/domain/course";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class CourseRepository implements ICourseRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getCourse(query: QueryCourse): Promise<ApiResponse<Pageable<ICourse>>> {
    const params = new URLSearchParams();

    if (query.page !== undefined) params.append("page", query.page.toString());
    if (query.pageSize !== undefined)
      params.append("pageSize", query.pageSize.toString());
    if (query.prerequisite !== undefined)
      params.append("prerequisite", String(query.prerequisite));
    if (query.curriculumId !== undefined)
      params.append("curriculumId", query.curriculumId.toString());
    if (query.typecourseId !== undefined)
      params.append("typecourseId", query.typecourseId.toString());
    if (query.search !== undefined)
      params.append("search", query.search.toString());
    if (query.sortBy !== undefined)
      params.append("sortBy", query.sortBy.toString());
    if (query.sortOrder !== undefined)
      params.append("sortOrder", query.sortOrder.toString());

    const url = `/v1/course?${params.toString()}`;

    const response = await this.http.get<ApiResponse<Pageable<ICourse>>>(url);
    return response;
  }

  async createCourse(data: ICreateCourse): Promise<ApiResponse<ICourse>> {
    const response = await this.http.post<ApiResponse<ICourse>>(
      `/v1/course`,
      data,
    );
    return response;
  }

  async getCourseById(id: number): Promise<ApiResponse<ICourse> | null> {
    const response = await this.http.get<ApiResponse<ICourse>>(
      `/v1/course/${id}`,
    );
    return response;
  }

  async updateCourse(
    id: number,
    data: IUpdateCourse,
  ): Promise<ApiResponse<ICourse>> {
    const response = await this.http.patch<ApiResponse<ICourse>>(
      `/v1/course/${id}`,
      data,
    );
    return response;
  }

  async deleteCourse(id: number): Promise<ApiResponse<ICourse>> {
    const response = await this.http.delete<ApiResponse<ICourse>>(
      `/v1/course/${id}`,
    );
    return response;
  }
}
