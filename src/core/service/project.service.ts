import { Pageable } from "@/interface/response";
import { IProject, QueryProject } from "../domain/project";
import { IProjectRepository } from "../ports/project.repository";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อโปรเจกต์"),
  details: z.string().trim().min(1, "กรุณากรอกรายละเอียด"),
  youtubeURL: z.string().trim().url("ลิงก์ YouTube ไม่ถูกต้อง").or(z.literal("")),
  githubURL: z.string().trim().url("ลิงก์ Github ไม่ถูกต้อง").or(z.literal("")),
  documentURL: z.string().trim().url("ลิงก์ Document ไม่ถูกต้อง").or(z.literal("")),
  presentationURL: z.string().trim().url("ลิงก์ Presentation ไม่ถูกต้อง").or(z.literal("")),
  figmaURL: z.string().trim().url("ลิงก์ Figma ไม่ถูกต้อง").or(z.literal("")),
});

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

    const response = await this.projectRepository.getProjects(params);
    return response.data;
  }

  async getProjectById(id: string): Promise<IProject> {
    const response = await this.projectRepository.getProjectById(id);
    return response.data;
  }
  async updateProject(id: string, data: FormData): Promise<IProject> {
    const title = (data.get("title") as string) || "";
    const details = (data.get("details") as string) || "";
    const youtubeURL = (data.get("youtubeURL") as string) || "";
    const githubURL = (data.get("githubURL") as string) || "";
    const documentURL = (data.get("documentURL") as string) || "";
    const presentationURL = (data.get("presentationURL") as string) || "";
    const figmaURL = (data.get("figmaURL") as string) || "";

    const validation = updateSchema.safeParse({
      title,
      details,
      youtubeURL,
      githubURL,
      documentURL,
      presentationURL,
      figmaURL,
    });

    if (!validation.success) {
      const errorMsg = validation.error.issues.map((issue) => issue.message).join(", ");
      throw new Error(`การตรวจสอบข้อมูลล้มเหลว: ${errorMsg}`);
    }

    const response = await this.projectRepository.updateProject(id, data);
    return response.data;
  }
}
