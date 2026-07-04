import { Pageable } from "@/interface/response";
import { IProject, QueryProject, ICreateProject } from "../domain/project";
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

  async createProject(payload: ICreateProject, files: { thumbnailFile: File; assets: File[] }): Promise<IProject> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() ?? "");
      }
    });

    formData.append("thumbnailFile", files.thumbnailFile);
    files.assets.forEach((file) => formData.append("assets", file));

    const response = await this.projectRepository.createProject(formData);
    return response.data;
  }
}
