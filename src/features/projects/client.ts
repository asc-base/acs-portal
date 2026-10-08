import "client-only";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";
import { baseUrl } from "@/shared/config/api.client";

export const projectService = new ProjectService(new ProjectRepository(baseUrl));
