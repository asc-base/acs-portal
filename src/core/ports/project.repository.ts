import { IProject, QueryProject } from "../domain/project";
import { ApiResponse, Pageable } from "@/interface/response";

export interface IProjectRepository {
  getProjects(query: QueryProject): Promise<ApiResponse<Pageable<IProject>>>;
}
