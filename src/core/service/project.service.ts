import { Pageable } from "@/interface/response";
import { IProject, QueryProject, ICreateProject, IUpdateProject } from "../domain/project";
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

  async createProject(
    payload: ICreateProject,
    files: { thumbnailFile: File; assets: File[] },
  ): Promise<IProject> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === "object") {
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

  async deleteProject(id: number): Promise<IProject> {
    const response = await this.projectRepository.deleteProject(id);
    return response.data;
  }

  async updateProject(id: string, payload: IUpdateProject, files?: { thumbnailFile?: File | null; assets?: File[] }): Promise<IProject> {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value?.toString() ?? "");
      }
    });

    if (files?.thumbnailFile) {
      formData.append("thumbnailFile", files.thumbnailFile);
    }
    
    if (files?.assets) {
      files.assets.forEach((file) => formData.append("assets", file));
    }

    const response = await this.projectRepository.updateProject(id, formData);
    return response.data;
  }
}
