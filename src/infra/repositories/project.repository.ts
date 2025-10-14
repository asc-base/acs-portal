import { IProjectRepository } from "@/core/ports/project.repository";
import { IProject, QueryProject } from "@/core/domain/project";
import { Pageable } from "@/interface/response";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";

export class ProjectRepository implements IProjectRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getProjects(
    query: QueryProject,
  ): Promise<ApiResponse<Pageable<IProject>>> {
    const {
      page,
      pageSize,
      sortBy = "createdAt",
      sortOrder = "desc",
      fields,
      categories,
      types,
      courses,
      classBooks,
    } = query;

    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    // Add filter parameters
    if (fields && fields.length > 0) {
      params.append("fields", fields.join(","));
    }
    if (categories && categories.length > 0) {
      params.append("categories", categories.join(","));
    }
    if (types && types.length > 0) {
      params.append("types", types.join(","));
    }
    if (courses && courses.length > 0) {
      params.append("courses", courses.join(","));
    }
    if (classBooks && classBooks.length > 0) {
      params.append("classBooks", classBooks.join(","));
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/projects${queryString}`;
    const response = await this.http.get<ApiResponse<Pageable<IProject>>>(url);
    return response;
  }
}
