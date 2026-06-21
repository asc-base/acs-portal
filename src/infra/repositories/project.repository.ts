import { IProject, QueryProject, IUpdateProjectData } from "@/core/domain/project";
import { IProjectRepository } from "@/core/ports/project.repository";
import { Pageable } from "@/interface/response";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";
export class ProjectRepository implements IProjectRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getProjects(
    query: QueryProject,
  ): Promise<ApiResponse<Pageable<IProject>>> {
    const params = new URLSearchParams();

    if (query.sortBy) params.set("orderBy", query.sortBy);
    if (query.sortOrder) params.set("sortBy", query.sortOrder);
    if (query.page) params.set("page", query.page.toString());
    if (query.pageSize) params.set("pageSize", query.pageSize.toString());
    if (query.fields && query.fields.length > 0)
      query.fields.forEach((id) => params.append("tagID", id));
    if (query.categories && query.categories.length > 0)
      query.categories.forEach((id) => params.append("tagID", id));
    if (query.types && query.types.length > 0)
      query.types.forEach((id) => params.append("tagID", id));
    if (query.courses && query.courses.length > 0)
      query.courses.forEach((id) => params.append("courseID", id));
    if (query.classBooks && query.classBooks.length > 0)
      query.classBooks.forEach((id) => params.append("classBookID", id));
    if (query.search) params.set("search", query.search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/project${queryString}`;
    const response = await this.http.get<ApiResponse<Pageable<IProject>>>(url);
    return response;
  }

  async getProjectById(id: string): Promise<ApiResponse<IProject>> {
    const url = `/v1/project/${id}`;
    const response = await this.http.get<ApiResponse<IProject>>(url);
    return response;
  }

  async updateProject(id: string, data: IUpdateProjectData): Promise<ApiResponse<IProject>> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("details", data.details);
    formData.append("youtubeURL", data.youtubeURL);
    formData.append("githubURL", data.githubURL);
    formData.append("documentURL", data.documentURL);
    formData.append("presentationURL", data.presentationURL);
    formData.append("figmaURL", data.figmaURL);

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

    const url = `/v1/project/${id}`;
    const response = await this.http.put<ApiResponse<IProject>>(url, formData);
    return response;
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    const url = `/v1/project/${id}`;
    const response = await this.http.delete<ApiResponse<void>>(url);
    return response;
  }
}
