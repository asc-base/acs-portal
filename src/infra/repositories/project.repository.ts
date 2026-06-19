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
    const params = new URLSearchParams();

    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.sortOrder) params.set("sortOrder", query.sortOrder);
    if (query.page) params.set("page", query.page.toString());
    if (query.pageSize) params.set("pageSize", query.pageSize.toString());
    if (query.fields && query.fields.length > 0)
      query.fields.forEach((id) => params.append("tagID", id));
    if (query.categories && query.categories.length > 0)
      query.categories.forEach((id) => params.append("tagID", id));
    if (query.types && query.types.length > 0)
      query.types.forEach((id) => params.append("tagID", id));
    if (query.courses && query.courses.length > 0)
      query.courses.forEach((id) => params.append("courseID", id));
    if (query.classBooks && query.classBooks.length > 0)
      query.classBooks.forEach((id) => params.append("classBookID", id));
    if (query.search) params.set("search", query.search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/project${queryString}`;
    const response = await this.http.get<ApiResponse<Pageable<IProject>>>(url);
    return response;
  }

  async getProjectById(id: string): Promise<ApiResponse<IProject>> {
    const url = `/v1/project/${id}`;
    const response = await this.http.get<ApiResponse<IProject>>(url);
    return response;
  }

  async createProject(formData: FormData): Promise<ApiResponse<any>> {
    const url = `/v1/project`;
    const response = await this.http.post<ApiResponse<any>>(url, formData);
    
    return response;
  }
}
