import type { ICourseRepository } from "@/features/courses/ports/course.repository";
import type {
  QueryCourse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/features/courses/schema/course";
import {
  CourseBatchResponseSchema,
  CoursePageResponseSchema,
  CourseResponseSchema,
  NullableCourseResponseSchema,
} from "@/features/courses/schema/course";
import { HttpHelper } from "@/shared/lib/http";

export class CourseRepository implements ICourseRepository {
  private readonly http: HttpHelper;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.http = http;
  }

  async getCourse(query: QueryCourse) {
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
    if (query.search !== undefined) params.append("search", query.search);
    if (query.orderBy !== undefined) params.append("orderBy", query.orderBy);
    if (query.sortBy !== undefined) params.append("sortBy", query.sortBy);

    const response = await this.http.get<unknown>(
      `/v1/courses?${params.toString()}`,
    );
    return CoursePageResponseSchema.parse(response);
  }

  async createCourse(data: CreateCourseRequest) {
    const response = await this.http.post<unknown>(`/v1/courses`, data);
    return CourseResponseSchema.parse(response);
  }

  async getCourseById(id: number) {
    const response = await this.http.get<unknown>(`/v1/courses/${id}`);
    return response === null ? null : NullableCourseResponseSchema.parse(response);
  }

  async updateCourse(id: number, data: UpdateCourseRequest) {
    const response = await this.http.patch<unknown>(`/v1/courses/${id}`, data);
    return CourseResponseSchema.parse(response);
  }

  async deleteCourse(id: number) {
    const response = await this.http.delete<unknown>(`/v1/courses/${id}`);
    return CourseResponseSchema.parse(response);
  }

  async createCourseBatch(data: FormData) {
    const response = await this.http.post<unknown>(`/v1/courses/batch`, data);
    return CourseBatchResponseSchema.parse(response);
  }
}
