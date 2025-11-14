import { IProject } from "../domain/project";
import { ApiResponse, Pageable } from "@/interface/response";

export interface IProjectRepository {
  getProjects(query: URLSearchParams): Promise<ApiResponse<Pageable<IProject>>>;
  getProjectById(id: string): Promise<ApiResponse<IProject>>;
}
