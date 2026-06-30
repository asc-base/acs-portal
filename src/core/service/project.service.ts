import { Pageable } from "@/interface/response";
import { IProject, QueryProject, ICreateProject } from "../domain/project";
import { IProjectRepository } from "../ports/project.repository";

export class ProjectService {
  constructor(private projectRepository: IProjectRepository) {}

  async getProjects(query: QueryProject): Promise<Pageable<IProject>> {
    const params = new URLSearchParams();

    if (query.sortBy) params.set("orderBy", query.sortBy);
    if (query.sortOrder) params.set("sortBy", query.sortOrder);
    if (query.page) params.set("page", query.page.toString());
    if (query.pageSize) params.set("pageSize", query.pageSize.toString());
    if (query.fields && query.fields.length > 0)
      params.set("fields", query.fields.join(","));
    if (query.categories && query.categories.length > 0)
      params.set("categories", query.categories.join(","));
    if (query.types && query.types.length > 0)
      params.set("types", query.types.join(","));
    if (query.courses && query.courses.length > 0)
      params.set("courses", query.courses.join(","));
    if (query.classBooks && query.classBooks.length > 0)
      params.set("classBooks", query.classBooks.join(","));
    if(query.search)params.set("search", query.search);

    console.log("params", params.toString());
    console.log("query", query);

    const response = await this.projectRepository.getProjects(params);
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
