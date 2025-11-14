import { IProjectRepository } from "@/core/ports/project.repository";
import { IProject } from "@/core/domain/project";
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
    query: URLSearchParams,
  ): Promise<ApiResponse<Pageable<IProject>>> {
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const url = `/v1/projects${queryString}`;
    const response = await this.http.get<ApiResponse<Pageable<IProject>>>(url);
    return response;
  }

  async getProjectById(id: string): Promise<ApiResponse<IProject>> {
    const url = `/v1/projects/${id}`;
    const response = await this.http.get<ApiResponse<IProject>>(url);
    return response;
  }
}
