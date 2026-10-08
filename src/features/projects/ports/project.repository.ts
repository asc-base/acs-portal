import { IProject, QueryProject } from "@/features/projects/domain/project";
import { ApiResponse, Pageable } from "@/shared/types/response";

export interface IProjectRepository {
  getProjects(query: QueryProject): Promise<ApiResponse<Pageable<IProject>>>;
  getProjectById(id: string): Promise<ApiResponse<IProject>>;
  createProject(formData: FormData): Promise<ApiResponse<IProject>>;
  deleteProject(id: number): Promise<ApiResponse<IProject>>;
  updateProject(id: string, formData: FormData): Promise<ApiResponse<IProject>>;
}
