import { IProject, QueryProject } from "../domain/project";
import { ApiResponse, Pageable } from "@/interface/response";

export interface IProjectRepository {
  getProjects(query: QueryProject): Promise<ApiResponse<Pageable<IProject>>>;
  getProjectById(id: string): Promise<ApiResponse<IProject>>;
  deleteProject(id: string): Promise<ApiResponse<void>>;
}
