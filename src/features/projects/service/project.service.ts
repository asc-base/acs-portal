import { Pageable } from "@/shared/types/response";
import type { IProject } from "@/features/projects/schema/project";
import {
  CreateProjectRequestSchema,
  ProjectIdSchema,
  QueryProjectSchema,
  UpdateProjectRequestSchema,
  type CreateProjectRequest,
  type QueryProjectInput,
  type UpdateProjectRequest,
} from "@/features/projects/schema/project";
import { IProjectRepository } from "../ports/project.repository";

export class ProjectService {
  constructor(private projectRepository: IProjectRepository) { }

  async getProjects(query: QueryProjectInput): Promise<Pageable<IProject>> {
    const response = await this.projectRepository.getProjects(QueryProjectSchema.parse(query));
    return response.data;
  }

  async getProjectById(id: string): Promise<IProject> {
    const response = await this.projectRepository.getProjectById(id);
    return response.data;
  }

  async createProject(
    payload: CreateProjectRequest,
    files: { thumbnailFile: File; assets: File[] },
  ): Promise<IProject> {
    const formData = new FormData();
    const request = CreateProjectRequestSchema.parse(payload);

    Object.entries(request).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });

    formData.append("thumbnailFile", files.thumbnailFile);
    files.assets.forEach((file) => formData.append("assets", file));

    const response = await this.projectRepository.createProject(formData);
    return response.data;
  }

  async deleteProject(id: number): Promise<IProject> {
    const projectID = ProjectIdSchema.parse(id);
    const response = await this.projectRepository.deleteProject(projectID);
    return response.data;
  }

  async updateProject(id: string, payload: UpdateProjectRequest, files?: { thumbnailFile?: File | null; assets?: File[] }): Promise<IProject> {
    const formData = new FormData();
    const request = UpdateProjectRequestSchema.parse(payload);

    Object.entries(request).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
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
