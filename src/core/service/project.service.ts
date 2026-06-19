import { Pageable } from "@/interface/response";
import { IProject, QueryProject } from "../domain/project";
import { IProjectRepository } from "../ports/project.repository";
export class ProjectService {
  constructor(private projectRepository: IProjectRepository) {}

  async getProjects(query: QueryProject): Promise<Pageable<IProject>> {
    const response = await this.projectRepository.getProjects(query);
    return response.data;
  }

  async getProjectById(id: string): Promise<IProject> {
    const response = await this.projectRepository.getProjectById(id);
    return response.data;
  }

  async createProject(formData: FormData): Promise<any> {
    const response = await this.projectRepository.createProject(formData);
    return response.data;
  }
}
