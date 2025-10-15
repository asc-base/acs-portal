import { ICourseRepository } from "@/core/ports/course.repository";
import { ICourse, QueryCourse } from "@/core/domain/course";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class CourseRepository implements ICourseRepository {
  private http: HttpHelper;
  private baseUrl: string;

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

    const url = `/v1/course?${params.toString()}`;

    const response = await this.http.get<ApiResponse<Pageable<ICourse>>>(url);
    return response;
  }
}
