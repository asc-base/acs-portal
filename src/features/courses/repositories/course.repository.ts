import { ICourseRepository } from "@/features/courses/ports/course.repository";
import {
  ICourse,
  ICreateCourse,
  IUpdateCourse,
  QueryCourse,
} from "@/features/courses/domain/course";
import { HttpHelper } from "@/shared/lib/http";
import { ApiResponse, Pageable } from "@/shared/types/response";

export class CourseRepository implements ICourseRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async getCourse(query: QueryCourse): Promise<ApiResponse<Pageable<ICourse>>> {
    const params = new URLSearchParams();

    if (query.page !== undefined) params.append("page", query.page.toString());
    if (query.pageSize !== undefined)
      params.append("pageSize", query.pageSize.toString());
    if (query.prerequisite !== undefined)
      params.append("prerequisite", String(query.prerequisite));
    if (query.curriculumID !== undefined)
      params.append("curriculumID", query.curriculumID.toString());
    if (query.typeCourseID !== undefined)
      params.append("typeCourseID", query.typeCourseID.toString());
    if (query.search !== undefined)
      params.append("search", query.search.toString());
    if (query.orderBy !== undefined)
      params.append("orderBy", query.orderBy.toString());
    if (query.sortBy !== undefined)
      params.append("sortBy", query.sortBy.toString());

    const url = `/v1/courses?${params.toString()}`;

    const response = await this.http.get<ApiResponse<Pageable<ICourse>>>(url);
    return response;
  }

  async createCourse(data: ICreateCourse): Promise<ApiResponse<ICourse>> {
    const response = await this.http.post<ApiResponse<ICourse>>(
      `/v1/courses`,
      data,
    );
    return response;
  }

  async getCourseById(id: number): Promise<ApiResponse<ICourse> | null> {
    const response = await this.http.get<ApiResponse<ICourse>>(
      `/v1/courses/${id}`,
    );
    return response;
  }

  async updateCourse(
    id: number,
    data: IUpdateCourse,
  ): Promise<ApiResponse<ICourse>> {
    const response = await this.http.patch<ApiResponse<ICourse>>(
      `/v1/courses/${id}`,
      data,
    );
    return response;
  }

  async deleteCourse(id: number): Promise<ApiResponse<ICourse>> {
    const response = await this.http.delete<ApiResponse<ICourse>>(
      `/v1/courses/${id}`,
    );
    return response;
  }

  async createCourseBatch(data: FormData): Promise<ApiResponse<ICourse>> {
    const response = await this.http.post<ApiResponse<ICourse>>(
      `/v1/courses/batch`,
      data,
    );
    return response;
  }
}
