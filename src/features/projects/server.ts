import "server-only";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createProjectServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new ProjectService(new ProjectRepository(baseUrl, http));
}
