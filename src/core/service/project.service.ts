import { Pageable } from "@/interface/response";
import { IProject, QueryProject, IUpdateProjectData } from "../domain/project";
import { IProjectRepository } from "../ports/project.repository";

export class ProjectService {
  constructor(private projectRepository: IProjectRepository) { }

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
    if (query.search) params.set("search", query.search);

    console.log("params", params.toString());
    console.log("query", query);

    const response = await this.projectRepository.getProjects(query);
    return response.data;
  }

  async getProjectById(id: string): Promise<IProject> {
    const response = await this.projectRepository.getProjectById(id);
    return response.data;
  }

  async updateProject(id: string, data: IUpdateProjectData): Promise<IProject> {
    const formData = new FormData();
    if (data.title !== undefined) formData.append("title", data.title);
    if (data.details !== undefined) formData.append("details", data.details);
    if (data.youtubeURL !== undefined) formData.append("youtubeURL", data.youtubeURL);
    if (data.githubURL !== undefined) formData.append("githubURL", data.githubURL);
    if (data.documentURL !== undefined) formData.append("documentURL", data.documentURL);
    if (data.presentationURL !== undefined) formData.append("presentationURL", data.presentationURL);
    if (data.figmaURL !== undefined) formData.append("figmaURL", data.figmaURL);

    if (data.thumbnailFile) {
      formData.append("thumbnailFile", data.thumbnailFile);
    }

    if (data.techStacks) {
      formData.append("techStacks", JSON.stringify(data.techStacks));
    }

    if (data.newtagsID) {
      formData.append("newtagsID", JSON.stringify(data.newtagsID));
    }
    if (data.deletedtagsID) {
      formData.append("deletedtagsID", JSON.stringify(data.deletedtagsID));
    }
    if (data.newMembers) {
      formData.append("newMembers", JSON.stringify(data.newMembers));
    }
    if (data.deletedmembersID) {
      formData.append("deletedmembersID", JSON.stringify(data.deletedmembersID));
    }
    if (data.newCoursesID) {
      formData.append("newCoursesID", JSON.stringify(data.newCoursesID));
    }
    if (data.deletedCoursesID) {
      formData.append("deletedCoursesID", JSON.stringify(data.deletedCoursesID));
    }

    if (data.assets && data.assets.length > 0) {
      data.assets.forEach((file) => {
        formData.append("assets", file);
      });
    }

    const response = await this.projectRepository.updateProject(id, formData);
    return response.data;
  }
}
